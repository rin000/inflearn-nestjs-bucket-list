import { IsNotEmpty, IsString } from 'class-validator';

export class createBucketListDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
