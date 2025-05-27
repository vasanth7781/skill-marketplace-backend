import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from '../entities/skill.entity';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skill.dto';

@Injectable()
export class SkillService {
  private readonly logger = new Logger(SkillService.name);

  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  async createSkill(
    createSkillDto: CreateSkillDto,
    providerId: string,
  ): Promise<Skill> {
    try {
      this.logger.log(`Creating skill for provider: ${providerId}`);

      const skill = this.skillRepository.create({
        ...createSkillDto,
        provider_id: providerId,
      });

      const savedSkill = await this.skillRepository.save(skill);
      this.logger.log(`Skill created successfully with ID: ${savedSkill.id}`);

      return savedSkill;
    } catch (error) {
      this.logger.error(`Error creating skill: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateSkill(
    skillId: string,
    updateSkillDto: UpdateSkillDto,
    providerId: string,
  ): Promise<Skill> {
    try {
      this.logger.log(`Updating skill ${skillId} for provider: ${providerId}`);

      const skill = await this.skillRepository.findOne({
        where: { id: skillId },
      });

      if (!skill) {
        throw new NotFoundException('Skill not found');
      }

      if (skill.provider_id !== providerId) {
        throw new ForbiddenException('You can only update your own skills');
      }

      await this.skillRepository.update(skillId, updateSkillDto);
      const updatedSkill = await this.skillRepository.findOne({
        where: { id: skillId },
      });

      this.logger.log(`Skill updated successfully: ${skillId}`);
      return updatedSkill;
    } catch (error) {
      this.logger.error(`Error updating skill: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getProviderSkills(providerId: string): Promise<Skill[]> {
    try {
      this.logger.log(`Fetching skills for provider: ${providerId}`);

      const skills = await this.skillRepository.find({
        where: { provider_id: providerId },
        order: { created_at: 'DESC' },
      });

      return skills;
    } catch (error) {
      this.logger.error(
        `Error fetching provider skills: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteSkill(skillId: string, providerId: string): Promise<void> {
    try {
      this.logger.log(`Deleting skill ${skillId} for provider: ${providerId}`);

      const skill = await this.skillRepository.findOne({
        where: { id: skillId },
      });

      if (!skill) {
        throw new NotFoundException('Skill not found');
      }

      if (skill.provider_id !== providerId) {
        throw new ForbiddenException('You can only delete your own skills');
      }

      await this.skillRepository.delete(skillId);
      this.logger.log(`Skill deleted successfully: ${skillId}`);
    } catch (error) {
      this.logger.error(`Error deleting skill: ${error.message}`, error.stack);
      throw error;
    }
  }
}
