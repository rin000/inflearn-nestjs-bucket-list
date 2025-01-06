import { Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DailyScheduleService {
  constructor(private readonly usersService: UsersService) {}

  // @Interval(1000 * 10)
  @Cron('0 0 9 * * *')
  async trackUserCountEvery9AM() {
    const userCount = await this.usersService.countAll();

    console.log(
      `[${new Date().toLocaleDateString()}] 오늘의 유저 수는 ${userCount}명 입니다.`,
    );
  }
}
