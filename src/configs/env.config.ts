import { DynamicModule } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';

const environment = process.env.NODE_ENV || 'dev';

dotenv.config({
  path: path.join(__dirname, '../..', `.env.${environment}`),
});

const initEnvironmentNest = (): DynamicModule => {
  return {
    module: ConfigModule,
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: `.env.${environment || 'dev'}`,
      }),
    ],
  };
};

export default initEnvironmentNest;
