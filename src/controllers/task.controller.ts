import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Logger,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { TaskService } from '../services/task.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskProgressDto,
  TaskResponseDto,
  TaskProgressResponseDto,
  AcceptTaskCompletionDto,
  RejectTaskCompletionDto,
  TaskCompletionFeedbackResponseDto,
} from '../dto/task.dto';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles('user')
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    try {
      this.logger.log(`Creating task for user ${req.user.userId}`);
      const task = await this.taskService.createTask(
        createTaskDto,
        req.user.userId,
      );
      this.logger.log(`Task created successfully with ID: ${task.id}`);
      return task;
    } catch (error) {
      this.logger.error(`Error creating task: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get tasks with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        tasks: {
          type: 'array',
          items: { $ref: '#/components/schemas/TaskResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTasks(@Request() req, @Query() query) {
    try {
      this.logger.log(`Getting tasks for user ${req.user.userId}`);
      const result = await this.taskService.getTasks(
        req.user.userId,
        req.user.userType,
        { status: query?.status },
      );
      this.logger.log(
        `Retrieved ${result.length} tasks for user ${req.user.userId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Error getting tasks: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTaskById(@Param('id') id: string, @Request() req) {
    try {
      this.logger.log(`Getting task ${id} for user ${req.user.userId}`);
      const task = await this.taskService.getTaskById(
        id,
        req.user.userId,
        req.user.userType,
      );
      this.logger.log(`Task ${id} retrieved successfully`);
      return task;
    } catch (error) {
      this.logger.error(
        `Error getting task by ID: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Patch(':id')
  @Roles('user')
  @ApiOperation({ summary: 'Update task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    try {
      this.logger.log(`Updating task ${id} for user ${req.user.userId}`);
      const task = await this.taskService.updateTask(
        id,
        updateTaskDto,
        req.user.userId,
      );
      this.logger.log(`Task ${id} updated successfully`);
      return task;
    } catch (error) {
      this.logger.error(`Error updating task: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @Roles('user')
  @ApiOperation({ summary: 'Delete task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id') id: string, @Request() req) {
    try {
      this.logger.log(`Deleting task ${id} for user ${req.user.userId}`);
      await this.taskService.deleteTask(id, req.user.userId);
      this.logger.log(`Task ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Error deleting task: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post(':id/progress')
  @Roles('provider')
  @ApiOperation({ summary: 'Update task progress' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ type: UpdateTaskProgressDto })
  @ApiResponse({
    status: 201,
    description: 'Task progress updated successfully',
    type: TaskProgressResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.CREATED)
  async updateTaskProgress(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateTaskProgressDto,
    @Request() req,
  ) {
    try {
      this.logger.log(
        `Updating progress for task ${id} by provider ${req.user.userId}`,
      );
      const progress = await this.taskService.updateTaskProgress(
        id,
        updateProgressDto,
        req.user.userId,
      );
      this.logger.log(`Progress updated successfully for task ${id}`);
      return progress;
    } catch (error) {
      this.logger.error(
        `Error updating task progress: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post(':id/complete')
  @Roles('provider')
  @ApiOperation({ summary: 'Mark task as complete' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Task marked as complete successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async markTaskComplete(@Param('id') id: string, @Request() req) {
    try {
      this.logger.log(
        `Marking task ${id} as complete by provider ${req.user.userId}`,
      );
      const task = await this.taskService.submitTaskForApproval(
        id,
        req.user.userId,
      );
      this.logger.log(`Task ${id} marked as complete successfully`);
      return task;
    } catch (error) {
      this.logger.error(
        `Error marking task complete: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post(':id/accept')
  @Roles('user')
  @ApiOperation({ summary: 'Accept task completion with feedback' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ type: AcceptTaskCompletionDto })
  @ApiResponse({
    status: 200,
    description: 'Task completion accepted successfully',
    schema: {
      type: 'object',
      properties: {
        task: { $ref: '#/components/schemas/TaskResponseDto' },
        feedback: {
          $ref: '#/components/schemas/TaskCompletionFeedbackResponseDto',
        },
      },
      examples: {
        success: {
          summary: 'Successful acceptance',
          value: {
            task: {
              id: 'uuid-string',
              category: 'WEB_DEVELOPMENT',
              task_name: 'Build a web application',
              description: 'Develop a full-stack web application',
              status: 'COMPLETED',
              completion_feedback:
                'Excellent work! The task has been completed to my satisfaction.',
              completion_feedback_date: '2024-01-01T00:00:00.000Z',
            },
            feedback: {
              id: 'uuid-string',
              task_id: 'uuid-string',
              user_id: 'uuid-string',
              action_type: 'accepted',
              description:
                'Excellent work! The task has been completed to my satisfaction.',
              created_at: '2024-01-01T00:00:00.000Z',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async acceptTaskCompletion(
    @Param('id') id: string,
    @Body() acceptDto: AcceptTaskCompletionDto,
    @Request() req,
  ) {
    try {
      this.logger.log(
        `Accepting task completion for ${id} by user ${req.user.userId}`,
      );
      const result = await this.taskService.approveOrRejectTask(
        id,
        req.user.userId,
        true,
        acceptDto.description,
      );
      this.logger.log(`Task completion accepted for ${id}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error accepting task completion: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post(':id/reject')
  @Roles('user')
  @ApiOperation({ summary: 'Reject task completion with feedback' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ type: RejectTaskCompletionDto })
  @ApiResponse({
    status: 200,
    description: 'Task completion rejected successfully',
    schema: {
      type: 'object',
      properties: {
        task: { $ref: '#/components/schemas/TaskResponseDto' },
        feedback: {
          $ref: '#/components/schemas/TaskCompletionFeedbackResponseDto',
        },
      },
      examples: {
        success: {
          summary: 'Successful rejection',
          value: {
            task: {
              id: 'uuid-string',
              category: 'WEB_DEVELOPMENT',
              task_name: 'Build a web application',
              description: 'Develop a full-stack web application',
              status: 'IN_PROGRESS',
              completion_feedback:
                'The task needs some revisions. Please fix the responsive design issues.',
              completion_feedback_date: '2024-01-01T00:00:00.000Z',
            },
            feedback: {
              id: 'uuid-string',
              task_id: 'uuid-string',
              user_id: 'uuid-string',
              action_type: 'rejected',
              description:
                'The task needs some revisions. Please fix the responsive design issues.',
              created_at: '2024-01-01T00:00:00.000Z',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async rejectTaskCompletion(
    @Param('id') id: string,
    @Body() rejectDto: RejectTaskCompletionDto,
    @Request() req,
  ) {
    try {
      this.logger.log(
        `Rejecting task completion for ${id} by user ${req.user.userId}`,
      );
      const result = await this.taskService.approveOrRejectTask(
        id,
        req.user.userId,
        false,
        rejectDto.description,
      );
      this.logger.log(`Task completion rejected for ${id}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error rejecting task completion: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get(':id/progress')
  @ApiOperation({ summary: 'Get task progress' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Task progress retrieved successfully',
    type: [TaskProgressResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getTaskProgress(@Param('id') id: string, @Request() req) {
    try {
      this.logger.log(
        `Getting progress for task ${id} by user ${req.user.userId}`,
      );
      const progress = await this.taskService.getTaskProgressList(
        id,
        req.user.userId,
        req.user.userType,
      );
      this.logger.log(
        `Retrieved ${progress.length} progress entries for task ${id}`,
      );
      return progress;
    } catch (error) {
      this.logger.error(
        `Error getting task progress: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
