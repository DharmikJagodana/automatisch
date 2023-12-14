import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Create task list',
  key: 'createTaskList',
  description: 'Creates a new task list.',
  arguments: [
    {
      label: 'List Title',
      key: 'listTitle',
      type: 'string' as const,
      required: true,
      description: '',
      variables: true,
    },
  ],

  async run($) {
    const listTitle = $.step.parameters.listTitle as string;

    const body = {
      title: listTitle,
    };

    const { data } = await $.http.post('/tasks/v1/users/@me/lists', body);

    $.setActionItem({
      raw: data,
    });
  },
});
