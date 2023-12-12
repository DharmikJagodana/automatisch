import { IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: $.auth.data.apiKey as string,
    client_secret: $.auth.data.apiSecret as string,
    redirect_uri: redirectUri as string,
    code: $.auth.data.code as string,
  });

  const { data } = await $.http.post(
    `https://disqus.com/api/oauth/2.0/access_token/`,
    params.toString()
  );

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
    apiKey: $.auth.data.apiKey,
    apiSecret: $.auth.data.apiSecret,
    scope: $.auth.data.scope,
    userId: data.user_id,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
    screenName: data.username,
  });
};

export default verifyCredentials;
