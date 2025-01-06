import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { Like, Repository } from 'typeorm';
import { Destination } from './entities/destination.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private readonly destinationsRepository: Repository<Destination>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // 2.	**여행지 등록 API** - 새로운 여행지 등록 API 구현 (POST /destinations)
  async create(model: CreateDestinationDto): Promise<Destination> {
    const existingDestination = await this.destinationsRepository.findBy({
      name: model.name,
    });
    if (existingDestination.length > 0) {
      throw new BadRequestException('이미 존재하는 여행지입니다.');
    }

    const destination = this.destinationsRepository.create({
      ...model,
    });

    const createdDestination =
      await this.destinationsRepository.save(destination);

    return createdDestination;
  }

  // 3.	**여행지 목록 조회 API** - 모든 여행지 목록을 조회하는 API 구현 (GET /destinations)
  async findAll(): Promise<Destination[]> {
    return this.destinationsRepository.find();
  }

  // 4.	**여행지 상세 조회 API** - 특정 여행지의 세부 정보를 조회하는 API 구현 (GET /destinations/:id)
  async findById(id: number) {
    return this.destinationsRepository.findOneBy({ id });
  }

  async search(q: string): Promise<Destination[]> {
    // 검색속도(cache 활용)
    /* const cacheResult: any = await this.cacheManager.get(`search-${q}`);
    if (cacheResult) {
      return cacheResult;
    } */

    const result = await this.destinationsRepository.find({
      where: [
        {
          name: Like(`%${q}%`),
        },
        {
          description: Like(`%${q}%`),
        },
      ],
    });

    // await this.cacheManager.set(`search-${q}`, result, 1000 * 10);

    return result;
  }

  // 5.	**여행지 삭제 API** - 특정 여행지 삭제 API 구현 (DELETE /destinations/:id)
  async remove(id: number): Promise<void> {
    const existingDestination = await this.findById(id);

    if (existingDestination) {
      await this.destinationsRepository.delete(id);
      return;
    }
    throw new NotFoundException('존재하지 않는 여행지입니다.');
  }
}
