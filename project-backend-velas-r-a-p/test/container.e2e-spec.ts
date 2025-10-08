import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContainerModule } from '../src/container/container.module';
import { Container } from '../src/container/entities/container.entity';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { Candle } from 'src/candle/entities/candle.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Fragance } from 'src/fragance/entities/fragance.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Order } from 'src/orders/entities/order.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

describe('ContainerController (e2e)', () => {
  let app: INestApplication;
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
        ContainerModule,
      ],
    })
      .overrideGuard(AuthGuard('jwt')) // Mock del AuthGuard
      .useValue({
        canActivate: jest.fn(() => true), // Permitir acceso en las pruebas
      })
      .overrideProvider(JwtService) // Mock del JwtService
      .useValue({
        sign: jest.fn(() => 'mocked-jwt-token'),
        verify: jest.fn(() => ({ userId: 'mocked-user-id' })),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    containerRepository = moduleFixture.get('ContainerRepository');
    await app.init();
  });

  beforeEach(async () => {
    await containerRepository.clear();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('/container (POST) - Happy Path', async () => {
    const newContainer = {
      name: 'Glass Jar',
      material: 'Glass',
      diameter: 10,
      height: 15,
      image: 'glass_jar.jpg',
    };

    const response = await request(app.getHttpServer())
      .post('/container')
      .send(newContainer)
      .expect(201);

    expect(response.body).toMatchObject({
      ...newContainer,
      id: expect.any(String),
    });
  });

  it('/container (GET) - Happy Path', async () => {
    const container = await containerRepository.save({
      name: 'Metal Tin',
      material: 'Metal',
      diameter: 8,
      height: 12,
      image: 'metal_tin.jpg',
    });

    const response = await request(app.getHttpServer())
      .get('/container')
      .expect(200);

    expect(response.body).toEqual([
      {
        id: container.id,
        name: container.name,
        material: container.material,
        diameter: container.diameter,
        height: container.height,
        image: container.image,
      },
    ]);
  });

  it('/container/:id (GET) - Happy Path', async () => {
    const container = await containerRepository.save({
      name: 'Ceramic Bowl',
      material: 'Ceramic',
      diameter: 12,
      height: 8,
      image: 'ceramic_bowl.jpg',
    });

    const response = await request(app.getHttpServer())
      .get(`/container/${container.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: container.id,
      name: container.name,
      material: container.material,
      diameter: container.diameter,
      height: container.height,
      image: container.image,
    });
  });

  it('/container/:id (PATCH) - Happy Path', async () => {
    const container = await containerRepository.save({
      name: 'Plastic Cup',
      material: 'Plastic',
      diameter: 6,
      height: 10,
      image: 'plastic_cup.jpg',
    });

    const updatedData = {
      name: 'Updated Plastic Cup',
      material: 'Recycled Plastic',
    };

    const response = await request(app.getHttpServer())
      .patch(`/container/${container.id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toMatchObject({
      id: container.id,
      name: updatedData.name,
      material: updatedData.material,
      diameter: container.diameter,
      height: container.height,
      image: container.image,
    });
  });

  it('/container/:id (DELETE) - Happy Path', async () => {
    const container = await containerRepository.save({
      name: 'Wooden Box',
      material: 'Wood',
      diameter: 15,
      height: 20,
      image: 'wooden_box.jpg',
    });

    await request(app.getHttpServer())
      .delete(`/container/${container.id}`)
      .expect(200);

    const deletedContainer = await containerRepository.findOneBy({ id: container.id });
    expect(deletedContainer).toBeNull();
  });

  it('/container/:id (GET) - Non-Happy Path (Not Found)', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'; // UUID válido
    await request(app.getHttpServer())
      .get(`/container/${nonExistentId}`)
      .expect(404);
  });
});