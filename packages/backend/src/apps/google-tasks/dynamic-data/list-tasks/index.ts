import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List tasks',
  key: 'listTasks',

  async run($: IGlobalVariable) {
    const tasks: {
      data: IJSONObject[];
    } = {
      data: [],
    };
    const taskListId = $.step.parameters.taskListId as string;

    const params = {
      maxResults: 100,
      pageToken: undefined as unknown as string,
    };

    if (!taskListId) {
      return tasks;
    }

    do {
      const { data } = await $.http.get(`/tasks/v1/lists/${taskListId}/tasks`, {
        params,
      });
      params.pageToken = data.nextPageToken;

      if (data.items) {
        for (const task of data.items) {
          if (task.title !== '') {
            tasks.data.push({
              value: task.id,
              name: task.title,
            });
          }
        }
      }
    } while (params.pageToken);

    return tasks;
  },
};
