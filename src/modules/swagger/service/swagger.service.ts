import { Injectable } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

@Injectable()
export class SwaggerService {
  private swaggerDocument: OpenAPIObject | null = null;

  generateSwaggerJson(app: INestApplication): OpenAPIObject {
    if (!this.swaggerDocument) {
      const config = new DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('API description and documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

      this.swaggerDocument = SwaggerModule.createDocument(app, config);
    }
    return this.swaggerDocument;
  }

  getSwaggerJson(): OpenAPIObject {
    if (!this.swaggerDocument) {
      throw new Error(
        'Swagger JSON is not generated yet. Please initialize it.',
      );
    }
    return this.swaggerDocument;
  }
}
