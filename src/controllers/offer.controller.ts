import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { OfferService } from '../services/offer.service';
import {
  CreateOfferDto,
  UpdateOfferDto,
  OfferResponseDto,
} from '../dto/offer.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RespondToOfferDto } from '../dto/respond-to-offer.dto';

@ApiTags('Offers')
@Controller('offers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OfferController {
  private readonly logger = new Logger(OfferController.name);

  constructor(private readonly offerService: OfferService) {}

  @Post()
  @Roles('provider')
  @ApiOperation({ summary: 'Create a new offer for a task' })
  @ApiBody({
    type: CreateOfferDto,
    examples: {
      webDevelopment: {
        summary: 'Web Development Offer',
        value: {
          task_id: 'uuid-string',
          proposed_rate: 50.0,
          rate_currency: 'USD',
          estimated_hours: 40,
          cover_letter: 'I am experienced in React and Node.js development...',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Offer created successfully',
    type: OfferResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Task not open or provider already has an offer',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Request() req,
  ): Promise<OfferResponseDto> {
    try {
      this.logger.log(
        `Provider ${req.user.userId} creating offer for task ${createOfferDto.task_id}`,
      );
      const result = await this.offerService.createOffer(
        createOfferDto,
        req.user.userId,
      );
      this.logger.log(
        `Offer created successfully for task ${createOfferDto.task_id}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Error creating offer: ${error.message}`);
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get offers for the authenticated user with completion feedback',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by offer status',
    enum: [
      'pending',
      'accepted',
      'rejected',
      'withdrawn',
      'counter_offered',
      'pending_completion_approval',
      'completion_accepted',
      'completion_rejected',
    ],
    example: 'pending_completion_approval',
  })
  @ApiResponse({
    status: 200,
    description:
      'Offers retrieved successfully with completion feedback information',
    schema: {
      type: 'object',
      properties: {
        result: {
          type: 'array',
          items: { $ref: '#/components/schemas/OfferResponseDto' },
        },
      },
    },
  })
  async getOffers(@Query() query: any, @Request() req) {
    try {
      this.logger.log(
        `Getting offers for ${req.user.userType} ${req.user.userId}`,
      );
      const result = await this.offerService.getOffers(
        req.user.userId,
        req.user.userType,
        query,
      );
      this.logger.log(
        `Retrieved ${result.length} offers for ${req.user.userType} ${req.user.userId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Error getting offers: ${error.message}`);
      throw error;
    }
  }

  @Get('status/:status')
  @ApiOperation({
    summary: 'Get offers by specific status with completion feedback',
  })
  @ApiParam({
    name: 'status',
    description: 'Offer status to filter by',
    enum: [
      'pending',
      'accepted',
      'rejected',
      'withdrawn',
      'counter_offered',
      'pending_completion_approval',
      'completion_accepted',
      'completion_rejected',
    ],
    example: 'pending_completion_approval',
  })
  @ApiResponse({
    status: 200,
    description: 'Offers retrieved successfully by status',
    type: [OfferResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No offers found with the specified status',
  })
  async getOffersByStatus(
    @Param('status') status: string,
    @Request() req,
  ): Promise<OfferResponseDto[]> {
    try {
      this.logger.log(
        `Getting offers with status ${status} for ${req.user.userType} ${req.user.userId}`,
      );
      const result = await this.offerService.getOffersByStatus(
        req.user.userId,
        req.user.userType,
        status,
      );
      this.logger.log(
        `Retrieved ${result.length} offers with status ${status}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Error getting offers by status: ${error.message}`);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific offer by ID with completion feedback',
  })
  @ApiParam({ name: 'id', description: 'Offer ID', example: 'uuid-string' })
  @ApiResponse({
    status: 200,
    description: 'Offer retrieved successfully with completion feedback',
    type: OfferResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Offer not found',
  })
  async getOfferById(
    @Param('id') id: string,
    @Request() req,
  ): Promise<OfferResponseDto> {
    try {
      this.logger.log(
        `Getting offer ${id} for ${req.user.userType} ${req.user.userId}`,
      );
      const result = await this.offerService.getOfferById(
        id,
        req.user.userId,
        req.user.userType,
      );
      this.logger.log(`Retrieved offer ${id} successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Error getting offer by ID: ${error.message}`);
      throw error;
    }
  }

  @Patch(':id')
  @Roles('provider')
  @ApiOperation({ summary: 'Update an offer' })
  @ApiParam({ name: 'id', description: 'Offer ID', example: 'uuid-string' })
  @ApiBody({ type: UpdateOfferDto })
  @ApiResponse({
    status: 200,
    description: 'Offer updated successfully',
    type: OfferResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Offer cannot be updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Offer not found',
  })
  async updateOffer(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
    @Request() req,
  ): Promise<OfferResponseDto> {
    try {
      this.logger.log(`Provider ${req.user.userId} updating offer ${id}`);
      const result = await this.offerService.updateOffer(
        id,
        updateOfferDto,
        req.user.userId,
      );
      this.logger.log(`Offer ${id} updated successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Error updating offer: ${error.message}`);
      throw error;
    }
  }

  @Delete(':id')
  @Roles('provider')
  @ApiOperation({ summary: 'Withdraw an offer' })
  @ApiParam({ name: 'id', description: 'Offer ID', example: 'uuid-string' })
  @ApiResponse({
    status: 200,
    description: 'Offer withdrawn successfully',
    type: OfferResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Offer cannot be withdrawn',
  })
  @ApiResponse({
    status: 404,
    description: 'Offer not found',
  })
  async withdrawOffer(
    @Param('id') id: string,
    @Request() req,
  ): Promise<OfferResponseDto> {
    try {
      this.logger.log(`Provider ${req.user.userId} withdrawing offer ${id}`);
      const result = await this.offerService.withdrawOffer(id, req.user.userId);
      this.logger.log(`Offer ${id} withdrawn successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Error withdrawing offer: ${error.message}`);
      throw error;
    }
  }

  @Patch(':id/respond')
  @Roles('user')
  @ApiOperation({ summary: 'Respond to an offer (accept/reject)' })
  @ApiParam({ name: 'id', description: 'Offer ID', example: 'uuid-string' })
  @ApiBody({
    type: RespondToOfferDto,
    examples: {
      accept: {
        summary: 'Accept offer',
        value: {
          response: 'accept',
        },
      },
      reject: {
        summary: 'Reject offer',
        value: {
          response: 'reject',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Response recorded successfully',
    type: OfferResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Offer already responded to or not authorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Offer not found',
  })
  async respondToOffer(
    @Param('id') id: string,
    @Body() respondDto: RespondToOfferDto,
    @Request() req,
  ): Promise<OfferResponseDto> {
    try {
      this.logger.log(
        `User ${req.user.userId} responding to offer ${id} with action: ${respondDto.response}`,
      );
      const result = await this.offerService.respondToOffer(
        id,
        respondDto,
        req.user.userId,
      );
      this.logger.log(`Offer ${id} ${respondDto.response}d successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Error responding to offer: ${error.message}`);
      throw error;
    }
  }
}
