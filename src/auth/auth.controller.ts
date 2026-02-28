import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() createAuthDto: createUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginUserDto: UserLoginDto) {
    return this.authService.login(loginUserDto);
  }

  // @Get()
  // @UseGuards( AuthGuard() )
  // testingPrivateRoute(@Req() request: Express.Request) {
  //   console.log(request)
  //   return { ok: true, message: 'Hola Mundo Private' }
  // }

}
