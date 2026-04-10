export { type ISendOtp, type ILogin, type IRegister } from "./auth.type"

// General Response Type
export interface IResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
}
// General Response Type

// Register Response Type Here
export interface IRegisterResponse {
  name: string
  email: string
  password: string
  role: string
  isDeleted: boolean
  isActive: string
  isVerified: boolean
  auths: IAuth[]
  _id: string
  createdAt: string
  updatedAt: string
}
// Register Response Type Here

// General Auth Type Here
export interface IAuth {
  provider: string
  providerId: string
}
// General Auth Type 

// Login Data Response Type
export interface ILoginData {
  accessToken: string
  refreshToken: string
  user: ILoginResponse
}
// Login Data Response Type

// Login Response Type
export interface ILoginResponse {
  _id: string
  name: string
  email: string
  role: string
  isDeleted: boolean
  isActive: string
  isVerified: boolean
  auths: IAuth[]
  createdAt: string
  updatedAt: string
  phone: string
  address: string
}
// Login Response Type
