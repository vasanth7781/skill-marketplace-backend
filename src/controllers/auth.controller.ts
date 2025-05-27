import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { RegisterProviderDto } from '../dto/register-provider.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register/user')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ 
    type: RegisterUserDto,
    examples: {
      individual: {
        summary: 'Individual User Registration',
        value: {
          user_type: 'individual',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
          mobile_number: '+1234567890'
        }
      },
      company: {
        summary: 'Company User Registration',
        value: {
          user_type: 'company',
          company_name: 'Tech Solutions Inc',
          business_tax_number: 'TAX123456',
          representative_first_name: 'Jane',
          representative_last_name: 'Smith',
          representative_email: 'jane.smith@techsolutions.com',
          representative_mobile: '+1234567890',
          email: 'contact@techsolutions.com',
          password: 'password123'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists or email already registered as provider',
  })
  async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    try {
      this.logger.log(`User registration attempt for email: ${registerUserDto.email}`);
      const result = await this.authService.createUser(registerUserDto);
      this.logger.log(`User ${registerUserDto.email} registered successfully`);
      return result;
    } catch (error) {
      this.logger.error(`User registration failed: ${error.message}`);
      throw error;
    }
  }

  @Post('register/provider')
  @ApiOperation({ summary: 'Register a new provider' })
  @ApiBody({ 
    type: RegisterProviderDto,
    examples: {
      individual: {
        summary: 'Individual Provider Registration',
        value: {
          provider_type: 'individual',
          first_name: 'Alice',
          last_name: 'Johnson',
          email: 'alice.johnson@example.com',
          password: 'password123',
          mobile_number: '+1234567890'
        }
      },
      company: {
        summary: 'Company Provider Registration',
        value: {
          provider_type: 'company',
          company_name: 'Design Studio LLC',
          business_tax_number: 'TAX789012',
          representative_first_name: 'Bob',
          representative_last_name: 'Wilson',
          representative_email: 'bob.wilson@designstudio.com',
          representative_mobile: '+1234567890',
          email: 'contact@designstudio.com',
          password: 'password123'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Provider registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists or email already registered as user',
  })
  async registerProvider(@Body() registerProviderDto: RegisterProviderDto): Promise<AuthResponseDto> {
    try {
      this.logger.log(`Provider registration attempt for email: ${registerProviderDto.email}`);
      const result = await this.authService.createProvider(registerProviderDto);
      this.logger.log(`Provider ${registerProviderDto.email} registered successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Provider registration failed: ${error.message}`);
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Login user or provider',
    description: 'Authenticate user or provider with email, password, and user type. The user_type field is required to distinguish between user and provider accounts with the same email address.'
  })
  @ApiBody({ 
    type: LoginDto,
    examples: {
      user: {
        summary: 'User Login',
        value: {
          email: 'john.doe@example.com',
          password: 'password123',
          user_type: 'user'
        }
      },
      provider: {
        summary: 'Provider Login',
        value: {
          email: 'alice.johnson@example.com',
          password: 'password123',
          user_type: 'provider'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
    schema: {
      examples: {
        user: {
          summary: 'User Login Response',
          value: {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            user_type: 'user',
            user_id: 'uuid-string',
            email: 'john.doe@example.com'
          }
        },
        provider: {
          summary: 'Provider Login Response',
          value: {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            user_type: 'provider',
            user_id: 'uuid-string',
            email: 'alice.johnson@example.com'
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or user type mismatch',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      this.logger.log(`Login attempt for ${loginDto.user_type}: ${loginDto.email}`);
      const result = await this.authService.login(loginDto);
      this.logger.log(`${loginDto.user_type} ${loginDto.email} logged in successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Login failed for ${loginDto.user_type} ${loginDto.email}: ${error.message}`);
      throw error;
    }
  }
}