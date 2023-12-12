import { TBeforeRequest } from '@automatisch/types';
import { URLSearchParams } from 'url';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const params = new URLSearchParams({
    access_token: $.auth.data.accessToken as string,
    api_key: $.auth.data.apiKey as string,
    api_secret: $.auth.data.apiSecret as string,
  });

  requestConfig.params = params;

  return requestConfig;
};

export default addAuthHeader;
