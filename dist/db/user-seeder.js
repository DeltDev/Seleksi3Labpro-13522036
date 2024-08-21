"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_factory_1 = require("./user-factory");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../src/entity/user.entity");
let UserSeeder = class UserSeeder {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async seed() {
        for (let i = 0; i < 10; i++) {
            const adminUser = user_factory_1.SeededUserFactory.createSeededUser(i, 'admin');
            await this.createUser(adminUser);
        }
        for (let i = 0; i < 10; i++) {
            const regularUser = user_factory_1.SeededUserFactory.createSeededUser(i, 'regular');
            await this.createUser(regularUser);
        }
        console.log('Seeding complete.');
    }
    async createUser(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = this.userRepository.create({
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            role: userData.role,
            firstName: userData.firstName,
            lastName: userData.lastName,
        });
        await this.userRepository.save(user);
    }
};
exports.UserSeeder = UserSeeder;
exports.UserSeeder = UserSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserSeeder);
//# sourceMappingURL=user-seeder.js.map