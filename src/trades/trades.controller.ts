import { Controller, Get } from '@nestjs/common';
import { TradesService } from './trades.service';

@Controller('trades')
export class TradesController {
  public constructor(private readonly tradesService: TradesService) {}

  @Get('/')
  public async analyseTrades() {
    return this.tradesService.anaylseTrades();
  }
}
