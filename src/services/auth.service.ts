import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { ProviderService } from './provider.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { RegisterProviderDto } from '../dto/register-provider.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserType } from '../enums/user-type.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private providerService: ProviderService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
    userType: string,
  ): Promise<any> {
    try {
      this.logger.log(`Validating ${userType} with email: ${email}`);

      let user = null;

      if (userType === 'user') {
        user = await this.userService.findByEmail(email);
        if (!user) {
          this.logger.warn(`User not found with email: ${email}`);
          return null;
        }
      } else if (userType === 'provider') {
        const provider = await this.providerService.findByEmail(email);
        if (!provider) {
          this.logger.warn(`Provider not found with email: ${email}`);
          return null;
        }
        user = {
          id: provider.id,
          email: provider.email,
          password: provider.password,
          first_name: provider.first_name,
          last_name: provider.last_name,
          user_type: provider.provider_type,
          mobile_number: provider.mobile_number,
          company_name: provider.company_name,
          business_tax_number: provider.business_tax_number,
          representative_first_name: provider.representative_first_name,
          representative_last_name: provider.representative_last_name,
          representative_email: provider.representative_email,
          representative_mobile: provider.representative_mobile,
          street_number: provider.street_number,
          street_name: provider.street_name,
          city_suburb: provider.city_suburb,
          state: provider.state,
          post_code: provider.post_code,
          created_at: provider.created_at,
          updated_at: provider.updated_at,
        };
      } else {
        this.logger.warn(`Invalid user type: ${userType}`);
        return null;
      }

      if (user && (await bcrypt.compare(password, user.password))) {
        this.logger.log(`${userType} ${email} validated successfully`);
        const { password, ...result } = user;
        return { ...result, userType };
      }

      this.logger.warn(`Invalid credentials for ${userType}: ${email}`);
      return null;
    } catch (error) {
      this.logger.error(`Error validating ${userType}: ${error.message}`);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      this.logger.log(
        `Login attempt for ${loginDto.user_type}: ${loginDto.email}`,
      );

      const user = await this.validateUser(
        loginDto.email,
        loginDto.password,
        loginDto.user_type,
      );
      if (!user) {
        throw new UnauthorizedException(
          'Invalid credentials or user type mismatch',
        );
      }

      const payload = {
        email: user.email,
        sub: user.id,
        userType: loginDto.user_type,
      };

      const access_token = this.jwtService.sign(payload);

      this.logger.log(
        `${loginDto.user_type} ${loginDto.email} logged in successfully`,
      );

      return {
        access_token,
        user_type: loginDto.user_type,
        user_id: user.id,
        email: user.email,
      };
    } catch (error) {
      this.logger.error(
        `Login error for ${loginDto.user_type} ${loginDto.email}: ${error.message}`,
      );
      throw error;
    }
  }

  async createUser(registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    try {
      this.logger.log(`Creating user with email: ${registerUserDto.email}`);

      const existingUser = await this.userService.findByEmail(
        registerUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const user = await this.userService.create(registerUserDto);

      const payload = {
        email: user.email,
        sub: user.id,
        userType: 'user',
      };

      const access_token = this.jwtService.sign(payload);

      this.logger.log(`User ${registerUserDto.email} created successfully`);

      return {
        access_token,
        user_type: 'user',
        user_id: user.id,
        email: user.email,
      };
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async createProvider(
    registerProviderDto: RegisterProviderDto,
  ): Promise<AuthResponseDto> {
    try {
      this.logger.log(
        `Creating provider with email: ${registerProviderDto.email}`,
      );

      const existingProvider = await this.providerService.findByEmail(
        registerProviderDto.email,
      );
      if (existingProvider) {
        throw new ConflictException('Email already exists as a user account');
      }

      const provider = await this.providerService.create(registerProviderDto);

      const payload = {
        email: provider.email,
        sub: provider.id,
        userType: 'provider',
      };

      const access_token = this.jwtService.sign(payload);

      this.logger.log(
        `Provider ${registerProviderDto.email} created successfully`,
      );

      return {
        access_token,
        user_type: 'provider',
        user_id: provider.id,
        email: provider.email,
      };
    } catch (error) {
      this.logger.error(`Error creating provider: ${error.message}`);
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }
}
