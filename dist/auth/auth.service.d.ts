import { AuhtDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    signup(dto: AuhtDto): Promise<import(".prisma/client").Users>;
}
