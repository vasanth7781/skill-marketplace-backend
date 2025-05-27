import { Controller, Get } from '@nestjs/common';
import { SwaggerService } from '../service/swagger.service';

@Controller('swagger')
export class SwaggerController {
  constructor(private readonly swaggerService: SwaggerService) {}

  @Get('json')
  getSwaggerJson() {
    return this.swaggerService.getSwaggerJson();
  }
}
