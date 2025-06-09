import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BinanceService } from '../binance/binance.service';

@Injectable()
export class TradesService {
  private symbol: string;

  public constructor(
    private readonly binanceService: BinanceService,
    configService: ConfigService,
  ) {
    this.symbol = configService.getOrThrow<string>('CURRENCY_SYMBOL');
  }

  public async anaylseTrades() {
    await this.binanceService.fetchHistoricalTrades(this.symbol);

    return [];
  }
}
