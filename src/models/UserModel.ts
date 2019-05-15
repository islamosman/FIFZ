// import { reservationEnum } from "../providers/Enums/reservationEnum";

export class UserModel {
  userId: number;
  username: string;
  password?: string;
  name?: string;
  userCode?: string;
  tocken?: any;
  UserIdToB?: string;
  TockenToB?: string;
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
  email: string;
}
export class LoginModel {
  urlStr: string = "http://localhost:30823/";
  username: string;
  password: string;
}

export class UserStateModel {
  IdStatus: boolean;
  VisaStatus: boolean;
  RefundOrderId: string;
  Tocken: string;
  UserId: string;
  IsRefunded:boolean;
}


export class SubscriptionModel {
  PhoneNumber: number;
  Location: string;
  Lng: number;
  Lat: number;
  DaysCount: number;
  DateTimeStr: string;
  DateStr: string;
  TimeStr: string;
  PromoCodeName?: string;
  tocken: string;
}