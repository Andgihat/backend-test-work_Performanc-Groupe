import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.users.findByEmailWithHash(email);
    if (!user) throw new UnauthorizedException('wrong credentials');

    const ok = await bcrypt.compare(pass, user.passwordHash);
    if (!ok) throw new UnauthorizedException('wrong credentials');
    return user;
  }

  async signTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwt.sign(payload);

    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    });

    return { accessToken, refreshToken };
  }

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    return this.signTokens(user);
  }

  async refresh(rt: string) {
    try {
      const data = this.jwt.verify<{ sub: string; email: string; role: string }>(
        rt,
        { secret: process.env.JWT_REFRESH_SECRET },
      );
      const user = await this.users.findOne(data.sub);
      return this.signTokens(user as User);
    } catch {
      throw new UnauthorizedException('invalid refresh token');
    }
  }
}

