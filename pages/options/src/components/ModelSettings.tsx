/*
 * Changes:
 * - Removed all conditional isDarkMode checks to enforce a professional dark theme
 * - Updated all input fields to use bg-slate-900 and border-white/10
 * - Updated all labels to use text-slate-400 or text-white
 * - Modernized the UI to match the professional landing page design
 */
import { useEffect, useState, useRef, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { FiSettings, FiCpu, FiHelpCircle } from 'react-icons/fi';
import {
  llmProviderStore,
  agentModelStore,
  speechToTextModelStore,
  AgentNameEnum,
  llmProviderModelNames,
  ProviderTypeEnum,
  getDefaultDisplayNameFromProviderId,
  getDefaultProviderConfig,
  getDefaultAgentModelParams,
  type ProviderConfig,
} from '@extension/storage';
import { t } from '@extension/i18n';

// Helper function to check if a model is an OpenAI reasoning model (O-series or GPT-5 models)
function isOpenAIReasoningModel(modelName: string): boolean {
  let modelNameWithoutProvider = modelName;
  if (modelName.includes('>')) {
    modelNameWithoutProvider = modelName.split('>')[1];
  }
  if (modelNameWithoutProvider.startsWith('openai/')) {
    modelNameWithoutProvider = modelNameWithoutProvider.substring(7);
  }
  return (
    modelNameWithoutProvider.startsWith('o') ||
    (modelNameWithoutProvider.startsWith('gpt-5') && !modelNameWithoutProvider.startsWith('gpt-5-chat'))
  );
}

function isAnthropicModel(modelName: string): boolean {
  let modelNameWithoutProvider = modelName;
  if (modelName.includes('>')) {
    modelNameWithoutProvider = modelName.split('>')[1];
  }
  return modelNameWithoutProvider.startsWith('claude-');
}

interface ModelSettingsProps {
  isDarkMode?: boolean;
}

export const ModelSettings = ({ isDarkMode = true }: ModelSettingsProps) => {
  const [providers, setProviders] = useState<Record<string, ProviderConfig>>({});
  const [modifiedProviders, setModifiedProviders] = useState<Set<string>>(new Set());
  const [providersFromStorage, setProvidersFromStorage] = useState<Set<string>>(new Set());
  const [selectedModels, setSelectedModels] = useState<Record<AgentNameEnum, string>>({
    [AgentNameEnum.Navigator]: '',
    [AgentNameEnum.Planner]: '',
  });
  const [modelParameters, setModelParameters] = useState<Record<AgentNameEnum, { temperature: number; topP: number }>>({
    [AgentNameEnum.Navigator]: { temperature: 0, topP: 0 },
    [AgentNameEnum.Planner]: { temperature: 0, topP: 0 },
  });

  const [reasoningEffort, setReasoningEffort] = useState<
    Record<AgentNameEnum, 'minimal' | 'low' | 'medium' | 'high' | undefined>
  >({
    [AgentNameEnum.Navigator]: undefined,
    [AgentNameEnum.Planner]: undefined,
  });
  const [newModelInputs, setNewModelInputs] = useState<Record<string, string>>({});
  const [isProviderSelectorOpen, setIsProviderSelectorOpen] = useState(false);
  const newlyAddedProviderRef = useRef<string | null>(null);
  const [nameErrors, setNameErrors] = useState<Record<string, string>>({});
  const [visibleApiKeys, setVisibleApiKeys] = useState<Record<string, boolean>>({});
  const [availableModels, setAvailableModels] = useState<
    Array<{ provider: string; providerName: string; model: string }>
  >([]);

  const [selectedSpeechToTextModel, setSelectedSpeechToTextModel] = useState<string>('');

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const allProviders = await llmProviderStore.getAllProviders();
        const fromStorage = new Set(Object.keys(allProviders));
        setProvidersFromStorage(fromStorage);
        setProviders(allProviders);
      } catch (error) {
        console.error('Error loading providers:', error);
        setProviders({});
        setProvidersFromStorage(new Set());
      }
    };
    loadProviders();
  }, []);

  useEffect(() => {
    const loadAgentModels = async () => {
      try {
        const models: Record<AgentNameEnum, string> = {
          [AgentNameEnum.Planner]: '',
          [AgentNameEnum.Navigator]: '',
        };

        for (const agent of Object.values(AgentNameEnum)) {
          const config = await agentModelStore.getAgentModel(agent);
          if (config) {
            models[agent] = `${config.provider}>${config.modelName}`;
            if (config.parameters?.temperature !== undefined || config.parameters?.topP !== undefined) {
              setModelParameters(prev => ({
                ...prev,
                [agent]: {
                  temperature: config.parameters?.temperature ?? prev[agent].temperature,
                  topP: config.parameters?.topP ?? prev[agent].topP,
                },
              }));
            }
            if (config.reasoningEffort) {
              setReasoningEffort(prev => ({
                ...prev,
                [agent]: config.reasoningEffort as 'minimal' | 'low' | 'medium' | 'high',
              }));
            }
          }
        }
        setSelectedModels(models);
      } catch (error) {
        console.error('Error loading agent models:', error);
      }
    };
    loadAgentModels();
  }, []);

  useEffect(() => {
    const loadSpeechToTextModel = async () => {
      try {
        const config = await speechToTextModelStore.getSpeechToTextModel();
        if (config) {
          setSelectedSpeechToTextModel(`${config.provider}>${config.modelName}`);
        }
      } catch (error) {
        console.error('Error loading speech-to-text model:', error);
      }
    };
    loadSpeechToTextModel();
  }, []);

  useEffect(() => {
    if (newlyAddedProviderRef.current && providers[newlyAddedProviderRef.current]) {
      const providerId = newlyAddedProviderRef.current;
      const config = providers[providerId];
      if (config.type === ProviderTypeEnum.CustomOpenAI) {
        const nameInput = document.getElementById(`${providerId}-name`);
        if (nameInput) nameInput.focus();
      } else {
        const apiKeyInput = document.getElementById(`${providerId}-api-key`);
        if (apiKeyInput) apiKeyInput.focus();
      }
      newlyAddedProviderRef.current = null;
    }
  }, [providers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isProviderSelectorOpen && !target.closest('.provider-selector-container')) {
        setIsProviderSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProviderSelectorOpen]);

  const getAvailableModelsCallback = useCallback(async () => {
    const models: Array<{ provider: string; providerName: string; model: string }> = [];
    try {
      const storedProviders = await llmProviderStore.getAllProviders();
      for (const [provider, config] of Object.entries(storedProviders)) {
        if (config.type === ProviderTypeEnum.AzureOpenAI) {
          const deploymentNames = config.azureDeploymentNames || [];
          models.push(...deploymentNames.map(deployment => ({
            provider,
            providerName: config.name || provider,
            model: deployment,
          })));
        } else {
          const providerModels = config.modelNames || llmProviderModelNames[provider as keyof typeof llmProviderModelNames] || [];
          models.push(...providerModels.map(model => ({
            provider,
            providerName: config.name || provider,
            model,
          })));
        }
      }
    } catch (error) {
      console.error('Error loading providers for model selection:', error);
    }
    return models;
  }, []);

  useEffect(() => {
    const updateAvailableModels = async () => {
      const models = await getAvailableModelsCallback();
      setAvailableModels(models);
    };
    updateAvailableModels();
  }, [getAvailableModelsCallback, providers]);

  const handleApiKeyChange = (provider: string, apiKey: string, baseUrl?: string) => {
    setModifiedProviders(prev => new Set(prev).add(provider));
    setProviders(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        apiKey: apiKey.trim(),
        baseUrl: baseUrl !== undefined ? baseUrl.trim() : prev[provider]?.baseUrl,
      },
    }));
  };

  const toggleApiKeyVisibility = (provider: string) => {
    setVisibleApiKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleNameChange = (provider: string, name: string) => {
    setModifiedProviders(prev => new Set(prev).add(provider));
    setProviders(prev => ({
      ...prev,
      [provider]: { ...prev[provider], name: name.trim() },
    }));
  };

  const handleModelsChange = (provider: string, modelsString: string) => {
    setNewModelInputs(prev => ({ ...prev, [provider]: modelsString }));
  };

  const addModel = (provider: string, model: string) => {
    if (!model.trim()) return;
    setModifiedProviders(prev => new Set(prev).add(provider));
    setProviders(prev => {
      const providerData = prev[provider] || {};
      let currentModels = providerData.modelNames || [...(llmProviderModelNames[provider as keyof typeof llmProviderModelNames] || [])];
      if (currentModels.includes(model.trim())) return prev;
      return {
        ...prev,
        [provider]: { ...providerData, modelNames: [...currentModels, model.trim()] },
      };
    });
    setNewModelInputs(prev => ({ ...prev, [provider]: '' }));
  };

  const removeModel = (provider: string, modelToRemove: string) => {
    setModifiedProviders(prev => new Set(prev).add(provider));
    setProviders(prev => {
      const providerData = prev[provider] || {};
      const currentModels = providerData.modelNames || [...(llmProviderModelNames[provider as keyof typeof llmProviderModelNames] || [])];
      return {
        ...prev,
        [provider]: { ...providerData, modelNames: currentModels.filter(m => m !== modelToRemove) },
      };
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, provider: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addModel(provider, newModelInputs[provider] || '');
    }
  };

  const getButtonProps = (provider: string) => {
    const isInStorage = providersFromStorage.has(provider);
    const isModified = modifiedProviders.has(provider);
    if (isInStorage && !isModified) {
      return { variant: 'danger' as const, children: t('options_models_providers_btnDelete'), disabled: false };
    }
    const config = providers[provider];
    let hasInput = false;
    if (config?.type === ProviderTypeEnum.CustomOpenAI || config?.type === ProviderTypeEnum.Ollama) {
      hasInput = Boolean(config?.baseUrl?.trim());
    } else if (config?.type === ProviderTypeEnum.AzureOpenAI) {
      hasInput = Boolean(config?.apiKey?.trim()) && Boolean(config?.baseUrl?.trim()) && Boolean(config?.azureDeploymentNames?.length) && Boolean(config?.azureApiVersion?.trim());
    } else {
      hasInput = Boolean(config?.apiKey?.trim());
    }
    return { variant: 'primary' as const, children: t('options_models_providers_btnSave'), disabled: !hasInput || !isModified };
  };

  const handleSave = async (provider: string) => {
    try {
      if (providers[provider].type === ProviderTypeEnum.CustomOpenAI && providers[provider].name?.includes(' ')) {
        setNameErrors(prev => ({ ...prev, [provider]: t('options_models_providers_errors_spacesNotAllowed') }));
        return;
      }
      if ([ProviderTypeEnum.CustomOpenAI, ProviderTypeEnum.Ollama, ProviderTypeEnum.AzureOpenAI, ProviderTypeEnum.OpenRouter, ProviderTypeEnum.Llama].includes(providers[provider].type as ProviderTypeEnum) && !providers[provider].baseUrl?.trim()) {
        alert(t('options_models_providers_errors_baseUrlRequired', getDefaultDisplayNameFromProviderId(provider)));
        return;
      }
      const configToSave = { ...providers[provider], apiKey: providers[provider].apiKey || '', name: providers[provider].name || getDefaultDisplayNameFromProviderId(provider), createdAt: providers[provider].createdAt || Date.now() };
      if (providers[provider].type === ProviderTypeEnum.AzureOpenAI) {
        configToSave.modelNames = undefined;
      } else {
        configToSave.modelNames = providers[provider].modelNames || llmProviderModelNames[provider as keyof typeof llmProviderModelNames] || [];
      }
      await llmProviderStore.setProvider(provider, configToSave as ProviderConfig);
      setNameErrors(prev => { const n = { ...prev }; delete n[provider]; return n; });
      setProvidersFromStorage(prev => new Set(prev).add(provider));
      setModifiedProviders(prev => { const n = new Set(prev); n.delete(provider); return n; });
    } catch (error) {
      console.error('Error saving provider:', error);
    }
  };

  const handleDelete = async (provider: string) => {
    try {
      await llmProviderStore.removeProvider(provider);
      setProvidersFromStorage(prev => { const n = new Set(prev); n.delete(provider); return n; });
      setProviders(prev => { const n = { ...prev }; delete n[provider]; return n; });
      setModifiedProviders(prev => { const n = new Set(prev); n.delete(provider); return n; });
    } catch (error) {
      console.error('Error deleting provider:', error);
    }
  };

  const handleCancelProvider = (providerId: string) => {
    setProviders(prev => { const n = { ...prev }; delete n[providerId]; return n; });
    setModifiedProviders(prev => { const n = new Set(prev); n.delete(providerId); return n; });
  };

  const handleModelChange = async (agentName: AgentNameEnum, modelValue: string) => {
    const [provider, model] = modelValue.split('>');
    const newParameters = getDefaultAgentModelParams(provider, agentName);
    setModelParameters(prev => ({ ...prev, [agentName]: newParameters }));
    setSelectedModels(prev => ({ ...prev, [agentName]: modelValue }));
    try {
      if (model) {
        if (isOpenAIReasoningModel(modelValue)) {
          const defaultReasoningEffort = agentName === AgentNameEnum.Planner ? 'low' : 'minimal';
          setReasoningEffort(prev => ({ ...prev, [agentName]: prev[agentName] || defaultReasoningEffort }));
        } else {
          setReasoningEffort(prev => ({ ...prev, [agentName]: undefined }));
        }
        const paramsToSave = isAnthropicModel(modelValue) ? { temperature: newParameters.temperature } : newParameters;
        await agentModelStore.setAgentModel(agentName, {
          provider,
          modelName: model,
          parameters: paramsToSave,
          reasoningEffort: isOpenAIReasoningModel(modelValue) ? reasoningEffort[agentName] || (agentName === AgentNameEnum.Planner ? 'low' : 'minimal') : undefined,
        });
      } else {
        await agentModelStore.resetAgentModel(agentName);
      }
    } catch (error) {
      console.error('Error saving agent model:', error);
    }
  };

  const handleReasoningEffortChange = async (agentName: AgentNameEnum, value: 'minimal' | 'low' | 'medium' | 'high') => {
    setReasoningEffort(prev => ({ ...prev, [agentName]: value }));
    if (selectedModels[agentName] && isOpenAIReasoningModel(selectedModels[agentName])) {
      try {
        const [provider, modelName] = selectedModels[agentName].split('>');
        if (provider && modelName) {
          await agentModelStore.setAgentModel(agentName, { provider, modelName, parameters: modelParameters[agentName], reasoningEffort: value });
        }
      } catch (error) {
        console.error('Error saving reasoning effort:', error);
      }
    }
  };

  const handleParameterChange = async (agentName: AgentNameEnum, paramName: 'temperature' | 'topP', value: number) => {
    const newParameters = { ...modelParameters[agentName], [paramName]: value };
    setModelParameters(prev => ({ ...prev, [agentName]: newParameters }));
    if (selectedModels[agentName]) {
      try {
        const [provider, modelName] = selectedModels[agentName].split('>');
        if (provider && modelName) {
          const paramsToSave = isAnthropicModel(selectedModels[agentName]) ? { temperature: newParameters.temperature } : newParameters;
          await agentModelStore.setAgentModel(agentName, { provider, modelName, parameters: paramsToSave });
        }
      } catch (error) {
        console.error('Error saving agent parameters:', error);
      }
    }
  };

  const handleSpeechToTextModelChange = async (modelValue: string) => {
    setSelectedSpeechToTextModel(modelValue);
    try {
      if (modelValue) {
        const [provider, modelName] = modelValue.split('>');
        await speechToTextModelStore.setSpeechToTextModel({ provider, modelName });
      } else {
        await speechToTextModelStore.resetSpeechToTextModel();
      }
    } catch (error) {
      console.error('Error saving STT model:', error);
    }
  };

  const renderModelSelect = (agentName: AgentNameEnum) => (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:border-purple-500/30">
      <h3 className="mb-1 text-lg font-medium text-white">{agentName.charAt(0).toUpperCase() + agentName.slice(1)}</h3>
      <p className="mb-6 text-sm font-normal text-slate-400">{getAgentDescription(agentName)}</p>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <label htmlFor={`${agentName}-model`} className="text-xs font-semibold uppercase tracking-wider text-purple-400">{t('options_models_labels_model')}</label>
          <select id={`${agentName}-model`} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all" disabled={availableModels.length === 0} value={selectedModels[agentName] || ''} onChange={e => handleModelChange(agentName, e.target.value)}>
            <option value="">{t('options_models_chooseModel')}</option>
            {availableModels.map(({ provider, providerName, model }) => (
              <option key={`${provider}>${model}`} value={`${provider}>${model}`}>{`${providerName} > ${model}`}</option>
            ))}
          </select>
        </div>
        {selectedModels[agentName] && !isOpenAIReasoningModel(selectedModels[agentName]) && (
          <div className="flex items-center">
            <label htmlFor={`${agentName}-temperature`} className="w-24 text-sm font-medium text-slate-400">{t('options_models_labels_temperature')}</label>
            <div className="flex flex-1 min-w-0 flex-wrap items-center gap-2">
              <input id={`${agentName}-temperature`} type="range" min="0" max="2" step="0.01" value={modelParameters[agentName].temperature} onChange={e => handleParameterChange(agentName, 'temperature', Number.parseFloat(e.target.value))} className="flex-1 accent-purple-500 h-1 appearance-none rounded-full bg-slate-800" />
              <div className="flex items-center space-x-2">
                <span className="w-10 text-sm text-slate-400">{modelParameters[agentName].temperature.toFixed(2)}</span>
                <input type="number" min="0" max="2" step="0.01" value={modelParameters[agentName].temperature} onChange={e => { const v = Number.parseFloat(e.target.value); if (!Number.isNaN(v) && v >= 0 && v <= 2) handleParameterChange(agentName, 'temperature', v); }} className="w-12 h-8 rounded-lg border border-white/10 bg-slate-900 px-2 py-0 text-sm text-right tabular-nums text-white focus:border-purple-500 focus:outline-none transition-all appearance-none m-0" style={{ MozAppearance: 'textfield' }} />
              </div>
            </div>
          </div>
        )}
        {selectedModels[agentName] && !isOpenAIReasoningModel(selectedModels[agentName]) && !isAnthropicModel(selectedModels[agentName]) && (
          <div className="flex items-center">
            <label htmlFor={`${agentName}-topP`} className="w-24 text-sm font-medium text-slate-400">{t('options_models_labels_topP')}</label>
            <div className="flex flex-1 min-w-0 flex-wrap items-center gap-2">
              <input id={`${agentName}-topP`} type="range" min="0" max="1" step="0.001" value={modelParameters[agentName].topP} onChange={e => handleParameterChange(agentName, 'topP', Number.parseFloat(e.target.value))} className="flex-1 accent-purple-500 h-1 appearance-none rounded-full bg-slate-800" />
              <div className="flex items-center space-x-2">
                <span className="w-10 text-sm text-slate-400">{modelParameters[agentName].topP.toFixed(3)}</span>
                <input type="number" min="0" max="1" step="0.001" value={modelParameters[agentName].topP} onChange={e => { const v = Number.parseFloat(e.target.value); if (!Number.isNaN(v) && v >= 0 && v <= 1) handleParameterChange(agentName, 'topP', v); }} className="w-12 h-8 rounded-lg border border-white/10 bg-slate-900 px-2 py-0 text-sm text-right tabular-nums text-white focus:border-purple-500 focus:outline-none transition-all appearance-none m-0" style={{ MozAppearance: 'textfield' }} />
              </div>
            </div>
          </div>
        )}
        {selectedModels[agentName] && isOpenAIReasoningModel(selectedModels[agentName]) && (
          <div className="flex items-center">
            <label htmlFor={`${agentName}-reasoning-effort`} className="w-24 text-sm font-medium text-slate-400">{t('options_models_labels_reasoning')}</label>
            <div className="flex flex-1 items-center space-x-2">
              <select id={`${agentName}-reasoning-effort`} value={reasoningEffort[agentName] || (agentName === AgentNameEnum.Planner ? 'low' : 'minimal')} onChange={e => handleReasoningEffortChange(agentName, e.target.value as any)} className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none transition-all">
                <option value="minimal/none">Minimal</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const getAgentDescription = (agentName: AgentNameEnum) => {
    if (agentName === AgentNameEnum.Navigator) return t('options_models_agents_navigator');
    if (agentName === AgentNameEnum.Planner) return t('options_models_agents_planner');
    return '';
  };

  const getSortedProviders = () => {
    return Object.entries(providers).filter(([id, config]) => config?.type && (providersFromStorage.has(id) || modifiedProviders.has(id)))
      .sort(([keyA, configA], [keyB, configB]) => {
        const isNewA = !providersFromStorage.has(keyA);
        const isNewB = !providersFromStorage.has(keyB);
        if (isNewA !== isNewB) return isNewA ? 1 : -1;
        return (configA.createdAt || 0) - (configB.createdAt || 0) || (configA.name || '').localeCompare(configB.name || '');
      });
  };

  const handleProviderSelection = (type: string) => {
    setIsProviderSelectorOpen(false);
    if (type === ProviderTypeEnum.CustomOpenAI) {
      const next = Math.max(0, ...Object.keys(providers).map(id => parseInt(id.split('_').pop() || '0'))) + 1;
      const id = `custom_openai_${next}`;
      setProviders(prev => ({ ...prev, [id]: { apiKey: '', name: `CustomProvider${next}`, type: ProviderTypeEnum.CustomOpenAI, baseUrl: '', modelNames: [], createdAt: Date.now() } }));
      setModifiedProviders(prev => new Set(prev).add(id));
      newlyAddedProviderRef.current = id;
    } else if (type === ProviderTypeEnum.AzureOpenAI) {
      const count = Object.keys(providers).filter(k => k.startsWith(ProviderTypeEnum.AzureOpenAI)).length + 1;
      const id = count === 1 ? ProviderTypeEnum.AzureOpenAI : `${ProviderTypeEnum.AzureOpenAI}_${count}`;
      const config = { ...getDefaultProviderConfig(ProviderTypeEnum.AzureOpenAI), name: `Azure OpenAI ${count}` };
      setProviders(prev => ({ ...prev, [id]: config }));
      setModifiedProviders(prev => new Set(prev).add(id));
      newlyAddedProviderRef.current = id;
    } else {
      const config = getDefaultProviderConfig(type);
      setProviders(prev => ({ ...prev, [type]: config }));
      setModifiedProviders(prev => new Set(prev).add(type));
      newlyAddedProviderRef.current = type;
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-white/5 bg-white/2 p-8 text-left shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <FiCpu className="text-purple-400 w-5 h-5" />
          </div>
          <h2 className="text-2xl font-medium text-white tracking-tight">{t('options_models_providers_header')}</h2>
        </div>
        <div className="space-y-8">
          {getSortedProviders().length === 0 ? (
            <div className="py-12 text-center glass rounded-2xl">
              <p className="mb-4 text-slate-400">{t('options_models_providers_notConfigured')}</p>
            </div>
          ) : (
            getSortedProviders().map(([providerId, providerConfig]) => (
              <div key={providerId} id={`provider-${providerId}`} className={`space-y-6 p-6 rounded-2xl transition-all duration-300 ${modifiedProviders.has(providerId) && !providersFromStorage.has(providerId) ? 'bg-purple-500/5 border border-purple-500/20' : 'border border-white/5 hover:bg-white/5'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">{providerConfig.name || providerId}</h3>
                  <div className="flex space-x-3">
                    {modifiedProviders.has(providerId) && !providersFromStorage.has(providerId) && (
                      <button type="button" onClick={() => handleCancelProvider(providerId)} className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 transition-all">{t('options_models_providers_btnCancel')}</button>
                    )}
                    <button type="button" disabled={getButtonProps(providerId).disabled} onClick={() => providersFromStorage.has(providerId) && !modifiedProviders.has(providerId) ? handleDelete(providerId) : handleSave(providerId)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${getButtonProps(providerId).variant === 'danger' ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 disabled:opacity-30'}`}>{getButtonProps(providerId).children}</button>
                  </div>
                </div>
                <div className="space-y-3">
                  {providerConfig.type === ProviderTypeEnum.CustomOpenAI && (
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <label htmlFor={`${providerId}-name`} className="w-20 text-sm font-medium text-slate-400">{t('options_models_providers_custom_name')}</label>
                        <input id={`${providerId}-name`} type="text" value={providerConfig.name || ''} onChange={e => handleNameChange(providerId, e.target.value)} className={`flex-1 rounded-xl border p-3 text-sm ${nameErrors[providerId] ? 'border-red-500/50 bg-red-500/5 text-white focus:border-red-500' : 'border-white/10 bg-slate-900 text-white focus:border-purple-500'} outline-none transition-all`} />
                      </div>
                      <p className="ml-20 mt-1 text-xs text-slate-500">{nameErrors[providerId] || t('options_models_providers_custom_name_desc')}</p>
                    </div>
                  )}
                  <div className="flex items-center">
                    <label htmlFor={`${providerId}-api-key`} className="w-20 text-sm font-medium text-slate-400">{t('options_models_providers_apiKey')}{providerConfig.type !== ProviderTypeEnum.CustomOpenAI && providerConfig.type !== ProviderTypeEnum.Ollama ? '*' : ''}</label>
                    <div className="relative flex-1">
                      <input id={`${providerId}-api-key`} type="password" placeholder={providerConfig.type === ProviderTypeEnum.CustomOpenAI ? t('options_models_providers_apiKey_placeholder_optional') : providerConfig.type === ProviderTypeEnum.Ollama ? t('options_models_providers_apiKey_placeholder_ollama') : t('options_models_providers_apiKey_placeholder_required')} value={providerConfig.apiKey || ''} onChange={e => handleApiKeyChange(providerId, e.target.value, providerConfig.baseUrl)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none transition-all" />
                      {modifiedProviders.has(providerId) && !providersFromStorage.has(providerId) && (
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" onClick={() => toggleApiKeyVisibility(providerId)}><FiHelpCircle className="w-5 h-5" /></button>
                      )}
                    </div>
                  </div>
                  {visibleApiKeys[providerId] && providerConfig.apiKey && <div className="ml-20 mt-1"><p className="break-words font-mono text-xs text-emerald-400">{providerConfig.apiKey}</p></div>}
                  {[ProviderTypeEnum.CustomOpenAI, ProviderTypeEnum.Ollama, ProviderTypeEnum.AzureOpenAI, ProviderTypeEnum.OpenRouter, ProviderTypeEnum.Llama].includes(providerConfig.type as ProviderTypeEnum) && (
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <label htmlFor={`${providerId}-base-url`} className="w-20 text-sm font-medium text-slate-400">{providerConfig.type === ProviderTypeEnum.AzureOpenAI ? t('options_models_providers_endpoint') : t('options_models_providers_baseUrl')}</label>
                        <input id={`${providerId}-base-url`} type="text" value={providerConfig.baseUrl || ''} onChange={e => handleApiKeyChange(providerId, providerConfig.apiKey || '', e.target.value)} className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none transition-all" />
                      </div>
                    </div>
                  )}
                  {providerConfig.type === ProviderTypeEnum.AzureOpenAI && (
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <label htmlFor={`${providerId}-azure-deployment`} className="w-20 pt-2 text-sm font-medium text-slate-400">{t('options_models_providers_deployment')}*</label>
                        <div className="flex-1 space-y-2">
                          <div className="flex min-h-[46px] flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-slate-900 p-2">
                            {(providerConfig.azureDeploymentNames || []).map(name => (
                              <div key={name} className="flex items-center rounded-full bg-purple-500/20 text-purple-200 px-3 py-1 text-xs border border-purple-500/30">
                                <span>{name}</span>
                                <button type="button" onClick={() => removeAzureDeployment(providerId, name)} className="ml-2 font-bold text-purple-400 hover:text-purple-200">×</button>
                              </div>
                            ))}
                            <input id={`${providerId}-azure-deployment-input`} type="text" placeholder={t('options_models_providers_placeholders_azureDeployment')} value={newModelInputs[providerId] || ''} onChange={e => handleModelsChange(providerId, e.target.value)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (newModelInputs[providerId]?.trim()) addAzureDeployment(providerId, newModelInputs[providerId].trim()); } }} className="min-w-[150px] flex-1 border-none text-sm bg-transparent text-white p-1 outline-none" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <label htmlFor={`${providerId}-azure-version`} className="w-20 text-sm font-medium text-slate-400">{t('options_models_providers_apiVersion')}*</label>
                        <input id={`${providerId}-azure-version`} type="text" value={providerConfig.azureApiVersion || ''} onChange={e => handleAzureApiVersionChange(providerId, e.target.value)} className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none transition-all" />
                      </div>
                    </div>
                  )}
                  {providerConfig.type !== ProviderTypeEnum.AzureOpenAI && (
                    <div className="flex items-start">
                      <label htmlFor={`${providerId}-models-label`} className="w-20 pt-2 text-sm font-medium text-slate-400">{t('options_models_providers_models')}</label>
                      <div className="flex-1 space-y-2">
                        <div className="flex min-h-[46px] flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-slate-900 p-2">
                          {(providerConfig.modelNames || llmProviderModelNames[providerId as keyof typeof llmProviderModelNames] || []).map(model => (
                            <div key={model} className="flex items-center rounded-full bg-purple-500/20 text-purple-200 px-3 py-1 text-xs border border-purple-500/30">
                              <span>{model}</span>
                              <button type="button" onClick={() => removeModel(providerId, model)} className="ml-2 font-bold text-purple-400 hover:text-purple-200">×</button>
                            </div>
                          ))}
                          <input id={`${providerId}-models-input`} type="text" value={newModelInputs[providerId] || ''} onChange={e => handleModelsChange(providerId, e.target.value)} onKeyDown={e => handleKeyDown(e, providerId)} className="min-w-[150px] flex-1 border-none text-sm bg-transparent text-white p-1 outline-none" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div className="provider-selector-container relative pt-6">
            <button type="button" onClick={() => setIsProviderSelectorOpen(prev => !prev)} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-all active:scale-[0.98]">
              <FiSettings className="w-4 h-4" />
              <span>{t('options_models_addNewProvider')}</span>
            </button>
            {isProviderSelectorOpen && (
              <div className="absolute z-20 mt-3 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl backdrop-blur-xl">
                <div className="py-2">
                  {Object.values(ProviderTypeEnum).filter(type => type === ProviderTypeEnum.AzureOpenAI || (type !== ProviderTypeEnum.CustomOpenAI && !providersFromStorage.has(type) && !modifiedProviders.has(type))).map(type => (
                    <button key={type} type="button" className="flex w-full items-center px-6 py-4 text-left text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all" onClick={() => handleProviderSelection(type)}><span>{getDefaultDisplayNameFromProviderId(type)}</span></button>
                  ))}
                  <button type="button" className="flex w-full items-center px-6 py-4 text-left text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 border-t border-white/5 transition-all" onClick={() => handleProviderSelection(ProviderTypeEnum.CustomOpenAI)}><span>{t('options_models_providers_openaiCompatible')}</span></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/5 bg-white/2 p-8 text-left shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <FiSettings className="text-purple-400 w-5 h-5" />
          </div>
          <h2 className="text-2xl font-medium text-white tracking-tight">{t('options_models_selection_header')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[AgentNameEnum.Planner, AgentNameEnum.Navigator].map(agentName => (<div key={agentName}>{renderModelSelect(agentName)}</div>))}
        </div>
      </div>
      <div className="rounded-3xl border border-white/5 bg-white/2 p-8 text-left shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <FiHelpCircle className="text-purple-400 w-5 h-5" />
          </div>
          <h2 className="text-2xl font-medium text-white tracking-tight">{t('options_models_speechToText_header')}</h2>
        </div>
        <p className="mb-8 text-sm text-slate-400 leading-relaxed max-w-2xl">{t('options_models_stt_desc')}</p>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="speech-to-text-model" className="text-xs font-semibold uppercase tracking-wider text-purple-400">{t('options_models_labels_model')}</label>
            <select id="speech-to-text-model" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all" value={selectedSpeechToTextModel} onChange={e => handleSpeechToTextModelChange(e.target.value)}>
              <option value="">{t('options_models_chooseModel')}</option>
              {availableModels.filter(({ provider }) => providers[provider]?.type === ProviderTypeEnum.Gemini).map(({ provider, providerName, model }) => (
                <option key={`${provider}>${model}`} value={`${provider}>${model}`}>{`${providerName} > ${model}`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};
