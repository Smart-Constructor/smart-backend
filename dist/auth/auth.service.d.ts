import { AuhtDto, AuhtDtoSignup } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    signup(dto: AuhtDtoSignup): Promise<import(".prisma/client").Users>;
    singin(dto: AuhtDto): Promise<import(".prisma/client").Sessions>;
    signinToken(userId: number, email: string): Promise<{
        access_token: string;
    }>;
}
