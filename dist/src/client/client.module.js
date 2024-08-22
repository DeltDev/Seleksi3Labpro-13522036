"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientModule = void 0;
const common_1 = require("@nestjs/common");
const client_controller_1 = require("./client.controller");
const client_service_1 = require("./client.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entity/user.entity");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("../auth/auth.service");
const user_service_1 = require("../user/user.service");
const passport_1 = require("@nestjs/passport");
const auth_constants_1 = require("../auth/auth.constants");
const user_module_1 = require("../user/user.module");
const axios_1 = require("@nestjs/axios");
let ClientModule = class ClientModule {
};
exports.ClientModule = ClientModule;
exports.ClientModule = ClientModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            user_module_1.UserModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: auth_constants_1.jwtConstants.secret,
                signOptions: { expiresIn: '24h' },
            }), axios_1.HttpModule,
        ],
        controllers: [client_controller_1.ClientController],
        providers: [client_service_1.ClientService, auth_service_1.AuthService, user_service_1.UserService,],
    })
], ClientModule);
//# sourceMappingURL=client.module.js.map