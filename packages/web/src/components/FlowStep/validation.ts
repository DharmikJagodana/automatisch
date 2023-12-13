import type { BaseSchema } from 'yup';
import * as yup from 'yup';
import type { IField, ISubstep } from '@automatisch/types';
import { yupResolver } from '@hookform/resolvers/yup';
import isEmpty from 'helpers/isEmpty';

function addRequiredValidation({
  required,
  schema,
  key,
}: {
  required?: boolean;
  schema: BaseSchema;
  key: string;
}) {
  // if the field is required, add the required validation
  if (required) {
    return schema
      .required(`${key} is required.`)
      .test(
        'empty-check',
        `${key} must be not empty`,
        (value: any) => !isEmpty(value)
      );
  }
  return schema;
}

function addDependsOnValidation({
  schema,
  dependsOn,
  key,
  args,
}: {
  schema: BaseSchema;
  key: string;
  dependsOn?: string[];
  args: IField[];
}) {
  // if the field depends on another field, add the dependsOn required validation
  if (Array.isArray(dependsOn) && dependsOn.length > 0) {
    for (const dependsOnKey of dependsOn) {
      const dependsOnKeyShort = dependsOnKey.replace('parameters.', '');
      const dependsOnField = args.find(({ key }) => key === dependsOnKeyShort);

      if (dependsOnField?.required) {
        const missingDependencyValueMessage = `We're having trouble loading '${key}' data as required field '${dependsOnKey}' is missing.`;

        // TODO: make `dependsOnKey` agnostic to the field. However, nested validation schema is not supported.
        // So the fields under the `parameters` key are subject to their siblings only and thus, `parameters.` is removed.
        return schema.when(dependsOnKeyShort, {
          is: (dependsOnValue: string) => Boolean(dependsOnValue) === false,
          then: (schema) =>
            schema
              .notOneOf([''], missingDependencyValueMessage)
              .required(missingDependencyValueMessage),
        });
      }
    }
  }
  return schema;
}

export function generateValidationSchema(substeps: ISubstep[]) {
  const fieldValidations = substeps?.reduce(
    (allValidations, { arguments: args }) => {
      if (!args || !Array.isArray(args)) return allValidations;

      const substepArgumentValidations: Record<string, BaseSchema> = {};

      for (const arg of args) {
        const { key, required } = arg;

        // base validation for the field if not exists
        if (!substepArgumentValidations[key]) {
          substepArgumentValidations[key] = yup.mixed();
        }

        if (arg.type === 'dynamic') {
          const fieldsSchema: Record<string, BaseSchema> = {};

          for (const field of arg.fields) {
            fieldsSchema[field.key] = yup.mixed();

            fieldsSchema[field.key] = addRequiredValidation({
              required: field.required,
              schema: fieldsSchema[field.key],
              key: field.key,
            });

            fieldsSchema[field.key] = addDependsOnValidation({
              schema: fieldsSchema[field.key],
              dependsOn: field.dependsOn,
              key: field.key,
              args,
            });
          }

          substepArgumentValidations[key] = yup
            .array()
            .of(yup.object(fieldsSchema));
        } else if (
          typeof substepArgumentValidations[key] === 'object' &&
          (arg.type === 'string' || arg.type === 'dropdown')
        ) {
          substepArgumentValidations[key] = addRequiredValidation({
            required,
            schema: substepArgumentValidations[key],
            key,
          });

          substepArgumentValidations[key] = addDependsOnValidation({
            schema: substepArgumentValidations[key],
            dependsOn: arg.dependsOn,
            key,
            args,
          });
        }
      }

      return {
        ...allValidations,
        ...substepArgumentValidations,
      };
    },
    {}
  );

  const validationSchema = yup.object({
    parameters: yup.object(fieldValidations),
  });

  return yupResolver(validationSchema);
}
