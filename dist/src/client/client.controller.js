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
exports.ClientController = void 0;
const common_1 = require("@nestjs/common");
const client_service_1 = require("./client.service");
const create_user_dto_1 = require("../user/dto/create-user.dto");
const client_login_dto_1 = require("./dto/client-login.dto");
let ClientController = class ClientController {
    constructor(clientService) {
        this.clientService = clientService;
    }
    redirectToHome() {
        return {};
    }
    async showRegistrationForm() {
        return {};
    }
    async submitRegister(createUserDto) {
        const response = await this.clientService.registerUser(createUserDto);
        return { message: response.message };
    }
    async showHomePage() {
        return {};
    }
    async showLoginPage() {
        return;
    }
    async showFilmCatalog() {
        return;
    }
    async clientLogin(clientLoginDto) {
        try {
            const resp = await this.clientService.clientLogin(clientLoginDto);
            if (resp.status === 'success') {
                return { token: resp.data.token };
            }
            else {
                return { message: 'Login failed' };
            }
        }
        catch (error) {
            console.error('Login error:', error);
            throw new common_1.InternalServerErrorException('An unexpected error occurred');
        }
    }
    async showProfilePage(req) {
        const user = localStorage.getItem("username");
        console.log(user);
        return { user };
    }
};
exports.ClientController = ClientController;
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.Redirect)('/home'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "redirectToHome", null);
__decorate([
    (0, common_1.Get)('/register'),
    (0, common_1.Render)('register.hbs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "showRegistrationForm", null);
__decorate([
    (0, common_1.Post)('/create-user'),
    (0, common_1.Render)('register.hbs'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "submitRegister", null);
__decorate([
    (0, common_1.Get)('/home'),
    (0, common_1.Render)('home.hbs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "showHomePage", null);
__decorate([
    (0, common_1.Get)('/client-login'),
    (0, common_1.Render)('login.hbs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "showLoginPage", null);
__decorate([
    (0, common_1.Get)('/browse-films'),
    (0, common_1.Render)('browse-films'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "showFilmCatalog", null);
__decorate([
    (0, common_1.Post)('/client-login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_login_dto_1.ClientLoginDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "clientLogin", null);
__decorate([
    (0, common_1.Get)('/self-profile'),
    (0, common_1.Render)('profile.hbs'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "showProfilePage", null);
exports.ClientController = ClientController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [client_service_1.ClientService])
], ClientController);
//# sourceMappingURL=client.controller.js.map