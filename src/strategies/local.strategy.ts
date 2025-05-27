import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: any, email: string, password: string): Promise<any> {
    try {
      this.logger.log(`Validating user with email: ${email}`);

      const userType = req.body.user_type;
      if (!userType) {
        this.logger.warn(`User type not provided for email: ${email}`);
        throw new UnauthorizedException('User type is required');
      }

      const user = await this.authService.validateUser(
        email,
        password,
        userType,
      );
      if (!user) {
        this.logger.warn(`Invalid credentials for ${userType}: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.log(`${userType} validated successfully: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`, error.stack);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
