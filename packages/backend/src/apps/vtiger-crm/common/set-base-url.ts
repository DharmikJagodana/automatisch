import { TBeforeRequest } from '@automatisch/types';

const setBaseUrl: TBeforeRequest = ($, requestConfig) => {
  const domain = $.auth.data.domain as string;
  if (domain) {
    requestConfig.baseURL = `https://${domain}.vtiger.com`;
  }

  return requestConfig;
};

export default setBaseUrl;
