import { useState, useEffect, useCallback } from 'react';
import { firewallStore } from '@extension/storage';
import { t } from '@extension/i18n';
import { FiShield, FiPlus, FiTrash2 } from 'react-icons/fi';

interface FirewallSettingsProps {
  isDarkMode: boolean;
}

export const FirewallSettings = ({ isDarkMode = true }: FirewallSettingsProps) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [allowList, setAllowList] = useState<string[]>([]);
  const [denyList, setDenyList] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [activeList, setActiveList] = useState<'allow' | 'deny'>('allow');

  const loadFirewallSettings = useCallback(async () => {
    const settings = await firewallStore.getFirewall();
    setIsEnabled(settings.enabled);
    setAllowList(settings.allowList);
    setDenyList(settings.denyList);
  }, []);

  useEffect(() => {
    loadFirewallSettings();
  }, [loadFirewallSettings]);

  const handleToggleFirewall = async () => {
    await firewallStore.updateFirewall({ enabled: !isEnabled });
    await loadFirewallSettings();
  };

  const handleAddUrl = async () => {
    // Remove http:// or https:// prefixes
    const cleanUrl = newUrl.trim().replace(/^https?:\/\//, '');
    if (!cleanUrl) return;

    if (activeList === 'allow') {
      await firewallStore.addToAllowList(cleanUrl);
    } else {
      await firewallStore.addToDenyList(cleanUrl);
    }
    await loadFirewallSettings();
    setNewUrl('');
  };

  const handleRemoveUrl = async (url: string, listType: 'allow' | 'deny') => {
    if (listType === 'allow') {
      await firewallStore.removeFromAllowList(url);
    } else {
      await firewallStore.removeFromDenyList(url);
    }
    await loadFirewallSettings();
  };

  return (
    <section className="space-y-8">
      <div
        className="rounded-3xl border border-white/5 bg-white/2 p-8 text-left shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <FiShield className="text-purple-400 w-5 h-5" />
          </div>
          <h2 className="text-2xl font-medium text-white tracking-tight">
            {t('options_firewall_header')}
          </h2>
        </div>

        <div className="space-y-8">
          <div
            className="p-6 rounded-2xl border border-white/5 bg-white/2 transition-all hover:border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="toggle-firewall"
                  className="text-base font-medium text-white">
                  {t('options_firewall_enableToggle')}
                </label>
                <p className="mt-1 text-sm text-slate-400">
                  Control which domains the AI agent is allowed to access
                </p>
              </div>
              <div className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={handleToggleFirewall}
                  className="peer sr-only"
                  id="toggle-firewall"
                />
                <label
                  htmlFor="toggle-firewall"
                  className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-white/10 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20">
                  <span className="sr-only">{t('options_firewall_toggleFirewall_a11y')}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex p-1 rounded-2xl bg-slate-900 border border-white/5 w-fit">
              <button
                type="button"
                onClick={() => setActiveList('allow')}
                className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeList === 'allow'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}>
                {t('options_firewall_allowList_header')}
              </button>
              <button
                type="button"
                onClick={() => setActiveList('deny')}
                className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeList === 'deny'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}>
                {t('options_firewall_denyList_header')}
              </button>
            </div>

            <div className="flex gap-3">
              <input
                id="url-input"
                type="text"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleAddUrl();
                  }
                }}
                placeholder={t('options_firewall_placeholders_domainUrl')}
                className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-6 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2">
                <FiPlus className="w-4 h-4" />
                <span>{t('options_firewall_btnAdd')}</span>
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {activeList === 'allow' ? (
                allowList.length > 0 ? (
                  allowList.map(url => (
                    <div
                      key={url}
                      className="flex items-center justify-between rounded-xl p-4 border border-white/5 bg-white/2 hover:border-white/10 transition-all">
                      <span className="text-sm text-slate-300">{url}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveUrl(url, 'allow')}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-slate-500 glass rounded-2xl">
                    {t('options_firewall_allowList_empty')}
                  </p>
                )
              ) : denyList.length > 0 ? (
                denyList.map(url => (
                  <div
                    key={url}
                    className="flex items-center justify-between rounded-xl p-4 border border-white/5 bg-white/2 hover:border-white/10 transition-all">
                    <span className="text-sm text-slate-300">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(url, 'deny')}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-slate-500 glass rounded-2xl">
                  {t('options_firewall_denyList_empty')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-3xl border border-white/5 bg-white/2 p-8 text-left shadow-2xl">
        <h2 className="mb-6 text-base font-medium text-purple-400 uppercase text-[10px] tracking-widest">
          {t('options_firewall_howItWorks_header')}
        </h2>
        <ul className="space-y-4">
          {t('options_firewall_howItWorks')
            .split('\n')
            .map((rule, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50 mt-1.5 shrink-0"></div>
                {rule}
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};
