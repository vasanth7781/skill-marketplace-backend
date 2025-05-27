import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ProviderService } from '../services/provider.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { LocalStrategy } from '../strategies/local.strategy';
import { User } from '../entities/user.entity';
import { Provider } from '../entities/provider.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Provider]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    ProviderService,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService, UserService, ProviderService],
})
export class AuthModule {}