export * from './create-error';
export * from './service-error';

export type ErrorCode<T extends Record<string, readonly [string, number]>> = keyof T;
export interface ErrorDefinition {
  [code: string]: readonly [message: string, httpCode?: number];
}
