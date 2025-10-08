import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CandleModule } from '../src/candle/candle.module';
import { Candle } from '../src/candle/entities/candle.entity';
import { Repository } from 'typeorm';
import { Fragance } from '../src/fragance/entities/fragance.entity';
import { mockFragances } from './mock-data';
import { Container } from 'src/container/entities/container.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from 'src/payments/entities/payment.entity';

const mockContainers = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Glass Jar',
    material: 'Glass',
    diameter: 10,
    height: 15,
    image: 'glass_jar.jpg',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Ceramic Bowl',
    material: 'Ceramic',
    diameter: 12,
    height: 8,
    image: 'ceramic_bowl.jpg',
  },
];

describe('CandleController (e2e)', () => {
  let app: INestApplication;
  let candleRepository: Repository<Candle>;
  let fraganceRepository: Repository<Fragance>;
  let containerRepository: Repository<Container>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Container, Candle, Cart, CartItem, User, Fragance, Order, Payment],
          synchronize: true,
        }),
        CandleModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    candleRepository = moduleFixture.get('CandleRepository');
    fraganceRepository = moduleFixture.get('FraganceRepository');
    containerRepository = moduleFixture.get('ContainerRepository');
    await app.init();
  });

  beforeEach(async () => {
    await candleRepository.clear();
    await fraganceRepository.clear();
    await containerRepository.clear();

    await fraganceRepository.save(mockFragances);
    await containerRepository.save(mockContainers);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('/candle (POST) - Happy Path', async () => {
    const fragance = await fraganceRepository.findOneBy({
      id: '00000000-0000-0000-0000-000000000001',
    });

    const container = await containerRepository.findOneBy({
      id: '00000000-0000-0000-0000-000000000001',
    });

    const newCandle = {
      message: 'Relaxing Candle',
      image: 'relaxing_candle.jpg',
      price: 20,
      fraganceId: fragance?.id,
      containerId: container?.id,
    };

    const response = await request(app.getHttpServer())
      .post('/candle')
      .send(newCandle)
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      message: newCandle.message,
      image: newCandle.image,
      price: newCandle.price,
      fragance: { id: newCandle.fraganceId },
      container: { id: newCandle.containerId },
    });
  });

  it('/candle/:id (GET) - Happy Path', async () => {
    const candle = await candleRepository.save({
      message: 'Citrus Candle',
      image: 'citrus_candle.jpg',
      price: 10,
      fragance: { id: '00000000-0000-0000-0000-000000000001' },
      container: { id: '00000000-0000-0000-0000-000000000001' },
    });

    const response = await request(app.getHttpServer())
      .get(`/candle/${candle.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: candle.id,
      message: candle.message,
      image: candle.image,
      price: candle.price,
    });
  });

  it('/candle/:id (GET) - Non-Happy Path', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000999';
    await request(app.getHttpServer())
      .get(`/candle/${nonExistentId}`)
      .expect(404);
  });
});