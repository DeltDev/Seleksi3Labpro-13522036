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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entity/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const user_response_dto_1 = require("./dto/user-response.dto");
const class_transformer_1 = require("class-transformer");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getUsers(userQueryDto) {
        try {
            let users;
            if (!userQueryDto.q) {
                users = await this.userRepository.find({ where: { role: 'regular' } });
            }
            else {
                users = await this.userRepository.find({
                    where: {
                        username: (0, typeorm_1.Like)(`%${userQueryDto.q.toLowerCase()}%`),
                        role: 'regular',
                    },
                });
            }
            if (users.length <= 0) {
                throw new Error('User not found');
            }
            return {
                status: 'success',
                message: `User retrieval successful %${userQueryDto}%`,
                data: (0, class_transformer_1.plainToClass)(user_response_dto_1.UserResponseDto, users),
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: `User retrieval failed: ${error.message}`,
                data: null,
            };
        }
    }
    async create(userDto) {
        const existingUser = await this.userRepository.findOne({
            where: [{ username: userDto.username.toLowerCase() }, { email: userDto.email.toLowerCase() }],
        });
        if (existingUser) {
            throw new common_1.ConflictException('Username or email already exists');
        }
        const hashedPassword = await bcrypt.hash(userDto.password, 12);
        const newUser = this.userRepository.create({
            username: userDto.username,
            email: userDto.email,
            firstName: userDto.firstName,
            lastName: userDto.lastName,
            password: hashedPassword,
            role: 'regular',
        });
        const savedUser = await this.userRepository.save(newUser);
        return {
            status: 'success',
            message: 'User registration successful',
            data: (0, class_transformer_1.plainToClass)(user_response_dto_1.UserResponseDto, savedUser),
        };
    }
    async getID(userId) {
        try {
            if (!userId) {
                throw new Error('UserID is not valid');
            }
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error('User not found');
            }
            return {
                status: 'success',
                message: 'User retrieval successful',
                data: (0, class_transformer_1.plainToClass)(user_response_dto_1.UserResponseDto, user),
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: `User retrieval failed: ${error.message}`,
                data: null,
            };
        }
    }
    async delete(userId) {
        try {
            if (!userId) {
                throw new Error('id is not valid');
            }
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (user.role === 'admin') {
                throw new Error('you cannot delete this user (admin)');
            }
            const result = await this.userRepository.delete(userId);
            if (result.affected === 0) {
                throw new Error('User not found');
            }
            return {
                status: 'success',
                message: 'User deletion successful',
                data: (0, class_transformer_1.plainToClass)(user_response_dto_1.UserResponseDto, user),
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: `User deletion failed: ${error.message}`,
                data: null,
            };
        }
    }
    async findByUsername(username) {
        return this.userRepository.findOne({ where: { username } });
    }
    async updateBalance(id, balanceUpdateDto) {
        try {
            if (balanceUpdateDto.increment <= 0) {
                throw new Error('increment is a negative number');
            }
            if (typeof balanceUpdateDto.increment !== 'number') {
                throw new Error('increment is not a number');
            }
            let user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new Error('User not found');
            }
            await this.userRepository.update(id, {
                balance: () => `balance + ${balanceUpdateDto.increment}`,
            });
            user = await this.userRepository.findOne({ where: { id } });
            return {
                status: 'success',
                message: 'Balance update successful',
                data: (0, class_transformer_1.plainToClass)(user_response_dto_1.UserResponseDto, user),
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: `Balance update failed: ${error.message}`,
                data: null,
            };
        }
    }
    async comparePasswords(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
    async countUsers() {
        return this.userRepository.count();
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map