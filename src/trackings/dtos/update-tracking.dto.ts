import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateTrackingDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;
}