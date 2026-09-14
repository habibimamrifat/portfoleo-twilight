export type ResponseType<T = null> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  path?: string;
  timestamp?: string;
};
