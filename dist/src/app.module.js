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
var AppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const user_module_1 = require("./user/user.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entity/user.entity");
const auth_module_1 = require("./auth/auth.module");
const film_module_1 = require("./film/film.module");
const data_source_1 = require("../db/data-source");
const user_seeder_1 = require("../db/user-seeder");
const user_service_1 = require("./user/user.service");
const platform_express_1 = require("@nestjs/platform-express");
const film_entity_1 = require("./entity/film.entity");
const s3_module_1 = require("./s3/s3.module");
let AppModule = AppModule_1 = class AppModule {
    constructor(userSeeder, userService) {
        this.userSeeder = userSeeder;
        this.userService = userService;
        this.logger = new common_1.Logger(AppModule_1.name);
    }
    async onModuleInit() {
        const userCount = await this.userService.countUsers();
        if (userCount === 0) {
            await this.userSeeder.seed();
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = AppModule_1 = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController],
        imports: [
            user_module_1.UserModule,
            typeorm_1.TypeOrmModule.forRoot(data_source_1.dataSourceOptions),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, film_entity_1.Film]),
            auth_module_1.AuthModule,
            film_module_1.FilmModule,
            platform_express_1.MulterModule.register(),
            s3_module_1.S3Module,
        ],
        providers: [user_seeder_1.UserSeeder, user_service_1.UserService]
    }),
    __metadata("design:paramtypes", [user_seeder_1.UserSeeder,
        user_service_1.UserService])
], AppModule);
//# sourceMappingURL=app.module.js.map