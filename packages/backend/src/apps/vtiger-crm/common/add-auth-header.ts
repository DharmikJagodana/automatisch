import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const { data } = $.auth;

  if (data?.username && data?.accessKey) {
    requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    requestConfig.auth = {
      username: data.username as string,
      password: data.accessKey as string,
    };
  }

  return requestConfig;
};

export default addAuthHeader;
