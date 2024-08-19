import { IsInt } from 'class-validator';

export class BalanceUpdateDto {
  @IsInt()
  increment:number;
}