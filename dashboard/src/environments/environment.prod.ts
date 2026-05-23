export const environment = {
  production: true,
  // Placeholders replaced at container start: use names in SUBSTITUTE_VARS
  baseUrl: '__BASE_URL__',
  baseUrlSimulator: '__BASE_URL_SIMULATOR__',
  useHash: false,
  vkAppId: '__VK_APP_ID__' as unknown as number,
  vkRedirectUrl: '__VK_REDIRECT_URL__',
  standalone: false,
  umamiWebsiteId: '__UMAMI_WEBSITE_ID__'
};
