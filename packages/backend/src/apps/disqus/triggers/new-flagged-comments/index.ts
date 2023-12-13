import defineTrigger from '../../../../helpers/define-trigger';
import { URLSearchParams } from 'url';

export default defineTrigger({
  name: 'New flagged comments',
  key: 'newFlaggedComments',
  pollInterval: 15,
  description: 'Triggers when a Disqus comment is marked with a flag',
  arguments: [
    {
      label: 'Forum',
      key: 'forumId',
      type: 'dropdown' as const,
      required: true,
      description: 'Select the forum where you want comments to be triggered.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listForums',
          },
        ],
      },
    },
  ],

  async run($) {
    const forumId = $.step.parameters.forumId as string;

    const params = new URLSearchParams({
      limit: '100',
      forum: forumId,
    });

    let more;
    do {
      const { data } = await $.http.get(
        `/3.0/posts/list.json?${params.toString()}`
      );
      params.set('cursor', data.cursor.next);
      more = data.cursor.hasNext;

      if (data.response?.length) {
        for (const comment of data.response) {
          if (comment.isFlagged) {
            $.pushTriggerItem({
              raw: comment,
              meta: {
                internalId: comment.id,
              },
            });
          }
        }
      }
    } while (more);
  },
});
