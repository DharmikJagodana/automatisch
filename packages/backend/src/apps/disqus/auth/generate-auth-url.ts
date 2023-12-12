import { IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';
import authScope from '../common/auth-scope';

export default async function generateAuthUrl($: IGlobalVariable) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.apiKey as string,
    scope: authScope.join(','),
    response_type: 'code',
    redirect_uri: redirectUri,
  });

  const url = `https://disqus.com/api/oauth/2.0/authorize/?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
