import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from '../entities/provider.entity';
import { RegisterProviderDto } from '../dto/register-provider.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProviderService {
  private readonly logger = new Logger(ProviderService.name);

  constructor(
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
  ) {}

  async create(registerProviderDto: RegisterProviderDto): Promise<Provider> {
    try {
      this.logger.log(
        `Creating provider with email: ${registerProviderDto.email}`,
      );

      const hashedPassword = await bcrypt.hash(
        registerProviderDto.password,
        10,
      );

      const provider = this.providerRepository.create({
        provider_type: registerProviderDto.provider_type,
        first_name: registerProviderDto.first_name,
        last_name: registerProviderDto.last_name,
        email: registerProviderDto.email,
        password: hashedPassword,
        mobile_number: registerProviderDto.mobile_number,
        company_name: registerProviderDto.company_name,
        business_tax_number: registerProviderDto.business_tax_number,
        representative_first_name:
          registerProviderDto.representative_first_name,
        representative_last_name: registerProviderDto.representative_last_name,
        representative_email: registerProviderDto.representative_email,
        representative_mobile: registerProviderDto.representative_mobile,
        street_number: registerProviderDto.street_number,
        street_name: registerProviderDto.street_name,
        city_suburb: registerProviderDto.city_suburb,
        state: registerProviderDto.state,
        post_code: registerProviderDto.post_code,
        skills: [],
      });

      const savedProvider = await this.providerRepository.save(provider);
      this.logger.log(
        `Provider created successfully with ID: ${savedProvider.id}`,
      );

      return savedProvider;
    } catch (error) {
      this.logger.error(`Error creating provider: ${error.message}`);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Provider | null> {
    try {
      this.logger.log(`Finding provider by email: ${email}`);
      const provider = await this.providerRepository.findOne({
        where: { email },
      });
      return provider;
    } catch (error) {
      this.logger.error(`Error finding provider by email: ${error.message}`);
      throw error;
    }
  }

  async findById(id: string): Promise<Provider> {
    try {
      this.logger.log(`Finding provider by ID: ${id}`);
      const provider = await this.providerRepository.findOne({ where: { id } });

      if (!provider) {
        throw new NotFoundException('Provider not found');
      }

      return provider;
    } catch (error) {
      this.logger.error(`Error finding provider by ID: ${error.message}`);
      throw error;
    }
  }
}
