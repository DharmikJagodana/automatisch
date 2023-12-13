import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Disqus',
  key: 'disqus',
  baseUrl: 'https://disqus.com',
  apiBaseUrl: 'https://disqus.com/api',
  iconUrl: '{BASE_URL}/apps/disqus/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/disqus/connection',
  primaryColor: '2E9FFF',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
