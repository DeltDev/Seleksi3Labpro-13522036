"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./http-exception.filter");
const common_1 = require("@nestjs/common");
const process = require("node:process");
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = require("path");
const hbs = require("hbs");
const helpers = require("handlebars-helpers");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter());
    app.use(cookieParser());
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'public'));
    app.setBaseViewsDir((0, path_1.join)(process.cwd(), 'views'));
    app.setViewEngine('hbs');
    hbs.registerHelper(helpers());
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.enableCors({
        allowedHeaders: 'Authorization, Content-Type',
    });
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT, () => console.log(`Listening on port ${PORT} on environment ${process.env.NODE_ENV || 'development'}`));
}
bootstrap();
//# sourceMappingURL=main.js.map