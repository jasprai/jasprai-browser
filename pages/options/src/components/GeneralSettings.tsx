import { useState, useEffect } from 'react';
import { FiSettings } from 'react-icons/fi';
import { type GeneralSettingsConfig, generalSettingsStore, DEFAULT_GENERAL_SETTINGS } from '@extension/storage';
import { t } from '@extension/i18n';

interface GeneralSettingsProps {
  isDarkMode?: boolean;
}

export const GeneralSettings = ({ isDarkMode = false }: GeneralSettingsProps) => {
  const [settings, setSettings] = useState<GeneralSettingsConfig>(DEFAULT_GENERAL_SETTINGS);

  useEffect(() => {
    // Load initial settings
    generalSettingsStore.getSettings().then(setSettings);
  }, []);

  const updateSetting = async <K extends keyof GeneralSettingsConfig>(key: K, value: GeneralSettingsConfig[K]) => {
    // Optimistically update the local state for responsiveness
    setSettings(prevSettings => ({ ...prevSettings, [key]: value }));

    // Call the store to update the setting
    await generalSettingsStore.updateSettings({ [key]: value } as Partial<GeneralSettingsConfig>);

    // After the store update (which might have side effects, e.g., useVision affecting displayHighlights),
    // fetch the latest settings from the store and update the local state again to ensure UI consistency.
    const latestSettings = await generalSettingsStore.getSettings();
    setSettings(latestSettings);
  };

  return (
    <section className="space-y-8">
      <div
        className="rounded-3xl border border-white/5 bg-white/2 p-8 text-left shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <FiSettings className="text-purple-400 w-5 h-5" />
          </div>
          <h2 className="text-2xl font-medium text-white tracking-tight">
            {t('options_general_header')}
          </h2>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/2 transition-all hover:border-purple-500/30">
            <div>
              <h3 className="text-base font-medium text-white">
                {t('options_general_maxSteps')}
              </h3>
              <p className="text-sm font-normal text-slate-400">
                {t('options_general_maxSteps_desc')}
              </p>
            </div>
            <input
              id="maxSteps"
              type="number"
              min={1}
              max={50}
              value={settings.maxSteps}
              onChange={e => updateSetting('maxSteps', Number.parseInt(e.target.value, 10))}
              className="w-20 rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-sm text-white focus:border-purple-500 focus:outline-none transition-all appearance-none m-0"
              style={{ MozAppearance: 'textfield' }}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/2 transition-all hover:border-purple-500/30">
            <div>
              <h3 className="text-base font-medium text-white">
                {t('options_general_maxActions')}
              </h3>
              <p className="text-sm font-normal text-slate-400">
                {t('options_general_maxActions_desc')}
              </p>
            </div>
            <input
              id="maxActionsPerStep"
              type="number"
              min={1}
              max={50}
              value={settings.maxActionsPerStep}
              onChange={e => updateSetting('maxActionsPerStep', Number.parseInt(e.target.value, 10))}
              className="w-20 rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-sm text-white focus:border-purple-500 focus:outline-none transition-all appearance-none m-0"
              style={{ MozAppearance: 'textfield' }}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/2 transition-all hover:border-purple-500/30">
            <div>
              <h3 className="text-base font-medium text-white">
                {t('options_general_maxFailures')}
              </h3>
              <p className="text-sm font-normal text-slate-400">
                {t('options_general_maxFailures_desc')}
              </p>
            </div>
            <input
              id="maxFailures"
              type="number"
              min={1}
              max={10}
              value={settings.maxFailures}
              onChange={e => updateSetting('maxFailures', Number.parseInt(e.target.value, 10))}
              className="w-20 rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-sm text-white focus:border-purple-500 focus:outline-none transition-all appearance-none m-0"
              style={{ MozAppearance: 'textfield' }}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/2 transition-all hover:border-purple-500/30">
            <div>
              <h3 className="text-base font-medium text-white">
                {t('options_general_enableVision')}
              </h3>
              <p className="text-sm font-normal text-slate-400">
                {t('options_general_enableVision_desc')}
              </p>
            </div>
            <div className="relative inline-flex cursor-pointer items-center">
              <input
                id="useVision"
                type="checkbox"
                checked={settings.useVision}
                onChange={e => updateSetting('useVision', e.target.checked)}
                className="peer sr-only"
              />
              <label
                htmlFor="useVision"
                className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-white/10 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20">
                <span className="sr-only">{t('options_general_enableVision')}</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/2 transition-all hover:border-purple-500/30">
            <div>
              <h3 className="text-base font-medium text-white">
                {t('options_general_displayHighlights')}
              </h3>
              <p className="text-sm font-normal text-slate-400">
                {t('options_general_displayHighlights_desc')}
              </p>
            </div>
            <div className="relative inline-flex cursor-pointer items-center">
              <input
                id="displayHighlights"
                type="checkbox"
                checked={settings.displayHighlights}
                onChange={e => updateSetting('displayHighlights', e.target.checked)}
                className="peer sr-only"
              />
              <label
                htmlFor="displayHighlights"
                className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-white/10 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20">
                <span className="sr-only">{t('options_general_displayHighlights')}</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/2 transition-all hover:border-purple-500/30">
            <div>
              <h3 className="text-base font-medium text-white">
                {t('options_general_planningInterval')}
              </h3>
              <p className="text-sm font-normal text-slate-400">
                {t('options_general_planningInterval_desc')}
              </p>
            </div>
            <input
              id="planningInterval"
              type="number"
              min={1}
              max={20}
              value={settings.planningInterval}
              onChange={e => updateSetting('planningInterval', Number.parseInt(e.target.value, 10))}
              className="w-20 rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-sm text-white focus:border-purple-500 focus:outline-none transition-all appearance-none m-0"
              style={{ MozAppearance: 'textfield' }}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/2 transition-all hover:border-purple-500/30">
            <div>
              <h3 className="text-base font-medium text-white">
                {t('options_general_minWaitPageLoad')}
              </h3>
              <p className="text-sm font-normal text-slate-400">
                {t('options_general_minWaitPageLoad_desc')}
              </p>
            </div>
            <input
              id="minWaitPageLoad"
              type="number"
              min={250}
              max={5000}
              step={50}
              value={settings.minWaitPageLoad}
              onChange={e => updateSetting('minWaitPageLoad', Number.parseInt(e.target.value, 10))}
              className="w-20 rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-sm text-white focus:border-purple-500 focus:outline-none transition-all appearance-none m-0"
              style={{ MozAppearance: 'textfield' }}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/2 transition-all hover:border-purple-500/30">
            <div>
              <h3 className="text-base font-medium text-white">
                {t('options_general_replayHistoricalTasks')}
              </h3>
              <p className="text-sm font-normal text-slate-400">
                {t('options_general_replayHistoricalTasks_desc')}
              </p>
            </div>
            <div className="relative inline-flex cursor-pointer items-center">
              <input
                id="replayHistoricalTasks"
                type="checkbox"
                checked={settings.replayHistoricalTasks}
                onChange={e => updateSetting('replayHistoricalTasks', e.target.checked)}
                className="peer sr-only"
              />
              <label
                htmlFor="replayHistoricalTasks"
                className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-white/10 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20">
                <span className="sr-only">{t('options_general_replayHistoricalTasks')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
