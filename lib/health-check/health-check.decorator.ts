import type * as Swagger from '@nestjs/swagger';
import { getHealthCheckSchema } from './health-check.schema';

const noop = () => {};

function getSwaggerDefinitions(swagger: typeof Swagger) {
  const { ApiOkResponse, ApiServiceUnavailableResponse } = swagger;

  // Possible HTTP Status
  const ServiceUnavailable = ApiServiceUnavailableResponse({
    description: 'The Health Check is not successful',
    schema: getHealthCheckSchema('error'),
  });

  const Ok = ApiOkResponse({
    description: 'The Health Check is successful',
    schema: getHealthCheckSchema('ok'),
  });

  // Combine all the SwaggerDecorators
  return (target: any, key: any, descriptor: PropertyDescriptor) => {
    ServiceUnavailable(target, key, descriptor);
    Ok(target, key, descriptor);
  };
}

export const HealthCheck = () => {
  let swagger: typeof Swagger | null = null;
  try {
    // Dynamically load swagger, in case it is not installed
    swagger = require('@nestjs/swagger');
  } catch {}

  if (swagger) {
    return getSwaggerDefinitions(swagger);
  }
  return noop;
};
