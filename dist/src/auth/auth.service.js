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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const user_response_dto_1 = require("../user/dto/user-response.dto");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validateUser(username, password) {
        const user = await this.userService.findByUsername(username);
        if (user) {
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
    async login(loginDto) {
        const user = await this.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            return {
                status: 'error',
                message: 'Invalid credentials',
                data: null,
            };
        }
        const payload = { username: user.data.username };
        const token = this.jwtService.sign(payload);
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
    async register(createUserDto) {
        try {
            const response = await this.userService.create(createUserDto);
            return {
                status: 'success',
                message: 'Registration successful',
                data: response.data,
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: `Registration failed: ${error.message}`,
                data: null,
            };
        }
    }
    async getUserFromToken(token) {
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.userService.findByUsername(decoded.username);
            if (!user) {
                return {
                    status: 'error',
                    message: 'User not found!',
                    data: null,
                };
            }
            const loginResponseDto = {
                username: user.username,
                token: token,
            };
            return {
                status: 'success',
                message: 'User authenticated',
                data: loginResponseDto,
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: `Authentication failed: ${error.message}`,
                data: null,
            };
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map