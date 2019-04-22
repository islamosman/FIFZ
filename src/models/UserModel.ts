// import { reservationEnum } from "../providers/Enums/reservationEnum";

export class UserModel {
  userId: number;
  username: string;
  password?: string;
  name?: string;
  userCode?: string;
  tocken?:any;
}

export class RegisterModel {
  device_unique_id: string;
  phone_number: number;
  email: string;
  password: string;
  first_name: string;
  last_name?: string;
  gender?: boolean;
  date_of_birth?: Date;
}
export class VerifyModel {
  mobileNumber: Number;
  messageStr: string;
  passCode: string;
  email:string;
}
export class LoginModel {
  urlStr:string ="http://localhost:30823/";
  username: string;
  password: string;
}