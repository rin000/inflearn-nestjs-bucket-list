import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET user info
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userId = req.user['sub'];
    const user = await this.usersService.findById(userId);

    return this.shieldUserInformation(user);
  }

  // PUT user
  @UseGuards(AccessTokenGuard)
  @Put('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(req.user['sub'], updateUserDto);

    return this.shieldUserInformation(user);
  }

  private shieldUserInformation(user: User) {
    return { ...user, password: undefined, refreshToken: undefined };
  }
}
