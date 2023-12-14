import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import actions from './actions';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Google Tasks',
  key: 'google-tasks',
  baseUrl: 'https://calendar.google.com/calendar/u/0/r/tasks',
  apiBaseUrl: 'https://tasks.googleapis.com',
  iconUrl: '{BASE_URL}/apps/google-tasks/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/google-tasks/connection',
  primaryColor: '0066DA',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData,
});
