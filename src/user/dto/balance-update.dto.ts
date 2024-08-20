import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class BalanceUpdateDto {
  @Type(() => Number)
  @IsInt()
  increment:number;
}