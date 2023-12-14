import defineAction from '../../../../helpers/define-action';

type Task = {
  title: string;
};

export default defineAction({
  name: 'Find task',
  key: 'findTask',
  description: 'Looking for an incomplete task.',
  arguments: [
    {
      label: 'Task List',
      key: 'taskListId',
      type: 'dropdown' as const,
      required: true,
      description: 'The list to be searched.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listTaskLists',
          },
        ],
      },
    },
    {
      label: 'Title',
      key: 'title',
      type: 'string' as const,
      required: true,
      description: '',
      variables: true,
    },
  ],

  async run($) {
    const taskListId = $.step.parameters.taskListId as string;
    const title = $.step.parameters.title as string;

    const { data } = await $.http.get(`/tasks/v1/lists/${taskListId}/tasks`);

    const filteredTask = data.items?.filter((task: Task) =>
      task.title.includes(title)
    );

    $.setActionItem({
      raw: filteredTask[0],
    });
  },
});
