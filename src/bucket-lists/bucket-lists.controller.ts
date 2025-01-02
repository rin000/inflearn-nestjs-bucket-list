import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BucketListsService } from './bucket-lists.service';
import { createBucketListDto } from './dto/create-bucket-list.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';

@Controller('bucket-lists')
export class BucketListsController {
  constructor(private readonly bucketListsService: BucketListsService) {}

  @Post('')
  @UseGuards(AccessTokenGuard)
  async createBucketList(
    @Body() body: createBucketListDto,
    @Req() req: Request,
  ) {
    const userId = req.user['id'];

    return this.bucketListsService.create(userId, body);
  }

  @Get('')
  @UseGuards(AccessTokenGuard)
  async getBucketLists(@Req() req: Request) {
    const userId = req.user['id'];

    return this.bucketListsService.find(userId);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async getBucketListById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user['id'];

    return this.bucketListsService.findById(userId, id);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async deleteBucketList(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user['id'];

    return this.bucketListsService.remove(userId, id);
  }
}
