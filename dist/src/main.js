"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./http-exception.filter");
const common_1 = require("@nestjs/common");
const process = require("node:process");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.enableCors();
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT, () => console.log(`Listening on port ${PORT} on environment ${process.env.NODE_ENV || 'development'}`));
}
bootstrap();
//# sourceMappingURL=main.js.map