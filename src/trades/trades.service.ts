import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BinanceService } from '../binance/binance.service';
import { KlineAnalysisDto } from 'src/dto/kline-analysis.dto';
import { PriceChange } from 'src/const/price-change.enum';

@Injectable()
export class TradesService {
  private symbol: string;

  public constructor(
    private readonly binanceService: BinanceService,
    configService: ConfigService,
  ) {
    this.symbol = configService.getOrThrow<string>('CURRENCY_SYMBOL');
  }

  public async anaylseTrades(): Promise<KlineAnalysisDto[]> {
    const klines = await this.binanceService.fetchHistoricalTrades(this.symbol);
    const analysedKlines: KlineAnalysisDto[] = [];

    for (let i = 0; i < klines.length; i++) {
      const kline = klines[i];
      let priceChange: PriceChange;

      if (i === 0) {
        priceChange = PriceChange.EQUAL;
      } else {
        const previousKline = klines[i - 1];

        if (kline.openPrice > previousKline.openPrice) {
          priceChange = PriceChange.UP;
        } else if (kline.openPrice < previousKline.openPrice) {
          priceChange = PriceChange.DOWN;
        } else {
          priceChange = PriceChange.EQUAL;
        }
      }

      analysedKlines.push({
        openPrice: kline.openPrice,
        openTime: kline.openTime,
        volume: kline.volume,
        priceChange,
      });
    }

    return analysedKlines;
  }
}
