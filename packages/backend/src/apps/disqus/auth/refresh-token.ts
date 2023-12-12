import { URLSearchParams } from 'node:url';
import { IGlobalVariable } from '@automatisch/types';
import authScope from '../common/auth-scope';

const refreshToken = async ($: IGlobalVariable) => {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: $.auth.data.apiKey as string,
    client_secret: $.auth.data.apiSecret as string,
    refresh_token: $.auth.data.refreshToken as string,
  });

  const { data } = await $.http.post(
    `https://disqus.com/api/oauth/2.0/access_token/`,
    params.toString()
  );

  await $.auth.set({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    scope: authScope.join(','),
    tokenType: data.token_type,
  });
};

export default refreshToken;
