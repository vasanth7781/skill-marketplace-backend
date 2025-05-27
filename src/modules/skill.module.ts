import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillController } from '../controllers/skill.controller';
import { SkillService } from '../services/skill.service';
import { Skill } from '../entities/skill.entity';
import { Provider } from '../entities/provider.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Skill, Provider]),
  ],
  controllers: [SkillController],
  providers: [SkillService],
  exports: [SkillService],
})
export class SkillModule {}