import { GeneralResponseDto } from '../response/dto/general-response.dto';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ClientLoginDto } from './dto/client-login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
export declare class ClientService {
    private userRepository;
    private jwtService;
    private authService;
    private userService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, authService: AuthService, userService: UserService);
    registerUser(createUserDto: CreateUserDto): Promise<GeneralResponseDto>;
    clientLogin(clientLoginDto: ClientLoginDto): Promise<GeneralResponseDto>;
    clientValidateUser(username: string, password: string, email: string): Promise<GeneralResponseDto>;
}
