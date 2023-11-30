import { IGlobalVariable, IJSONObject } from '@automatisch/types';

type Payload = {
  start_cursor?: string;
};

export default {
  name: 'List database items',
  key: 'listDatabaseItems',

  async run($: IGlobalVariable) {
    const databases: {
      data: IJSONObject[];
      error: IJSONObject | null;
    } = {
      data: [],
      error: null,
    };
    const payload: Payload = {
      start_cursor: undefined as unknown as string,
    };
    const databaseId = $.step.parameters.databaseId as string;

    if (!databaseId) {
      return databases;
    }

    do {
      const response = await $.http.post(
        `/v1/databases/${databaseId}/query`,
        payload
      );

      payload.start_cursor = response.data.next_cursor;

      for (const database of response.data.results) {
        databases.data.push({
          value: database.id as string,
          name:
            database.properties.Name?.title?.[0]?.plain_text || 'Untitled Page',
        });
      }
    } while (payload.start_cursor);

    return databases;
  },
};
