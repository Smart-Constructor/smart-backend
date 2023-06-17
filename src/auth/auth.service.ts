import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuhtDto, AuhtDtoSignup } from "./dto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: AuhtDtoSignup) {
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
    } catch (error) {
      if (error.code === "P2002") {
        throw new ForbiddenException("Credentials taken");
      }
      throw error;
    }
  }

  async singin(dto: AuhtDto) {
    const email = dto.email;
    const password = dto.password;

    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials not found');

    const pwMatches = await bcrypt.compare(password, user.password);

    if (!pwMatches) throw new ForbiddenException('Credentials are not valid');

    const token = await this.signinToken(user.id, user.email);
    
    const session = await this.prisma.sessions.create({
      data:{
        userId: user.id,
        token: token.access_token,
      }
    })

    return session
  }

  async signinToken (userId: number, email: string) : Promise<{access_token: string}> {
    const payload = {
      sub: userId,
      email,
    }

    const secret = this.config.get('JWT_SECRET_KEY');

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '30m',
        secret: secret,
      }
    )

    return {access_token: token}
  }
}
