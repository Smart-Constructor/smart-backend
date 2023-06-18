import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
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
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: "User already exists",
          },
          HttpStatus.CONFLICT,
          {
            cause: error,
          }
        );
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

    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "User not found",
        },
        HttpStatus.BAD_REQUEST
      );

    const pwMatches = await bcrypt.compare(password, user.password);

    if (!pwMatches)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Credentials are not valid",
        },
        HttpStatus.BAD_REQUEST
      );

    const token = await this.signinToken(user.id, user.email);

    const session = await this.prisma.sessions.create({
      data: {
        userId: user.id,
        token: token.access_token,
      },
    });

    if (!session)
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Internal server error, please try again later",
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    return token;
  }

  async signinToken(
    userId: number,
    email: string
  ): Promise<{ access_token: string }> {
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
}
