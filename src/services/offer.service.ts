import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Offer } from '../entities/offer.entity';
import { Task } from '../entities/task.entity';
import { TaskCompletionFeedback } from '../entities/task-completion-feedback.entity';
import {
  CreateOfferDto,
  UpdateOfferDto,
  OfferResponseDto,
} from '../dto/offer.dto';
import { OfferStatus } from '../enums/offer-status.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { RespondToOfferDto } from '../dto/respond-to-offer.dto';

@Injectable()
export class OfferService {
  private readonly logger = new Logger(OfferService.name);

  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskCompletionFeedback)
    private taskCompletionFeedbackRepository: Repository<TaskCompletionFeedback>,
  ) {}

  private transformToOfferResponseDto(
    offer: Offer,
    includeTaskDetails: boolean = false,
    taskDetailsMap?: Map<string, any>,
  ): OfferResponseDto {
    const response: OfferResponseDto = {
      id: offer.id,
      provider_id: offer.provider_id,
      task_id: offer.task_id,
      proposed_rate: offer.proposed_rate,
      rate_currency: offer.rate_currency || 'USD',
      estimated_hours: offer.estimated_hours || 0,
      cover_letter: offer.cover_letter || '',
      message: offer.message,
      status: offer.status,
      created_at: offer.created_at.toISOString(),
      updated_at: offer.updated_at.toISOString(),
    };

    if (includeTaskDetails && taskDetailsMap) {
      const taskDetails = taskDetailsMap.get(offer.task_id);
      if (taskDetails) {
        response.task_name = taskDetails.task_name;
        response.task_description = taskDetails.description;
        response.task_status = taskDetails.status;
        response.completion_feedback = taskDetails.completion_feedback;
        response.completion_feedback_date =
          taskDetails.completion_feedback_date?.toISOString();
        response.latest_feedback_action = taskDetails.latest_feedback_action;
      }
    }

    return response;
  }

  private async getTaskDetailsForOffers(
    offers: Offer[],
  ): Promise<Map<string, any>> {
    if (offers.length === 0) return new Map();

    const taskIds = [...new Set(offers.map((offer) => offer.task_id))];

    const tasks = await this.taskRepository.find({
      where: { id: In(taskIds) },
    });

    const latestFeedbacks = await this.taskCompletionFeedbackRepository
      .createQueryBuilder('feedback')
      .select([
        'feedback.task_id',
        'feedback.action_type',
        'ROW_NUMBER() OVER (PARTITION BY feedback.task_id ORDER BY feedback.created_at DESC) as rn',
      ])
      .where('feedback.task_id IN (:...taskIds)', { taskIds })
      .getRawMany();

    const latestFeedbackMap = new Map();
    latestFeedbacks
      .filter((feedback) => feedback.rn === 1)
      .forEach((feedback) => {
        latestFeedbackMap.set(
          feedback.feedback_task_id,
          feedback.feedback_action_type,
        );
      });

    const taskDetailsMap = new Map();
    tasks.forEach((task) => {
      taskDetailsMap.set(task.id, {
        task_name: task.task_name,
        description: task.description,
        status: task.status,
        completion_feedback: task.completion_feedback,
        completion_feedback_date: task.completion_feedback_date,
        latest_feedback_action: latestFeedbackMap.get(task.id),
      });
    });

    return taskDetailsMap;
  }

  async createOffer(
    createOfferDto: CreateOfferDto,
    providerId: string,
  ): Promise<OfferResponseDto> {
    try {
      this.logger.log(
        `Creating offer for provider ${providerId} on task ${createOfferDto.task_id}`,
      );

      const task = await this.taskRepository.findOne({
        where: { id: createOfferDto.task_id },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      if (task.status !== TaskStatus.OPEN) {
        throw new BadRequestException('Task is not open for offers');
      }

      const existingOffer = await this.offerRepository.findOne({
        where: {
          provider_id: providerId,
          task_id: createOfferDto.task_id,
        },
      });

      if (existingOffer) {
        throw new BadRequestException(
          'You have already made an offer for this task',
        );
      }

      const offerData = {
        provider_id: providerId,
        task_id: createOfferDto.task_id,
        proposed_rate: createOfferDto.proposed_rate,
        rate_currency: createOfferDto.rate_currency,
        estimated_hours: createOfferDto.estimated_hours,
        message: createOfferDto.message,
        cover_letter: createOfferDto.cover_letter,
        status: OfferStatus.PENDING,
      };

      const offer = this.offerRepository.create(offerData);
      const savedOffer = await this.offerRepository.save(offer);

      this.logger.log(`Offer created successfully with ID: ${savedOffer.id}`);
      return this.transformToOfferResponseDto(savedOffer);
    } catch (error) {
      this.logger.error(`Error creating offer: ${error.message}`);
      throw error;
    }
  }

  async getOffers(
    userId: string,
    userType: string,
    filters: any,
  ): Promise<OfferResponseDto[]> {
    try {
      this.logger.log(`Getting offers for ${userType} ${userId}`);

      let queryBuilder = this.offerRepository
        .createQueryBuilder('offer')
        .leftJoinAndSelect('offer.task', 'task');

      if (userType === 'provider') {
        queryBuilder = queryBuilder.where('offer.provider_id = :providerId', {
          providerId: userId,
        });
      } else if (userType === 'user') {
        queryBuilder = queryBuilder.where('task.user_id = :userId', { userId });
      }

      if (filters.status) {
        queryBuilder = queryBuilder.andWhere('offer.status = :status', {
          status: filters.status,
        });
      }

      if (filters.task_id) {
        queryBuilder = queryBuilder.andWhere('offer.task_id = :taskId', {
          taskId: filters.task_id,
        });
      }

      const offers = await queryBuilder
        .orderBy('offer.created_at', 'DESC')
        .getMany();

      this.logger.log(
        `Retrieved ${offers.length} offers for ${userType} ${userId}`,
      );

      const taskDetailsMap = await this.getTaskDetailsForOffers(offers);

      const transformedOffers = offers.map((offer) =>
        this.transformToOfferResponseDto(offer, true, taskDetailsMap),
      );

      return transformedOffers;
    } catch (error) {
      this.logger.error(`Error getting offers: ${error.message}`);
      throw error;
    }
  }

  async getOfferById(
    id: string,
    userId: string,
    userType: string,
  ): Promise<OfferResponseDto> {
    try {
      this.logger.log(`Getting offer ${id} for ${userType} ${userId}`);

      let queryBuilder = this.offerRepository
        .createQueryBuilder('offer')
        .leftJoinAndSelect('offer.task', 'task')
        .where('offer.id = :id', { id });

      if (userType === 'provider') {
        queryBuilder = queryBuilder.andWhere(
          'offer.provider_id = :providerId',
          { providerId: userId },
        );
      } else if (userType === 'user') {
        queryBuilder = queryBuilder.andWhere('task.user_id = :userId', {
          userId,
        });
      }

      const offer = await queryBuilder.getOne();

      if (!offer) {
        throw new NotFoundException('Offer not found');
      }

      this.logger.log(`Retrieved offer ${id} successfully`);

      const taskDetailsMap = await this.getTaskDetailsForOffers([offer]);
      return this.transformToOfferResponseDto(offer, true, taskDetailsMap);
    } catch (error) {
      this.logger.error(`Error getting offer by ID: ${error.message}`);
      throw error;
    }
  }

  async updateOffer(
    id: string,
    updateOfferDto: UpdateOfferDto,
    providerId: string,
  ): Promise<OfferResponseDto> {
    try {
      this.logger.log(`Updating offer ${id} for provider ${providerId}`);

      const offer = await this.offerRepository.findOne({
        where: { id, provider_id: providerId },
      });

      if (!offer) {
        throw new NotFoundException('Offer not found');
      }

      if (offer.status !== OfferStatus.PENDING) {
        throw new BadRequestException(
          'Cannot update offer that is not pending',
        );
      }

      await this.offerRepository.update(id, updateOfferDto);
      const updatedOffer = await this.offerRepository.findOne({
        where: { id },
      });

      this.logger.log(`Offer ${id} updated successfully`);
      return this.transformToOfferResponseDto(updatedOffer);
    } catch (error) {
      this.logger.error(`Error updating offer: ${error.message}`);
      throw error;
    }
  }

  async withdrawOffer(
    id: string,
    providerId: string,
  ): Promise<OfferResponseDto> {
    try {
      this.logger.log(`Withdrawing offer ${id} for provider ${providerId}`);

      const offer = await this.offerRepository.findOne({
        where: { id, provider_id: providerId },
      });

      if (!offer) {
        throw new NotFoundException('Offer not found');
      }

      if (offer.status !== OfferStatus.PENDING) {
        throw new BadRequestException(
          'Cannot withdraw offer that is not pending',
        );
      }

      await this.offerRepository.update(id, { status: OfferStatus.WITHDRAWN });
      const updatedOffer = await this.offerRepository.findOne({
        where: { id },
      });

      this.logger.log(`Offer ${id} withdrawn successfully`);
      return this.transformToOfferResponseDto(updatedOffer);
    } catch (error) {
      this.logger.error(`Error withdrawing offer: ${error.message}`);
      throw error;
    }
  }

  async respondToOffer(
    id: string,
    respondDto: RespondToOfferDto,
    userId: string,
  ): Promise<OfferResponseDto> {
    try {
      this.logger.log(
        `User ${userId} responding to offer ${id} with action: ${respondDto.response}`,
      );

      const offer = await this.offerRepository.findOne({
        where: { id },
        relations: ['task'],
      });

      if (!offer) {
        throw new NotFoundException('Offer not found');
      }

      if (offer.task.user_id !== userId) {
        throw new BadRequestException('You do not own this task');
      }

      if (offer.status !== OfferStatus.PENDING) {
        throw new BadRequestException('Offer is not pending');
      }

      if (offer.task.status !== TaskStatus.OPEN) {
        throw new BadRequestException('Task is not open');
      }

      if (respondDto.response === 'accept') {
        await this.offerRepository.update(id, { status: OfferStatus.ACCEPTED });

        await this.taskRepository.update(offer.task_id, {
          status: TaskStatus.IN_PROGRESS,
          accepted_provider_id: offer.provider_id,
        });

        await this.offerRepository.update(
          {
            task_id: offer.task_id,
            status: OfferStatus.PENDING,
            id: Not(id),
          },
          { status: OfferStatus.REJECTED },
        );
      } else if (respondDto.response === 'reject') {
        await this.offerRepository.update(id, { status: OfferStatus.REJECTED });
      }

      const updatedOffer = await this.offerRepository.findOne({
        where: { id },
      });

      this.logger.log(`Offer ${id} ${respondDto.response}ed successfully`);

      const taskDetailsMap = await this.getTaskDetailsForOffers([updatedOffer]);
      return this.transformToOfferResponseDto(
        updatedOffer,
        true,
        taskDetailsMap,
      );
    } catch (error) {
      this.logger.error(`Error responding to offer: ${error.message}`);
      throw error;
    }
  }

  async getOffersByStatus(
    userId: string,
    userType: string,
    status: string,
  ): Promise<OfferResponseDto[]> {
    try {
      this.logger.log(
        `Getting offers with status ${status} for ${userType} ${userId}`,
      );

      let queryBuilder = this.offerRepository
        .createQueryBuilder('offer')
        .leftJoinAndSelect('offer.task', 'task')
        .where('offer.status = :status', { status });

      if (userType === 'provider') {
        queryBuilder = queryBuilder.andWhere(
          'offer.provider_id = :providerId',
          { providerId: userId },
        );
      } else if (userType === 'user') {
        queryBuilder = queryBuilder.andWhere('task.user_id = :userId', {
          userId,
        });
      }

      const offers = await queryBuilder
        .orderBy('offer.created_at', 'DESC')
        .getMany();

      this.logger.log(
        `Retrieved ${offers.length} offers with status ${status} for ${userType} ${userId}`,
      );

      const taskDetailsMap = await this.getTaskDetailsForOffers(offers);

      const transformedOffers = offers.map((offer) =>
        this.transformToOfferResponseDto(offer, true, taskDetailsMap),
      );

      return transformedOffers;
    } catch (error) {
      this.logger.error(`Error getting offers by status: ${error.message}`);
      throw error;
    }
  }
}
