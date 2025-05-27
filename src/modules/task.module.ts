import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from '../controllers/task.controller';
import { TaskService } from '../services/task.service';
import { Task } from '../entities/task.entity';
import { TaskProgress } from '../entities/task-progress.entity';
import { TaskCompletionFeedback } from '../entities/task-completion-feedback.entity';
import { Offer } from 'src/entities/offer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskProgress, TaskCompletionFeedback, Offer])
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}