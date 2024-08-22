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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const auth_constants_1 = require("../auth.constants");
const user_service_1 = require("../../user/user.service");
const jwt_1 = require("@nestjs/jwt");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(userService, jwtService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: auth_constants_1.jwtConstants.secret,
        });
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validate(payload) {
        const user = await this.userService.findByUsername(payload.username);
        console.log(payload.username);
        console.log(user);
        return { username: payload.username, role: user.role };
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['authorization']?.split(' ')[1];
        if (token) {
            const user = this.jwtService.verify(token);
            request.user = user;
            return true;
        }
        return false;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService, jwt_1.JwtService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map