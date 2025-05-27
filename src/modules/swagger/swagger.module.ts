import { Module } from '@nestjs/common';
import { SwaggerController } from './controller/swagger.controller';
import { SwaggerService } from './service/swagger.service';

@Module({
  controllers: [SwaggerController],
  providers: [SwaggerService],
  exports: [SwaggerService],
})
export class InternalSwaggerModule {}
