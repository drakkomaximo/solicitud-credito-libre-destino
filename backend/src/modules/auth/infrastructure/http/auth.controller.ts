import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkEnvelope } from '@/common/decorators/api-responses.decorator';
import { AuthService } from '@/modules/auth/application/services/auth.service';
import { LoginDto } from './dto/login.dto';
import { ClientLoginDto } from './dto/client-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión administrativa',
    description:
      'Autentica un administrador y devuelve un JWT para acceder a los endpoints protegidos.',
  })
  @ApiOkEnvelope('Token generado')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('client')
  @ApiOperation({
    summary: 'Iniciar sesión de cliente',
    description:
      'Genera un JWT para un cliente a partir de su número de documento y teléfono celular. Con ese token el cliente puede consultar sus solicitudes asociadas.',
  })
  @ApiBody({ type: ClientLoginDto })
  @ApiOkEnvelope('Token generado')
  async clientLogin(@Body() dto: ClientLoginDto) {
    const accessToken = this.authService.generateClientToken(
      dto.documentNumber,
      dto.phone,
    );
    return { accessToken };
  }
}
