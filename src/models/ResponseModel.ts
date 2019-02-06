export class ResponseModel {
  IsDone: any;
  ResponseId: any;
  MessegesStr: any;
  ErrorMessegesStr: any;
  Messages: any;
  ErrorMessages: any;
  ReturnedObject: any;
}

export class LoginResponseModel {
  $id: string;
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}