import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategys/jtw.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [

    //para crear la tabla en la base de datos
    TypeOrmModule.forFeature([
      User
    ]),

    //para usar variables de entorno
    ConfigModule,

    //configuracion del token
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configSerice: ConfigService) => {
        return {
          secret: configSerice.get('JWT_SECRET'),
          signOptions: { expiresIn: '2h' }
        }
      }
    })
    
  ],

  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule { }
