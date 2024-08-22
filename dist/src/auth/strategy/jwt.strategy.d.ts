import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base implements CanActivate {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validate(payload: any): Promise<{
        username: any;
        role: "admin" | "regular";
    }>;
    canActivate(context: ExecutionContext): boolean;
}
export {};
