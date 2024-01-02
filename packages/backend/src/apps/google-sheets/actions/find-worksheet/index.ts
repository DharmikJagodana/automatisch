import { IJSONObject } from '@automatisch/types';
import defineAction from '../../../../helpers/define-action';

type THeaders = {
  __id: string;
  header: string;
}[];

type TSheetsResponse = {
  sheets: {
    properties: {
      sheetId: string;
      title: string;
    };
  }[];
};

type TBody = {
  requests: IJSONObject[];
};

export default defineAction({
  name: 'Find worksheet',
  key: 'findWorksheet',
  description:
    'Finds a worksheet by title. Optionally, create a worksheet if none are found.',
  arguments: [
    {
      label: 'Drive',
      key: 'driveId',
      type: 'dropdown' as const,
      required: false,
      description:
        'The Google Drive where your spreadsheet resides. If nothing is selected, then your personal Google Drive will be used.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listDrives',
          },
        ],
      },
    },
    {
      label: 'Spreadsheet',
      key: 'spreadsheetId',
      type: 'dropdown' as const,
      required: true,
      dependsOn: ['parameters.driveId'],
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listSpreadsheets',
          },
          {
            name: 'parameters.driveId',
            value: '{parameters.driveId}',
          },
        ],
      },
    },
    {
      label: 'Title',
      key: 'title',
      type: 'string' as const,
      required: true,
      description:
        'The worksheet title needs to match exactly, and the search is case-sensitive.',
      variables: true,
    },
    {
      label: 'Create worksheet if none are found.',
      key: 'createWorksheet',
      type: 'dropdown' as const,
      required: false,
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listCreateWorksheetFields',
          },
          {
            name: 'parameters.createWorksheet',
            value: '{parameters.createWorksheet}',
          },
        ],
      },
    },
  ],

  async run($) {
    const createWorksheet = $.step.parameters.createWorksheet;

    const {
      data: { sheets },
    } = await $.http.get<TSheetsResponse>(
      `/v4/spreadsheets/${$.step.parameters.spreadsheetId}`
    );
    const selectedSheet = sheets.find(
      (sheet) => sheet.properties.title === $.step.parameters.title
    );

    if (createWorksheet) {
      const headers = $.step.parameters.headers as THeaders;
      const headerValues = headers.map((entry) => entry.header);
      const overwrite = $.step.parameters.overwrite === 'true';

      if (!overwrite && selectedSheet) {
        const { data } = await $.http.get<TSheetsResponse>(
          `/v4/spreadsheets/${$.step.parameters.spreadsheetId}`
        );

        $.setActionItem({
          raw: data,
        });
        return;
      }

      const body: TBody = {
        requests: [
          {
            addSheet: {
              properties: {
                title: $.step.parameters.title,
              },
            },
          },
        ],
      };

      if (overwrite && selectedSheet) {
        body.requests.unshift({
          deleteSheet: {
            sheetId: selectedSheet.properties.sheetId,
          },
        });
      }

      const { data } = await $.http.post(
        `/v4/spreadsheets/${$.step.parameters.spreadsheetId}:batchUpdate`,
        body
      );

      if (headerValues.length) {
        const body = {
          requests: [
            {
              updateCells: {
                rows: [
                  {
                    values: headerValues.map((header) => ({
                      userEnteredValue: { stringValue: header },
                    })),
                  },
                ],
                fields: '*',
                start: {
                  sheetId:
                    data.replies[data.replies.length - 1].addSheet.properties
                      .sheetId,
                  rowIndex: 0,
                  columnIndex: 0,
                },
              },
            },
          ],
        };

        const { data: response } = await $.http.post(
          `https://sheets.googleapis.com/v4/spreadsheets/${$.step.parameters.spreadsheetId}:batchUpdate`,
          body
        );

        $.setActionItem({
          raw: response,
        });
        return;
      }
    }

    $.setActionItem({
      raw: selectedSheet,
    });
  },
});
