import { IsEmail, IsString, MinLength, Matches } from "class-validator";

export class RegisterUserDto{
    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @Matches(/^(?=.*[a-z]).+$/, {
        message: 'La contraseña debe contener al menos una letra minúscula',
    })
    @Matches(/^(?=.*[A-Z]).+$/, {
        message: 'La contraseña debe contener al menos una letra mayúscula',
    })
    @Matches(/^(?=.*\d).+$/, {
        message: 'La contraseña debe contener al menos un número',
    })
    @Matches(/^(?=.*[@$!%*?&]).+$/, {
        message: 'La contraseña debe contener al menos un carácter especial',
    })
    @Matches(/^.{8,}$/, {
        message: 'La contraseña debe tener al menos 8 caracteres',
    })
    password: string;
}