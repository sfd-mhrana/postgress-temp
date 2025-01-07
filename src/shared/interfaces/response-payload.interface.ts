export interface IResponsePayload<T> {
  success: boolean;
  message?: string;
  result?: T;
  total?: number;
  status?: string;
}

export interface ILoginResponsePayload {
  success: boolean;
  token?: string;
  message?: string;
  status?: string;
}

export interface IFileUploadResponsePayload {
  name: string;
  originalname: string;
  size: number;
  url: string;
}
