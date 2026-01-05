import { useState, useEffect } from 'react';
import '@src/Options.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { t } from '@extension/i18n';
import { FiSettings, FiCpu, FiShield, FiTrendingUp, FiHelpCircle } from 'react-icons/fi';
import { GeneralSettings } from './components/GeneralSettings';
import { ModelSettings } from './components/ModelSettings';
import { FirewallSettings } from './components/FirewallSettings';
import { AnalyticsSettings } from './components/AnalyticsSettings';

type TabTypes = 'general' | 'models' | 'firewall' | 'analytics' | 'help';

const TABS: { id: TabTypes; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { id: 'general', icon: FiSettings, label: t('options_tabs_general') },
  { id: 'models', icon: FiCpu, label: t('options_tabs_models') },
  { id: 'firewall', icon: FiShield, label: t('options_tabs_firewall') },
  { id: 'analytics', icon: FiTrendingUp, label: 'Analytics' },
  { id: 'help', icon: FiHelpCircle, label: t('options_tabs_help') },
];

const Options = () => {
  const [activeTab, setActiveTab] = useState<TabTypes>('models');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Always force dark mode for the professional look
  useEffect(() => {
    setIsDarkMode(true);
  }, []);

  const handleTabClick = (tabId: TabTypes) => {
    if (tabId === 'help') {
      window.open('https://jasprai.com/docs', '_blank');
    } else {
      setActiveTab(tabId);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings isDarkMode={isDarkMode} />;
      case 'models':
        return <ModelSettings isDarkMode={isDarkMode} />;
      case 'firewall':
        return <FirewallSettings isDarkMode={isDarkMode} />;
      case 'analytics':
        return <AnalyticsSettings isDarkMode={isDarkMode} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="flex min-h-screen min-w-[768px] bg-slate-950 relative overflow-hidden text-slate-200">
      
      {/* Background Blobs and Beams */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="beam-container">
        <div className="beam"></div>
      </div>

      {/* Vertical Navigation Bar */}
      <nav
        className="w-64 border-r border-white/5 bg-slate-950/80 backdrop-blur-xl z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <img src="/icon-128.png" className="w-8 h-8 rounded-lg shadow-lg shadow-purple-500/20" alt="Logo" />
            <h1 className="text-xl font-medium text-white tracking-tight">
              JasprAi
            </h1>
          </div>
          <ul className="space-y-2">
            {TABS.map(item => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-300
                    ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-white border-l-2 border-purple-500'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}>
                  <item.icon className={`h-4 w-4 ${activeTab === item.id ? 'text-purple-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-12 overflow-y-auto z-10">
        <div className="mx-auto max-w-4xl fade-in-up">
          <div className="mb-10">
            <h2 className="text-3xl font-medium text-white tracking-tight mb-2 uppercase text-[10px] tracking-[0.2em] text-purple-400">Settings</h2>
            <h3 className="text-4xl font-medium text-white tracking-tight capitalize">{activeTab} Configuration</h3>
          </div>
          <div className="glass rounded-3xl p-8 shadow-2xl">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Loading...</div>), <div>Error Occurred</div>);
