import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List organizations',
  key: 'listOrganizations',

  async run($: IGlobalVariable) {
    const organizations: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const params = {
      operation: 'query',
      sessionName: $.auth.data.sessionName,
      query: 'SELECT * FROM Accounts ORDER BY createdtime DESC;',
    };

    const { data } = await $.http.get(`/webservice.php`, { params });

    if (data.result?.length) {
      for (const organization of data.result) {
        organizations.data.push({
          value: organization.id,
          name: organization.accountname,
        });
      }
    }

    return organizations;
  },
};
