import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
    ) {}

    async register(registerUserDto: RegisterUserDto) {
        const userExists = await this.usersService.findByEmail(registerUserDto.email);
    
        if (userExists) {
            throw new BadRequestException('User already exists');
        }
    
        try {
            const { password, ...rest } = registerUserDto;
    
            // Crear el usuario con la contraseña encriptada
            const user = await this.usersService.create({
                ...rest,
                password: bcrypt.hashSync(password, 10), // Encriptar la contraseña
            });

            const { password: _, ...userWithoutPassword } = user;
    
            return userWithoutPassword;
        } catch (error) {
            console.error("*********ERROR *******", error.code);
            throw new BadRequestException('Error creating user');
        }
    }

    async login(loginUserDto: LoginUserDto) {
        
        const {email, password} = loginUserDto;
        const user = await this.userRepository.findOne(
                {where:{email},
                select: {email: true, id: true, name:true, password:true, roles: true}
            });

        if (!user){
            throw new UnauthorizedException('Invalid credentials (email)');
        }
        if (!bcrypt.compareSync(password, user.password)){
            throw new UnauthorizedException('Invalid credentials (password)');
        }

        const { password: _, ...userWithoutPassword } = user;

        
        return {...userWithoutPassword, token: this.jwtService.sign({id: user.id, roles: user.roles, email: user.email, name: user.name})};

        
    }
}
