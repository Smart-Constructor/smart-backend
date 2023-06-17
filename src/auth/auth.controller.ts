import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuhtDto, AuhtDtoSignup } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: AuhtDtoSignup) {
        return this.authService.signup(dto)
    }    

    @Post('signin')
    signin(@Body() dto: AuhtDto){
        return this.authService.singin(dto)
    }
}
