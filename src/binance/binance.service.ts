import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';

@Injectable()
export class BinanceService {
  private readonly SEVEN_DAYS_MILLIS = 7 * 24 * 60 * 60 * 1000;
  private binanceBaseUrl: string;

  public constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.binanceBaseUrl = configService.getOrThrow<string>('BINANCE_API_URL');
  }

  /**
   * Retrieves price data for the last 7 days.
   */
  public async fetchHistoricalTrades(symbol: string) {
    try {
      const startTime = Date.now() - this.SEVEN_DAYS_MILLIS;

      const response = await this.httpService.axiosRef.get<
        (string | number)[][]
      >(
        `${this.binanceBaseUrl}/klines?symbol=${symbol}&interval=1d&startTime=${startTime}`,
      );

      console.log(response.data);
    } catch (err) {
      if (this.isAxiosError(err)) {
        if (err.status && err.status <= 500) {
          // Assuming proper logging is used when using console.log
          console.log(
            'Internal Server Exception encountered during Binance request',
            {
              message: err.message,
              status: err.status,
              response: err.response ?? null,
            },
          );
          throw new InternalServerErrorException();
        }
      }
    }
  }

  private isAxiosError(err: unknown): err is AxiosError {
    const axiosError = err as AxiosError;

    return axiosError?.isAxiosError;
  }
}
