import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealthStatus() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
    };
  }
}
