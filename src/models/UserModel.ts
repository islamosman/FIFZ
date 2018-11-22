export interface UserModel {
    userId:number,
    username: string,
    password?: string,
    name?:string
    userCode?:string
  }
  
  export interface RegisterModel{
    mobileNumber:number,
    username:string,
    password:string,
    email:string
  }