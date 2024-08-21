import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { BalanceUpdateDto } from './dto/balance-update.dto';
import { GeneralResponseDto } from '../response/dto/general-response.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUsers(queryDto: UserQueryDto): Promise<GeneralResponseDto>;
    store(createUserDto: CreateUserDto): Promise<GeneralResponseDto>;
    getID(id: string): Promise<GeneralResponseDto>;
    deleteUser(id: string): Promise<GeneralResponseDto>;
    incrementBalance(id: string, balanceUpdateDto: BalanceUpdateDto): Promise<GeneralResponseDto>;
}
