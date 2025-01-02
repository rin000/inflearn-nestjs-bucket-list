import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { BucketList } from './entities/bucket-list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { createBucketListDto } from './dto/create-bucket-list.dto';

@Injectable()
export class BucketListsService {
  constructor(
    @InjectRepository(BucketList)
    private readonly bucketListsRepository: Repository<BucketList>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    userId: string,
    model: createBucketListDto,
  ): Promise<BucketList> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('유저를 찾지 못했습니다.');
    }

    const existingBucketList = await this.bucketListsRepository.findOne({
      where: {
        name: model.name,
        user: {
          id: userId,
        },
      },
    });
    if (existingBucketList) {
      throw new BadRequestException('이미 존재하는 버킷리스트 입니다.');
    }

    const newBucketList = await this.bucketListsRepository.create({
      ...model,
      user,
    });

    await this.bucketListsRepository.save(newBucketList);

    return { ...newBucketList, user: undefined };
  }

  async findById(userId: string, id: number): Promise<BucketList> {
    return this.bucketListsRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });
  }

  async find(userId: string): Promise<BucketList[]> {
    return this.bucketListsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async remove(userId: string, id: number): Promise<void> {
    const bucketList = await this.findById(userId, id);

    if (!bucketList) {
      throw new BadRequestException('버킷리스트를 찾지 못했습니다.');
    }

    await this.bucketListsRepository.remove(bucketList);
  }
}
