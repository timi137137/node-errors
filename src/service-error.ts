import { omit } from 'lodash';
import { messageWithCauses, stackWithCauses } from 'pony-cause';

export interface IData {
  [key: string]: unknown;
  causedBy?: Error;
  httpCode?: number;
  serviceName?: string;
}

export class ServiceError extends Error {
  public readonly $isServiceError = true;
  public readonly code: string;
  public readonly name: string = 'ServiceError';
  public readonly data?: unknown;
  public httpCode?: number;
  public serviceName?: string;

  constructor(code: string, message: string, data?: IData) {
    super(message, { cause: data?.causedBy });
    this.message = messageWithCauses(this);

    this.code = code;
    if (typeof data === 'object' && data) {
      if (typeof data.httpCode === 'number') {
        this.httpCode = data.httpCode;
      }
      if (typeof data.serviceName === 'string') {
        this.serviceName = data.serviceName;
      }
      this.data = omit(data, 'causedBy', 'httpCode', 'serviceName');
    }
  }

  public static fromJSON(json: Record<string, unknown>): ServiceError {
    try {
      const error = new ServiceError(json.code as string, json.message as string, json.data as IData);
      error.httpCode = json.httpCode as number;
      if (typeof json.serviceName === 'string') {
        error.serviceName = json.serviceName;
      }
      return error;
    } catch {
      if ('message' in json) {
        const err = new Error(json.message as string);
        if (typeof json.stack === 'string') {
          err.stack = json.stack;
        }
        Object.assign(err, json);
        return new ServiceError('UNKNOWN', '未知错误', {
          causedBy: err,
        });
      } else {
        return new ServiceError('UNKNOWN', '未知错误', {
          error: json,
        });
      }
    }
  }

  public static fromError(error: Error): ServiceError {
    return new ServiceError('UNKNOWN', '未知错误', {
      causedBy: error,
    });
  }

  public static isServiceError(error: unknown): error is ServiceError {
    return typeof error === 'object' && error !== null && (error as Record<string, unknown>).$isServiceError === true;
  }

  public toJSON(): Record<string, unknown> {
    return {
      $isServiceError: this.$isServiceError,
      code: this.code,
      stack: stackWithCauses(this),
      message: this.message,
      name: this.name,
      data: this.data,
      httpCode: this.httpCode,
      serviceName: this.serviceName,
      cause: this.cause,
    };
  }
}
