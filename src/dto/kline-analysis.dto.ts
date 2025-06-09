import { PriceChange } from '../const/price-change.enum';

export class KlineAnalysisDto {
  public openTime: number;
  public openPrice: number;
  public volume: number;
  public priceChange: PriceChange;
}
