import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SkillService } from '../services/skill.service';
import {
  CreateSkillDto,
  UpdateSkillDto,
  SkillResponseDto,
} from '../dto/skill.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('Skills')
@Controller('skills')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SkillController {
  private readonly logger = new Logger(SkillController.name);

  constructor(private readonly skillService: SkillService) {}

  @Post()
  @Roles('provider')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new skill (Provider only)' })
  @ApiBody({ type: CreateSkillDto })
  @ApiResponse({
    status: 201,
    description: 'Skill created successfully',
    type: SkillResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Only providers can create skills',
  })
  async createSkill(
    @Body() createSkillDto: CreateSkillDto,
    @Request() req,
  ): Promise<SkillResponseDto> {
    try {
      this.logger.log(`Creating skill for provider: ${req.user.userId}`);
      const skill = await this.skillService.createSkill(
        createSkillDto,
        req.user.userId,
      );
      this.logger.log(`Skill created successfully: ${skill.id}`);
      return skill;
    } catch (error) {
      this.logger.error(`Error creating skill: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  @Roles('provider')
  @ApiOperation({ summary: 'Update a skill (Provider only - own skills)' })
  @ApiParam({ name: 'id', description: 'Skill ID' })
  @ApiBody({ type: UpdateSkillDto })
  @ApiResponse({
    status: 200,
    description: 'Skill updated successfully',
    type: SkillResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  @ApiResponse({
    status: 403,
    description: 'You can only update your own skills',
  })
  async updateSkill(
    @Param('id') skillId: string,
    @Body() updateSkillDto: UpdateSkillDto,
    @Request() req,
  ): Promise<SkillResponseDto> {
    try {
      this.logger.log(
        `Updating skill ${skillId} for provider: ${req.user.userId}`,
      );
      const skill = await this.skillService.updateSkill(
        skillId,
        updateSkillDto,
        req.user.userId,
      );
      this.logger.log(`Skill updated successfully: ${skillId}`);
      return skill;
    } catch (error) {
      this.logger.error(`Error updating skill: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('my-skills')
  @Roles('provider')
  @ApiOperation({ summary: "Get provider's own skills" })
  @ApiResponse({
    status: 200,
    description: 'Provider skills retrieved successfully',
    type: [SkillResponseDto],
  })
  async getProviderSkills(@Request() req): Promise<SkillResponseDto[]> {
    try {
      this.logger.log(`Fetching skills for provider: ${req.user.userId}`);
      const skills = await this.skillService.getProviderSkills(req.user.userId);
      this.logger.log(
        `Retrieved ${skills.length} skills for provider: ${req.user.userId}`,
      );
      return skills;
    } catch (error) {
      this.logger.error(
        `Error fetching provider skills: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Delete(':id')
  @Roles('provider')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a skill (Provider only - own skills)' })
  @ApiParam({ name: 'id', description: 'Skill ID' })
  @ApiResponse({
    status: 204,
    description: 'Skill deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  @ApiResponse({
    status: 403,
    description: 'You can only delete your own skills',
  })
  async deleteSkill(
    @Param('id') skillId: string,
    @Request() req,
  ): Promise<void> {
    try {
      this.logger.log(
        `Deleting skill ${skillId} for provider: ${req.user.userId}`,
      );
      await this.skillService.deleteSkill(skillId, req.user.userId);
      this.logger.log(`Skill deleted successfully: ${skillId}`);
    } catch (error) {
      this.logger.error(`Error deleting skill: ${error.message}`, error.stack);
      throw error;
    }
  }
}
