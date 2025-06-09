import { Module } from '@nestjs/common';
import { BinanceModule } from 'src/binance/binance.module';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';

@Module({
  imports: [BinanceModule],
  controllers: [TradesController],
  providers: [TradesService],
})
export class TradesModule {}
