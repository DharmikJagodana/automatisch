import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List tags',
  key: 'listTags',

  async run($: IGlobalVariable) {
    const tags: {
      data: IJSONObject[];
      error: IJSONObject | null;
    } = {
      data: [],
      error: null,
    };
    const databaseId = $.step.parameters.databaseId as string;
    let allTags;

    if (!databaseId) {
      return tags;
    }

    const response = await $.http.get(`/v1/databases/${databaseId}`);
    const tagsExist =
      response.data.properties.Tags.multi_select.options.length !== 0;

    if (tagsExist) {
      allTags = response.data.properties.Tags.multi_select.options.map(
        (tag: IJSONObject) => tag.name
      );
    } else {
      return tags;
    }

    for (const tag of allTags) {
      tags.data.push({
        value: tag as string,
        name: tag as string,
      });
    }

    return tags;
  },
};
