import { ClientService } from './client.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ClientLoginDto } from './dto/client-login.dto';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    redirectToHome(): {};
    showRegistrationForm(): Promise<{}>;
    submitRegister(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    showHomePage(): Promise<{}>;
    showLoginPage(): Promise<void>;
    showFilmCatalog(): Promise<void>;
    clientLogin(clientLoginDto: ClientLoginDto): Promise<{
        token: any;
        message?: undefined;
    } | {
        message: string;
        token?: undefined;
    }>;
    showProfilePage(req: any): Promise<{
        user: any;
    }>;
}
