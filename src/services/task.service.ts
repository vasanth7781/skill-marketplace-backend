import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { Offer } from '../entities/offer.entity';
import { TaskProgress } from '../entities/task-progress.entity';
import { TaskCompletionFeedback } from '../entities/task-completion-feedback.entity';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponseDto,
  UpdateTaskProgressDto,
  TaskProgressResponseDto,
  TaskCompletionFeedbackResponseDto,
} from '../dto/task.dto';
import { TaskCompletionDto } from '../dto/task-completion.dto';
import { TaskStatus } from '../enums/task-status.enum';
import { OfferStatus } from '../enums/offer-status.enum';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(TaskProgress)
    private taskProgressRepository: Repository<TaskProgress>,
    @InjectRepository(TaskCompletionFeedback)
    private taskCompletionFeedbackRepository: Repository<TaskCompletionFeedback>,
  ) {}

  private transformToTaskResponseDto(task: Task): TaskResponseDto {
    return {
      id: task.id,
      user_id: task.user_id,
      task_name: task.task_name,
      description: task.description,
      category: task.category,
      expected_start_date: task.expected_start_date,
      expected_working_hours: task.expected_working_hours,
      hourly_rate: task.hourly_rate,
      rate_currency: task.rate_currency,
      status: task.status,
      accepted_provider_id: task.accepted_provider_id,
      completion_feedback: task.completion_feedback,
      completion_feedback_date: task.completion_feedback_date,
      created_at: task.created_at,
      updated_at: task.updated_at,
    };
  }

  private transformToTaskProgressResponseDto(
    progress: TaskProgress,
  ): TaskProgressResponseDto {
    return {
      id: progress.id,
      task_id: progress.task_id,
      provider_id: progress.provider_id,
      description: progress.description,
      created_at: progress.created_at,
    };
  }

  private transformToTaskCompletionFeedbackResponseDto(
    feedback: TaskCompletionFeedback,
  ): TaskCompletionFeedbackResponseDto {
    return {
      id: feedback.id,
      task_id: feedback.task_id,
      user_id: feedback.user_id,
      action_type: feedback.action_type,
      description: feedback.description,
      created_at: feedback.created_at,
    };
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<TaskResponseDto> {
    try {
      this.logger.log(`Creating task for user ${userId}`);

      const taskData = {
        ...createTaskDto,
        user_id: userId,
        status: TaskStatus.OPEN,
      };

      const task = this.taskRepository.create(taskData);
      const savedTask = await this.taskRepository.save(task);

      this.logger.log(`Task created successfully with ID: ${savedTask.id}`);
      return this.transformToTaskResponseDto(savedTask);
    } catch (error) {
      this.logger.error(`Error creating task: ${error.message}`);
      throw error;
    }
  }

  async getTasks(
    userId: string,
    userType: string,
    filters?: { status: string },
  ): Promise<TaskResponseDto[]> {
    try {
      this.logger.log(`Getting tasks for ${userType} ${userId}`);

      let queryBuilder = this.taskRepository.createQueryBuilder('task');

      if (userType === 'user') {
        queryBuilder = queryBuilder.where('task.user_id = :userId', { userId });
      }

      if (filters?.status) {
        queryBuilder = queryBuilder.andWhere('task.status = :status', {
          status: filters.status,
        });
      }

      const tasks = await queryBuilder
        .orderBy('task.created_at', 'DESC')
        .getMany();

      this.logger.log(
        `Retrieved ${tasks.length} tasks for ${userType} ${userId}`,
      );

      const transformedTasks = tasks.map((task) =>
        this.transformToTaskResponseDto(task),
      );

      return transformedTasks;
    } catch (error) {
      this.logger.error(`Error getting tasks: ${error.message}`);
      throw error;
    }
  }

  async getTaskById(
    id: string,
    userId: string,
    userType: string,
  ): Promise<TaskResponseDto> {
    try {
      this.logger.log(`Getting task ${id} for ${userType} ${userId}`);

      let queryBuilder = this.taskRepository
        .createQueryBuilder('task')
        .where('task.id = :id', { id });

      if (userType === 'user') {
        queryBuilder = queryBuilder.andWhere('task.user_id = :userId', {
          userId,
        });
      }

      const task = await queryBuilder.getOne();

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      this.logger.log(`Retrieved task ${id} successfully`);
      return this.transformToTaskResponseDto(task);
    } catch (error) {
      this.logger.error(`Error getting task by ID: ${error.message}`);
      throw error;
    }
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<TaskResponseDto> {
    try {
      this.logger.log(`Updating task ${id} for user ${userId}`);

      const task = await this.taskRepository.findOne({
        where: { id, user_id: userId },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      if (task.status !== TaskStatus.OPEN) {
        throw new BadRequestException('Cannot update task that is not open');
      }

      await this.taskRepository.update(id, updateTaskDto);
      const updatedTask = await this.taskRepository.findOne({ where: { id } });

      this.logger.log(`Task ${id} updated successfully`);
      return this.transformToTaskResponseDto(updatedTask);
    } catch (error) {
      this.logger.error(`Error updating task: ${error.message}`);
      throw error;
    }
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    try {
      this.logger.log(`Deleting task ${id} for user ${userId}`);

      const task = await this.taskRepository.findOne({
        where: { id, user_id: userId },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      if (task.status === TaskStatus.IN_PROGRESS) {
        throw new BadRequestException('Cannot delete task that is in progress');
      }

      await this.taskRepository.delete(id);
      this.logger.log(`Task ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Error deleting task: ${error.message}`);
      throw error;
    }
  }

  async updateTaskProgress(
    id: string,
    updateProgressDto: UpdateTaskProgressDto,
    providerId: string,
  ): Promise<TaskProgressResponseDto> {
    try {
      this.logger.log(
        `Provider ${providerId} updating progress for task ${id}`,
      );

      const task = await this.taskRepository.findOne({
        where: { id, accepted_provider_id: providerId },
      });

      if (!task) {
        throw new NotFoundException(
          'Task not found or you are not assigned to this task',
        );
      }

      if (task.status !== TaskStatus.IN_PROGRESS) {
        throw new BadRequestException('Task is not in progress');
      }

      const progressData = {
        task_id: id,
        provider_id: providerId,
        description: updateProgressDto.description,
      };

      const progress = this.taskProgressRepository.create(progressData);
      const savedProgress = await this.taskProgressRepository.save(progress);

      this.logger.log(`Progress updated successfully for task ${id}`);
      return this.transformToTaskProgressResponseDto(savedProgress);
    } catch (error) {
      this.logger.error(`Error updating task progress: ${error.message}`);
      throw error;
    }
  }

  async submitTaskForApproval(
    id: string,
    providerId: string,
  ): Promise<TaskResponseDto> {
    try {
      this.logger.log(
        `Provider ${providerId} submitting task ${id} for completion`,
      );

      const task = await this.taskRepository.findOne({
        where: { id, accepted_provider_id: providerId },
      });

      if (!task) {
        throw new NotFoundException(
          'Task not found or you are not assigned to this task',
        );
      }

      if (task.status !== TaskStatus.IN_PROGRESS) {
        throw new BadRequestException('Task is not in progress');
      }

      await this.taskRepository.update(id, {
        status: TaskStatus.PENDING_APPROVAL,
      });

      await this.offerRepository.update(
        {
          task_id: id,
          provider_id: providerId,
        },
        {
          status: OfferStatus.PENDING_COMPLETION_APPROVAL,
        },
      );

      const updatedTask = await this.taskRepository.findOne({ where: { id } });
      this.logger.log(`Task ${id} submitted for completion approval`);
      return this.transformToTaskResponseDto(updatedTask);
    } catch (error) {
      this.logger.error(`Error completing task: ${error.message}`);
      throw error;
    }
  }

  async approveOrRejectTask(
    id: string,
    userId: string,
    isApproved: boolean,
    description: string,
  ): Promise<{
    task: TaskResponseDto;
    feedback: TaskCompletionFeedbackResponseDto;
  }> {
    try {
      this.logger.log(
        `User ${userId} ${isApproved ? 'accepting' : 'rejecting'} completion of task ${id}`,
      );

      const task = await this.taskRepository.findOne({
        where: { id, user_id: userId },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      if (task.status !== TaskStatus.PENDING_APPROVAL) {
        throw new BadRequestException('Task is not pending approval');
      }

      const newTaskStatus = isApproved
        ? TaskStatus.COMPLETED
        : TaskStatus.IN_PROGRESS;
      const newOfferStatus = isApproved
        ? OfferStatus.COMPLETION_ACCEPTED
        : OfferStatus.COMPLETION_REJECTED;

      await this.taskRepository.update(id, {
        status: newTaskStatus,
        completion_feedback: description,
        completion_feedback_date: new Date(),
      });

      await this.offerRepository.update(
        {
          task_id: id,
          status: OfferStatus.PENDING_COMPLETION_APPROVAL,
        },
        {
          status: newOfferStatus,
        },
      );

      const feedback = this.taskCompletionFeedbackRepository.create({
        task_id: id,
        user_id: userId,
        action_type: isApproved ? 'accepted' : 'rejected',
        description: description,
      });
      const savedFeedback =
        await this.taskCompletionFeedbackRepository.save(feedback);

      const updatedTask = await this.taskRepository.findOne({ where: { id } });
      this.logger.log(
        `Task ${id} completion ${isApproved ? 'accepted' : 'rejected'} successfully`,
      );

      return {
        task: this.transformToTaskResponseDto(updatedTask),
        feedback:
          this.transformToTaskCompletionFeedbackResponseDto(savedFeedback),
      };
    } catch (error) {
      this.logger.error(
        `Error ${isApproved ? 'accepting' : 'rejecting'} task completion: ${error.message}`,
      );
      throw error;
    }
  }

  async getTaskProgressList(
    id: string,
    userId: string,
    userType: string,
  ): Promise<TaskProgressResponseDto[]> {
    try {
      this.logger.log(
        `Getting progress list for task ${id} by ${userType} ${userId}`,
      );

      let queryBuilder = this.taskRepository
        .createQueryBuilder('task')
        .where('task.id = :id', { id });

      if (userType === 'user') {
        queryBuilder = queryBuilder.andWhere('task.user_id = :userId', {
          userId,
        });
      } else if (userType === 'provider') {
        queryBuilder = queryBuilder.andWhere(
          'task.accepted_provider_id = :providerId',
          { providerId: userId },
        );
      }

      const task = await queryBuilder.getOne();

      if (!task) {
        throw new NotFoundException('Task not found or access denied');
      }

      const progressUpdates = await this.taskProgressRepository.find({
        where: { task_id: id },
        order: { created_at: 'DESC' },
      });

      this.logger.log(
        `Retrieved ${progressUpdates.length} progress entries for task ${id}`,
      );
      return progressUpdates.map((progress) =>
        this.transformToTaskProgressResponseDto(progress),
      );
    } catch (error) {
      this.logger.error(`Error getting task progress list: ${error.message}`);
      throw error;
    }
  }

  async getTasksByStatus(
    userId: string,
    userType: string,
    status: string,
  ): Promise<TaskResponseDto[]> {
    try {
      this.logger.log(
        `Getting tasks with status ${status} for ${userType} ${userId}`,
      );

      let queryBuilder = this.taskRepository
        .createQueryBuilder('task')
        .where('task.status = :status', { status });

      if (userType === 'user') {
        queryBuilder = queryBuilder.andWhere('task.user_id = :userId', {
          userId,
        });
      } else if (userType === 'provider') {
        queryBuilder = queryBuilder.andWhere(
          'task.accepted_provider_id = :providerId',
          { providerId: userId },
        );
      }

      const tasks = await queryBuilder
        .orderBy('task.created_at', 'DESC')
        .getMany();

      this.logger.log(
        `Retrieved ${tasks.length} tasks with status ${status} for ${userType} ${userId}`,
      );

      const transformedTasks = tasks.map((task) =>
        this.transformToTaskResponseDto(task),
      );
      return transformedTasks;
    } catch (error) {
      this.logger.error(`Error getting tasks by status: ${error.message}`);
      throw error;
    }
  }

  async getOpenTasks(filters: any): Promise<{
    tasks: TaskResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      this.logger.log('Getting open tasks for providers');

      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const skip = (page - 1) * limit;

      let queryBuilder = this.taskRepository
        .createQueryBuilder('task')
        .where('task.status = :status', { status: TaskStatus.OPEN });

      if (filters.category) {
        queryBuilder = queryBuilder.andWhere('task.category = :category', {
          category: filters.category,
        });
      }

      if (filters.search) {
        queryBuilder = queryBuilder.andWhere(
          '(task.task_name ILIKE :search OR task.description ILIKE :search)',
          { search: `%${filters.search}%` },
        );
      }

      if (filters.min_rate) {
        queryBuilder = queryBuilder.andWhere('task.hourly_rate >= :minRate', {
          minRate: filters.min_rate,
        });
      }

      if (filters.max_rate) {
        queryBuilder = queryBuilder.andWhere('task.hourly_rate <= :maxRate', {
          maxRate: filters.max_rate,
        });
      }

      const [tasks, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('task.created_at', 'DESC')
        .getManyAndCount();

      const totalPages = Math.ceil(total / limit);

      this.logger.log(`Retrieved ${tasks.length} open tasks`);

      const transformedTasks = tasks.map((task) =>
        this.transformToTaskResponseDto(task),
      );

      return {
        tasks: transformedTasks,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error(`Error getting open tasks: ${error.message}`);
      throw error;
    }
  }
}
