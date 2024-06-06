export interface SendMailOptionsType {
  subject: string;
  to: string;
  text?: string;
  html?: string | Buffer;
  from?: {
    name: string;
    address: string;
  };
}
