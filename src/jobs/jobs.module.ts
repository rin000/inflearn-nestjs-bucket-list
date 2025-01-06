import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { DailyScheduleService } from './daily-schedule.service';

@Module({
  imports: [UsersModule],
  providers: [DailyScheduleService],
})
export class JobsModule {}
