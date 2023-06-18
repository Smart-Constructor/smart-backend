import { AuthService } from './auth.service';
import { AuhtDto, AuhtDtoSignup } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: AuhtDtoSignup): Promise<import(".prisma/client").Users>;
    signin(dto: AuhtDto): Promise<{
        access_token: string;
    }>;
}
