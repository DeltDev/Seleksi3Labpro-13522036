import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { BalanceUpdateDto } from './dto/balance-update.dto';
import { GeneralResponseDto } from '../response/dto/general-response.dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getUsers(userQueryDto: UserQueryDto): Promise<GeneralResponseDto>;
    create(userDto: CreateUserDto): Promise<GeneralResponseDto>;
    getID(userId: string): Promise<GeneralResponseDto>;
    delete(userId: string): Promise<GeneralResponseDto>;
    findByUsername(username: string): Promise<User | null>;
    updateBalance(id: string, balanceUpdateDto: BalanceUpdateDto): Promise<GeneralResponseDto>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
    countUsers(): Promise<number>;
}
