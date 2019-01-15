export class UserModel {
  userId: number;
  username: string;
  password?: string;
  name?: string;
  userCode?: string;
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
}
export class LoginModel {
  username: string;
  password: string;
}