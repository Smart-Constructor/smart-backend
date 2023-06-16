import { AuthService } from './auth.service';
import { AuhtDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: AuhtDto): Promise<import(".prisma/client").Users>;
}
