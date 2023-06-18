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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthService = exports.AuthService = class AuthService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async signup(dto) {
        const password = dto.password;
        const cpf = dto.cpf;
        const email = dto.email;
        const hash = await bcrypt.hash(password, 10);
        try {
            const user = await this.prisma.users.create({
                data: {
                    cpf,
                    email,
                    password: hash,
                },
            });
            return user;
        }
        catch (error) {
            if (error.code === "P2002") {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.CONFLICT,
                    error: "User already exists",
                }, common_1.HttpStatus.CONFLICT, {
                    cause: error,
                });
            }
            throw error;
        }
    }
    async singin(dto) {
        const email = dto.email;
        const password = dto.password;
        const user = await this.prisma.users.findUnique({
            where: {
                email,
            },
        });
        if (!user)
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: "User not found",
            }, common_1.HttpStatus.BAD_REQUEST);
        const pwMatches = await bcrypt.compare(password, user.password);
        if (!pwMatches)
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: "Credentials are not valid",
            }, common_1.HttpStatus.BAD_REQUEST);
        const token = await this.signinToken(user.id, user.email);
        const session = await this.prisma.sessions.create({
            data: {
                userId: user.id,
                token: token.access_token,
            },
        });
        if (!session)
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Internal server error, please try again later",
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        return token;
    }
    async signinToken(userId, email) {
        const payload = {
            sub: userId,
            email,
        };
        const secret = this.config.get("JWT_SECRET_KEY");
        const token = await this.jwt.signAsync(payload, {
            expiresIn: "30m",
            secret: secret,
        });
        return { access_token: token };
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map