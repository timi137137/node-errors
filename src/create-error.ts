import { GeneralError } from '@/definition';
import type { ErrorCode, ErrorDefinition } from '@/index';

import type { IData } from './service-error';
import { ServiceError } from './service-error';

const ServiceErrors = {
  ...GeneralError,
} satisfies ErrorDefinition;

export { ServiceErrors };

type ProxyFunction = (message?: string, data?: Record<string, unknown>) => ServiceError;

export function registerErrors(errors: ErrorDefinition): void {
  Object.assign(ServiceErrors, errors);
}

function _createError(code: string, message?: string, data?: IData, stackAt?: ProxyFunction): ServiceError {
  const error = code in ServiceErrors ? ServiceErrors[code as keyof typeof ServiceErrors] : ServiceErrors.UNKNOWN;
  const serviceError = new ServiceError(code, message ?? error[0], data);
  serviceError.httpCode ??= error[1] as number;
  Error.captureStackTrace(serviceError, stackAt ?? _createError);
  return serviceError;
}

export type createError = {
  [code in ErrorCode<typeof GeneralError>]: (message?: string, data?: IData) => ServiceError;
};

export const createError: createError & typeof _createError = new Proxy(_createError, {
  get(target: typeof _createError, p: string): (message?: string, data?: IData) => ServiceError {
    let fn: ProxyFunction;
    if (p in ServiceErrors) {
      fn = (message, data) => target(p, message, data, fn);
    } else {
      fn = (message, data) => target('UNKNOWN', `${p.toString()}: ${message ?? ''}`, data, fn);
    }
    return fn;
  },
}) as unknown as createError & typeof _createError;
