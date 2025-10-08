import { IsEmail, IsString, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'User name' })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({ example: 'john@example.com', description: 'User email' })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Password123!', description: 'User password (must contain uppercase, lowercase, number, special character, min 8 chars)' })
    @Matches(/^(?=.*[a-z]).+$/, { message: 'La contraseña debe contener al menos una letra minúscula',})
    @Matches(/^(?=.*[A-Z]).+$/, { message: 'La contraseña debe contener al menos una letra mayúscula',})
    @Matches(/^(?=.*\d).+$/, { message: 'La contraseña debe contener al menos un número',})
    @Matches(/^(?=.*[@$!%*?&]).+$/, { message: 'La contraseña debe contener al menos un carácter especial',})
    @Matches(/^.{8,}$/, { message: 'La contraseña debe tener al menos 8 caracteres',})
    password: string;
}
