import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import setBaseUrl from './common/set-base-url';
import auth from './auth';
import actions from './actions';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Vtiger CRM',
  key: 'vtiger-crm',
  iconUrl: '{BASE_URL}/apps/vtiger-crm/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/vtiger-crm/connection',
  supportsConnections: true,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '39a86d',
  beforeRequest: [setBaseUrl, addAuthHeader],
  auth,
  actions,
  dynamicData,
});
