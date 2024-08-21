"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeededUserFactory = exports.SeededRegular = exports.SeededAdmin = exports.GeneratedUser = void 0;
class GeneratedUser {
    constructor(username, email, password, role, firstName, lastName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
exports.GeneratedUser = GeneratedUser;
class SeededAdmin extends GeneratedUser {
    constructor(index) {
        super(`admin${index}`, `admin${index}@admin.com`, "admin123", "admin", `Administrator${index}`, `admin${index}`);
    }
}
exports.SeededAdmin = SeededAdmin;
class SeededRegular extends GeneratedUser {
    constructor(index) {
        super(`dummy${index}`, `dummy${index}@dummy.com`, "dummy123", "regular", `Dummy${index}`, `dummy${index}`);
    }
}
exports.SeededRegular = SeededRegular;
class SeededUserFactory {
    static createSeededUser(index, userType) {
        if (userType === "admin") {
            return new SeededAdmin(index);
        }
        else if (userType === "regular") {
            return new SeededRegular(index);
        }
        else {
            throw new Error("Invalid user type");
        }
    }
}
exports.SeededUserFactory = SeededUserFactory;
//# sourceMappingURL=user-factory.js.map