import { OnModuleInit } from '@nestjs/common';
import { UserSeeder } from '../db/user-seeder';
import { UserService } from './user/user.service';
export declare class AppModule implements OnModuleInit {
    private readonly userSeeder;
    private readonly userService;
    private readonly logger;
    constructor(userSeeder: UserSeeder, userService: UserService);
    onModuleInit(): Promise<void>;
}
