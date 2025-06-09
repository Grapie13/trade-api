// Disabling this rule for tests
import { HttpService } from '@nestjs/axios';
import { BinanceService } from '../../src/binance/binance.service';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';

describe('Binance Service', () => {
  describe('fetchHistoricalTrades', () => {
    let httpServiceMock: HttpService;
    let binanceService: BinanceService;

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
    });

    it('should throw an HTTP error when API request fails', async () => {
      jest.spyOn(httpServiceMock.axiosRef, 'get').mockRejectedValue({
        isAxiosError: true,
        status: 500,
        message: 'Test',
      });

      try {
        await binanceService.fetchHistoricalTrades('BTCUSDT');
        expect('Should have thrown').toBe(false);
      } catch (err) {
        expect(err instanceof InternalServerErrorException).toBe(true);
      }
    });

    it('should serialize klines', async () => {
      const openTime = 1499040000000;
      const openPrice = '0.01634790';
      const volume = '148976.11427815';
      const klineMock = [
        [
          openTime, // Kline open time
          openPrice, // Open price
          '0.80000000', // High price
          '0.01575800', // Low price
          '0.01577100', // Close price
          volume, // Volume
          1499644799999, // Kline Close time
          '2434.19055334', // Quote asset volume
          308, // Number of trades
          '1756.87402397', // Taker buy base asset volume
          '28.46694368', // Taker buy quote asset volume
          '0', // Unused field, ignore.
        ],
      ];

      jest.spyOn(httpServiceMock.axiosRef, 'get').mockResolvedValue({
        data: klineMock,
      });

      const response = await binanceService.fetchHistoricalTrades('BTCUSDT');
      console.log(response);
      const kline = response[0];

      expect(kline.openTime).toBe(openTime);
      expect(kline.openPrice).toBe(parseFloat(openPrice));
      expect(kline.volume).toBe(parseFloat(volume));
    });
  });
});
