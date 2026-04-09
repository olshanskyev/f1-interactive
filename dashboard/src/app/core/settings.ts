export type AppTheme = 'light' | 'dark' | 'auto';

export interface AppSettings {
  navPos: 'side' | 'top';
  dir: 'ltr' | 'rtl';
  theme: AppTheme;
  showHeader: boolean;
  headerPos: 'fixed' | 'static' | 'above';
  showUserPanel: boolean;
  sidenavOpened: boolean;
  sidenavCollapsed: boolean;
  language: string;
  useSimulator: boolean;
  selectedLayoutId?: string;
  showRaceControlMessages: boolean;
  showTeamRadio: boolean;
  delayMs: number;
  useLock: boolean;
  showHeadToHead: boolean;
}

export const defaults: AppSettings = {
  navPos: 'side',
  theme: 'dark',
  dir: 'ltr',
  showHeader: true,
  headerPos: 'fixed',
  showUserPanel: false,
  sidenavOpened: true,
  sidenavCollapsed: false,
  language: 'en-US',
  useSimulator: false,
  showRaceControlMessages: false,
  showTeamRadio: false,
  delayMs: 0,
  useLock: true,
  showHeadToHead: true
};
