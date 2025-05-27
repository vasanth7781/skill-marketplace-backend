import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Provider } from '../entities/provider.entity';
import { Task } from '../entities/task.entity';
import { Skill } from '../entities/skill.entity';
import { Offer } from '../entities/offer.entity';
import { TaskProgress } from '../entities/task-progress.entity';
import { TaskCompletionFeedback } from '../entities/task-completion-feedback.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    Provider,
    Task,
    Skill,
    Offer,
    TaskProgress,
    TaskCompletionFeedback,
  ],
  synchronize: true,
  logging: process.env.NODE_ENV === 'dev',
};
