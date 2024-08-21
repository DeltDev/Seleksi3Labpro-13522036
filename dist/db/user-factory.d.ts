export declare class GeneratedUser {
    private username;
    private email;
    private password;
    private role;
    private firstName;
    private lastName;
    constructor(username: string, email: string, password: string, role: string, firstName: string, lastName: string);
}
export declare class SeededAdmin extends GeneratedUser {
    constructor(index: number);
}
export declare class SeededRegular extends GeneratedUser {
    constructor(index: number);
}
export declare class SeededUserFactory {
    static createSeededUser(index: number, userType: string): GeneratedUser;
}
