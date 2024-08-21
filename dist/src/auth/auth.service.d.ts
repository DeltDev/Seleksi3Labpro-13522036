import { UserService } from '../user/user.service';
import { GeneralResponseDto } from '../response/dto/general-response.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<GeneralResponseDto>;
    login(loginDto: LoginDto): Promise<GeneralResponseDto>;
    register(createUserDto: CreateUserDto): Promise<GeneralResponseDto>;
    getUserFromToken(token: string): Promise<GeneralResponseDto>;
}
