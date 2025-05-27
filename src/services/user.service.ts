import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterUserDto } from '../dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    try {
      this.logger.log(`Creating user with email: ${registerUserDto.email}`);
      
      const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
      
      const user = this.userRepository.create({
        user_type: registerUserDto.user_type,
        first_name: registerUserDto.first_name,
        last_name: registerUserDto.last_name,
        email: registerUserDto.email,
        password: hashedPassword,
        mobile_number: registerUserDto.mobile_number,
        company_name: registerUserDto.company_name,
        business_tax_number: registerUserDto.business_tax_number,
        representative_first_name: registerUserDto.representative_first_name,
        representative_last_name: registerUserDto.representative_last_name,
        representative_email: registerUserDto.representative_email,
        representative_mobile: registerUserDto.representative_mobile,
        street_number: registerUserDto.street_number,
        street_name: registerUserDto.street_name,
        city_suburb: registerUserDto.city_suburb,
        state: registerUserDto.state,
        post_code: registerUserDto.post_code,
      });

      const savedUser = await this.userRepository.save(user);
      this.logger.log(`User created successfully with ID: ${savedUser.id}`);
      
      return savedUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      this.logger.log(`Finding user by email: ${email}`);
      const user = await this.userRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error.message}`);
      throw error;
    }
  }

  async findById(id: string): Promise<User> {
    try {
      this.logger.log(`Finding user by ID: ${id}`);
      const user = await this.userRepository.findOne({ where: { id } });
      
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by ID: ${error.message}`);
      throw error;
    }
  }
}