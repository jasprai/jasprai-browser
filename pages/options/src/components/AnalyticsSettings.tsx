import React, { useState, useEffect } from 'react';
import { analyticsSettingsStore } from '@extension/storage';
import { FiTrendingUp } from 'react-icons/fi';

import type { AnalyticsSettingsConfig } from '@extension/storage';

interface AnalyticsSettingsProps {
  isDarkMode: boolean;
}

export const AnalyticsSettings: React.FC<AnalyticsSettingsProps> = ({ isDarkMode = true }) => {
  const [settings, setSettings] = useState<AnalyticsSettingsConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const currentSettings = await analyticsSettingsStore.getSettings();
        setSettings(currentSettings);
      } catch (error) {
        console.error('Failed to load analytics settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();

    // Listen for storage changes
    const unsubscribe = analyticsSettingsStore.subscribe(loadSettings);
    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggleAnalytics = async (enabled: boolean) => {
    if (!settings) return;

    try {
      await analyticsSettingsStore.updateSettings({ enabled });
      setSettings({ ...settings, enabled });
    } catch (error) {
      console.error('Failed to update analytics settings:', error);
    }
  };

  if (loading) {
    return (
      <section className="space-y-8">
        <div
          className="rounded-3xl border border-white/5 bg-white/2 p-8 text-left shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <FiTrendingUp className="text-purple-400 w-5 h-5" />
            </div>
            <h2 className="text-2xl font-medium text-white tracking-tight">
              Analytics
            </h2>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-white/5 rounded-2xl w-full"></div>
            <div className="h-32 bg-white/5 rounded-2xl w-full"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!settings) {
    return (
      <section className="space-y-8">
        <div
          className="rounded-3xl border border-white/5 bg-white/2 p-8 text-left shadow-2xl">
          <h2 className="text-2xl font-medium text-white tracking-tight mb-4">
            Analytics Settings
          </h2>
          <p className="text-red-400">Failed to load analytics settings.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div
        className="rounded-3xl border border-white/5 bg-white/2 p-8 text-left shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <FiTrendingUp className="text-purple-400 w-5 h-5" />
          </div>
          <h2 className="text-2xl font-medium text-white tracking-tight">
            Analytics
          </h2>
        </div>

        <div className="space-y-8">
          {/* Main toggle */}
          <div
            className="p-6 rounded-2xl border border-white/5 bg-white/2 transition-all hover:border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="analytics-enabled"
                  className="text-base font-medium text-white">
                  Help improve JasprAi
                </label>
                <p className="mt-1 text-sm text-slate-400">
                  Share anonymous usage data to help us improve the extension
                </p>
              </div>
              <div className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={e => handleToggleAnalytics(e.target.checked)}
                  className="peer sr-only"
                  id="analytics-enabled"
                />
                <label
                  htmlFor="analytics-enabled"
                  className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-white/10 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20">
                  <span className="sr-only">Toggle analytics</span>
                </label>
              </div>
            </div>
          </div>

          {/* Information about what we collect */}
          <div
            className="p-6 rounded-2xl border border-white/5 bg-white/5">
            <h3 className="text-base font-medium text-purple-400 mb-4 uppercase text-[10px] tracking-widest">
              What we collect
            </h3>
            <ul
              className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                Task execution metrics (completion, failure counts)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                Domain names of websites visited (e.g. &quot;google.com&quot;)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                Error categories for failed tasks
              </li>
            </ul>

            <h3 className="mb-4 mt-8 text-base font-medium text-red-400 uppercase text-[10px] tracking-widest">
              What we DON&apos;T collect
            </h3>
            <ul
              className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
                Personal information or login credentials
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
                Full URLs or page content
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
                Task instructions or screenshots
              </li>
            </ul>
          </div>

          {/* Opt-out message */}
          {!settings.enabled && (
            <div
              className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
              <p className="text-sm text-purple-300">
                Analytics disabled. You can re-enable it anytime to help improve JasprAi.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
