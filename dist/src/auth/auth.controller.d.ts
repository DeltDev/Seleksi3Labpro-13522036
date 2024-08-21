import { AuthService } from './auth.service';
import { GeneralResponseDto } from '../response/dto/general-response.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<GeneralResponseDto>;
    register(createUserDto: CreateUserDto): Promise<GeneralResponseDto>;
    getSelf(req: any): Promise<GeneralResponseDto>;
}
