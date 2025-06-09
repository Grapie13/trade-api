import { KlineDto } from 'src/dto/kline.dto';

export class KlineSerializer {
  public static serializeKlines(data: (string | number)[][]) {
    const serialized: KlineDto[] = [];

    for (const entry of data) {
      // Casts here are safe, as these are values documented in Binance's API
      const kline: KlineDto = {
        openTime: entry[0] as number,
        openPrice: parseFloat(entry[1] as string),
        volume: parseFloat(entry[5] as string),
      };

      serialized.push(kline);
    }

    return serialized;
  }
}
