import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty({ message : "Mail-ը չի կարող լինել դատարկ" })
    @IsEmail({}, { message : "Mail-ը պետք է լինի իրական" })
    public readonly email : string

    @MinLength(8, { message: 'Գաղտնաբառը պետք է պարունակի առնվազն 8 նիշ' })
    @Matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, 
        { message: 'Գաղտնաբառը պետք է պարունակի մեկ մեծատառ և մեկ թիվ' }
    )
    public readonly password : string
}