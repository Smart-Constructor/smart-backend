import { Injectable } from "@nestjs/common";
import { AuhtDto } from "./dto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuhtDto) {
    const password = dto.password;
    const cpf = dto.cpf;
    const email = dto.email;

    const hash = await bcrypt.hash(password, 10);

    const user = await this.prisma.users.create({
      data: {
        cpf,
        email,
        password: hash,
      },
    });

    return user
  }
}
