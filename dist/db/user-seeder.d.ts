import { Repository } from 'typeorm';
import { User } from '../src/entity/user.entity';
export declare class UserSeeder {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    seed(): Promise<void>;
    private createUser;
}
