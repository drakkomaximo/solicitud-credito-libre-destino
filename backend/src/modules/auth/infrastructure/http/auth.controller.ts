import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkEnvelope } from '@/common/decorators/api-responses.decorator';
import { AuthService } from '@/modules/auth/application/services/auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión administrativa', description: 'Autentica un administrador y devuelve un JWT para acceder a los endpoints protegidos.' })
  @ApiOkEnvelope('Token generado')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
