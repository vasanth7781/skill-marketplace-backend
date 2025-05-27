import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferController } from '../controllers/offer.controller';
import { OfferService } from '../services/offer.service';
import { Offer } from '../entities/offer.entity';
import { Task } from '../entities/task.entity';
import { Provider } from '../entities/provider.entity';
import { User } from '../entities/user.entity';
import { TaskCompletionFeedback } from '../entities/task-completion-feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Offer,
      Task,
      TaskCompletionFeedback,
      Provider,
      User,
    ]),
  ],
  controllers: [OfferController],
  providers: [OfferService],
  exports: [OfferService],
})
export class OfferModule {}
