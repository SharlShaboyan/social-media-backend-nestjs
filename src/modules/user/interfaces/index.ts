export interface IUserLogin {
    email : string,
    password : string
}

export interface IUserRegister extends IUserLogin {
    name : string
}