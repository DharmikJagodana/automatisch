import { IGlobalVariable } from '@automatisch/types';

export default {
  name: 'List create worksheet fields',
  key: 'listCreateWorksheetFields',

  async run($: IGlobalVariable) {
    if ($.step.parameters.createWorksheet) {
      return [
        {
          label: 'Headers',
          key: 'headers',
          type: 'dynamic' as const,
          required: false,
          fields: [
            {
              label: 'Header',
              key: 'header',
              type: 'string' as const,
              required: true,
              variables: true,
            },
          ],
        },
        {
          label: 'Overwrite',
          key: 'overwrite',
          type: 'dropdown' as const,
          required: false,
          value: false,
          description:
            'If a worksheet with the specified title exists, its content would be lost. Please, use with caution.',
          variables: true,
          options: [
            {
              label: 'Yes',
              value: 'true',
            },
            {
              label: 'No',
              value: 'false',
            },
          ],
        },
      ];
    }
  },
};
