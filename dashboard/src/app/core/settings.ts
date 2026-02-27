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
}

export const defaults: AppSettings = {
  navPos: 'side',
  theme: 'dark',
  dir: 'ltr',
  showHeader: true,
  headerPos: 'fixed',
  showUserPanel: true,
  sidenavOpened: true,
  sidenavCollapsed: false,
  language: 'en-US',
  useSimulator: false,
};
