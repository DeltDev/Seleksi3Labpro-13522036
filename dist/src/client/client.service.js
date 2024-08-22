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
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entity/user.entity");
const typeorm_2 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("../auth/auth.service");
const user_service_1 = require("../user/user.service");
const user_response_dto_1 = require("../user/dto/user-response.dto");
let ClientService = class ClientService {
    constructor(userRepository, jwtService, authService, userService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authService = authService;
        this.userService = userService;
    }
    async registerUser(createUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: [{ username: createUserDto.username }, { email: createUserDto.email }],
        });
        if (existingUser) {
            return {
                status: 'error',
                message: 'User atau email sudah pernah terdaftar',
                data: null,
            };
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
        const newUser = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            balance: 0,
        });
        const savedUser = await this.userRepository.save(newUser);
        return {
            status: 'success',
            message: 'Pendaftaran berhasil',
            data: (0, class_transformer_1.plainToClass)(user_entity_1.User, savedUser),
        };
    }
    async clientLogin(clientLoginDto) {
        const user = await this.clientValidateUser(clientLoginDto.username, clientLoginDto.password, clientLoginDto.email);
        if (!user) {
            return {
                status: 'error',
                message: 'Invalid credentials',
                data: null,
            };
        }
        const payload = { username: user.data.username };
        let token;
        try {
            token = await this.jwtService.signAsync(payload);
        }
        catch (error) {
            console.error('Error generating JWT:', error);
            throw new Error('Failed to generate token');
        }
        const loginResponseDto = {
            username: user.data.username,
            token: token,
        };
        return {
            status: 'success',
            message: 'Login successful',
            data: loginResponseDto,
        };
    }
    async clientValidateUser(username, password, email) {
        const user = await this.userService.findByUsername(username);
        if (user) {
            if (user.email !== email) {
                return {
                    status: 'error',
                    message: 'Email incorrect!',
                    data: null,
                };
            }
            const isPasswordMatching = await this.userService.comparePasswords(password, user.password);
            if (isPasswordMatching) {
                return {
                    status: 'success',
                    message: 'Login successful',
                    data: (0, class_transformer_1.plainToClass)(user_response_dto_1.UserResponseDto, user),
                };
            }
            return {
                status: 'error',
                message: 'Password incorrect!',
                data: null,
            };
        }
        return {
            status: 'error',
            message: 'User not found!',
            data: null,
        };
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        auth_service_1.AuthService,
        user_service_1.UserService])
], ClientService);
//# sourceMappingURL=client.service.js.map