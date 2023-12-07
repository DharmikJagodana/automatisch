import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Acknowledge incident',
  key: 'acknowledgeIncident',
  description: 'Acknowledges an incident.',
  arguments: [
    {
      label: 'Incident ID',
      key: 'incidentId',
      type: 'string' as const,
      required: true,
      variables: true,
      description:
        'This serves as the incident ID that requires your acknowledgment.',
    },
    {
      label: 'Acknowledged by',
      key: 'acknowledgedBy',
      type: 'string' as const,
      required: false,
      variables: true,
      description:
        "This refers to the individual's name, email, or another form of identification that the person who acknowledged the incident has provided.",
    },
  ],

  async run($) {
    const acknowledgedBy = $.step.parameters.acknowledgedBy as string;
    const incidentId = $.step.parameters.incidentId as string;

    const body = {
      acknowledged_by: acknowledgedBy,
    };

    const response = await $.http.post(
      `/v2/incidents/${incidentId}/acknowledge`,
      body
    );

    $.setActionItem({ raw: response.data.data });
  },
});
