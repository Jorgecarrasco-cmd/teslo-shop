import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt'
import { UserLoginDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async create(createUserDto: createUserDto) {
    try {

      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })
      await this.userRepository.save(user);
      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }

    } catch (error) {
      this.handleDbError(error)
    }
  }

  async login(loginUserDto: UserLoginDto) {

    const { password, email } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        id: true,
        password: true
      }
    });

    if (!user) throw new UnauthorizedException('Credenciales no son correctas (email)')

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credenciales no son correctas (password)')

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }


  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)
    return token;
  }


  private handleDbError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail)
    console.log(error)
    throw new InternalServerErrorException('Please check log errors')
  }
}
