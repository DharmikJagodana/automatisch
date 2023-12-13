import { IJSONArray, IJSONObject } from '@automatisch/types';
import defineTrigger from '../../../../helpers/define-trigger';
import { URLSearchParams } from 'url';

export default defineTrigger({
  name: 'New comments',
  key: 'newComments',
  pollInterval: 15,
  description: 'Triggers when a new comment is posted in a forum using Disqus.',
  arguments: [
    {
      label: 'Post Types',
      key: 'postTypes',
      type: 'dynamic' as const,
      required: false,
      description:
        'Which posts should be considered for inclusion in the trigger?',
      fields: [
        {
          label: 'Type',
          key: 'type',
          type: 'dropdown' as const,
          required: false,
          description: '',
          variables: true,
          options: [
            { label: 'Unapproved Posts', value: 'unapproved' },
            { label: 'Approved Posts', value: 'approved' },
            { label: 'Spam Posts', value: 'spam' },
            { label: 'Deleted Posts', value: 'deleted' },
            { label: 'Flagged Posts', value: 'flagged' },
            { label: 'Highlighted Posts', value: 'highlighted' },
          ],
        },
      ],
    },
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
    const postTypes = $.step.parameters.postTypes as IJSONArray;
    const formattedCommentTypes = postTypes
      .filter((type: IJSONObject) => type.type !== '')
      .map((type: IJSONObject) => type.type);

    const params = new URLSearchParams({
      limit: '100',
      forum: forumId,
    });

    if (formattedCommentTypes.length) {
      formattedCommentTypes.forEach((type: string) =>
        params.append('include', type)
      );
    }

    let more;
    do {
      const { data } = await $.http.get(
        `/3.0/posts/list.json?${params.toString()}`
      );
      params.set('cursor', data.cursor.next);
      more = data.cursor.hasNext;

      if (data.response?.length) {
        for (const comment of data.response) {
          $.pushTriggerItem({
            raw: comment,
            meta: {
              internalId: comment.id,
            },
          });
        }
      }
    } while (more);
  },
});
