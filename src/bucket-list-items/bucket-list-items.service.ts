import { BucketListsService } from './../bucket-lists/bucket-lists.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BucketList } from 'src/bucket-lists/entities/bucket-list.entity';
import { Repository } from 'typeorm';
import { BucketListItem } from './entities/bucket-list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateBucketListItemDto } from './dto/create-bucket-list-item.dto';
import { UpdateBucketListItemDto } from './dto/update-bucket-list-item.dto';
import { Destination } from 'src/destinations/entities/destination.entity';

@Injectable()
export class BucketListItemsService {
  constructor(
    @InjectRepository(BucketList)
    private readonly bucketListRepository: Repository<BucketList>,
    @InjectRepository(BucketListItem)
    private readonly bucketListItemsRepository: Repository<BucketListItem>,
    @InjectRepository(Destination)
    private readonly destinationsRepository: Repository<Destination>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly bucketListsService: BucketListsService,
  ) {}

  async create(
    userId: string,
    bucketListId: number,
    model: CreateBucketListItemDto,
  ): Promise<BucketListItem> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('유저를 찾지 못했습니다.');
    }

    const bucketList = await this.bucketListsService.findById(
      userId,
      bucketListId,
    );

    if (!bucketList) {
      throw new BadRequestException('버킷리스트를 찾지 못했습니다.');
    }

    const destination = await this.destinationsRepository.findOne({
      where: {
        id: model.destinationId,
      },
    });
    if (!destination) {
      throw new BadRequestException('여행지를 찾지 못했습니다.');
    }

    const newBucketListItem = await this.bucketListItemsRepository.create({
      ...model,
      bucketList,
      destination,
    });

    await this.bucketListItemsRepository.save(newBucketListItem);

    return { ...newBucketListItem, bucketList: undefined };
  }

  async findAll(
    userId: string,
    bucketListId: number,
  ): Promise<BucketListItem[]> {
    return this.bucketListItemsRepository.find({
      where: {
        bucketList: {
          id: bucketListId,
          user: {
            id: userId,
          },
        },
      },
      relations: ['destination'],
    });
  }

  async update(
    userId: string,
    bucketListId: number,
    bucketListItemId: number,
    model: UpdateBucketListItemDto,
  ): Promise<BucketListItem> {
    const bucketListItem = await this.bucketListItemsRepository.findOne({
      where: {
        id: bucketListItemId,
        bucketList: {
          id: bucketListId,
          user: {
            id: userId,
          },
        },
      },
    });

    if (!bucketListItem) {
      throw new BadRequestException('버킷리스트 아이템을 찾지 못했습니다.');
    }

    bucketListItem.achieved = model.achieved;

    await this.bucketListItemsRepository.save(bucketListItem);

    return { ...bucketListItem, bucketList: undefined };
  }

  async remove(
    userId: string,
    bucketListId: number,
    bucketListItemId: number,
  ): Promise<void> {
    const bucketListItem = await this.bucketListItemsRepository.findOne({
      where: {
        id: bucketListItemId,
        bucketList: {
          id: bucketListId,
          user: {
            id: userId,
          },
        },
      },
    });

    if (!bucketListItem) {
      throw new NotFoundException('버킷리스트 아이템을 찾지 못했습니다.');
    }

    await this.bucketListItemsRepository.remove(bucketListItem);
  }
}
