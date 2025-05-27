import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternalSwaggerModule } from './modules/swagger/swagger.module';
import initEnvironmentNest from './configs/env.config';
import { SwaggerService } from './modules/swagger/service/swagger.service';
import { NestFactory } from '@nestjs/core';
import { HealthModule } from './modules/health/health.module';
import { databaseConfig } from './configs/database.config';
import { AuthModule } from './modules/auth.module';
import { TaskModule } from './modules/task.module';
import { SkillModule } from './modules/skill.module';
import { OfferModule } from './modules/offer.module';

@Module({
  imports: [
    initEnvironmentNest(),
    TypeOrmModule.forRoot(databaseConfig),
    InternalSwaggerModule,
    HealthModule,
    AuthModule,
    TaskModule,
    SkillModule,
    OfferModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly swaggerService: SwaggerService) {}

  async onModuleInit() {
    const app = await NestFactory.create(AppModule);
    this.swaggerService.generateSwaggerJson(app);
    await app.close();
  }
}