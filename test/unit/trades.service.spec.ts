import { BinanceService } from '../../src/binance/binance.service';
import { TradesService } from '../../src/trades/trades.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { KlineDto } from '../../src/dto/kline.dto';
import { PriceChange } from '../../src/const/price-change.enum';

describe('Trades Service', () => {
  describe('analyseTrades', () => {
    let httpServiceMock: HttpService;
    let binanceService: BinanceService;
    let tradesService: TradesService;

    beforeEach(() => {
      jest.clearAllMocks();

      httpServiceMock = {
        axiosRef: {
          get: jest.fn(),
        },
      } as unknown as HttpService;
      const configServiceMock = {
        getOrThrow: jest.fn().mockReturnValue('test'),
      } as unknown as ConfigService;
      binanceService = new BinanceService(httpServiceMock, configServiceMock);
      tradesService = new TradesService(binanceService, configServiceMock);
    });

    it('should mark first kline as equal price change', async () => {
      const testKlines: KlineDto[] = [
        { openTime: 10, openPrice: 5, volume: 1 },
        { openTime: 15, openPrice: 10, volume: 1 },
        { openTime: 20, openPrice: 2, volume: 1 },
        { openTime: 20, openPrice: 2, volume: 1 },
      ];

      jest
        .spyOn(binanceService, 'fetchHistoricalTrades')
        .mockResolvedValue(testKlines);

      const analysis = await tradesService.anaylseTrades();

      expect(analysis[0].priceChange).toBe(PriceChange.EQUAL);
    });

    it('should correctly mark price changes', async () => {
      const testKlines: KlineDto[] = [
        { openTime: 10, openPrice: 5, volume: 1 },
        { openTime: 15, openPrice: 10, volume: 1 },
        { openTime: 20, openPrice: 2, volume: 1 },
        { openTime: 20, openPrice: 2, volume: 1 },
      ];

      jest
        .spyOn(binanceService, 'fetchHistoricalTrades')
        .mockResolvedValue(testKlines);

      const analysis = await tradesService.anaylseTrades();

      expect(analysis[1].priceChange).toBe(PriceChange.UP);
      expect(analysis[2].priceChange).toBe(PriceChange.DOWN);
      expect(analysis[3].priceChange).toBe(PriceChange.EQUAL);
    });
  });
});
