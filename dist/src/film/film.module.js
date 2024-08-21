"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilmModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const film_entity_1 = require("../entity/film.entity");
const film_controller_1 = require("./film.controller");
const film_service_1 = require("./film.service");
const s3_module_1 = require("../s3/s3.module");
let FilmModule = class FilmModule {
};
exports.FilmModule = FilmModule;
exports.FilmModule = FilmModule = __decorate([
    (0, common_1.Module)({
        controllers: [film_controller_1.FilmController],
        providers: [film_service_1.FilmService],
        imports: [typeorm_1.TypeOrmModule.forFeature([film_entity_1.Film]), s3_module_1.S3Module],
        exports: [film_service_1.FilmService]
    })
], FilmModule);
//# sourceMappingURL=film.module.js.map