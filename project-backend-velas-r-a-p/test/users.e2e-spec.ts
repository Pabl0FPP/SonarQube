import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Fragance } from 'src/fragance/entities/fragance.entity';
import { Candle } from 'src/candle/entities/candle.entity';
import { Container } from 'src/container/entities/container.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from 'src/payments/entities/payment.entity';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Fragance, Candle, Container, Cart, CartItem, User, Order, Payment],
          synchronize: true,
        }),
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get('UserRepository');
    await app.init();
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET) - should return an empty list initially', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it('/users/:id (GET) - should return 404 for non-existent user', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000999';
    await request(app.getHttpServer())
      .get(`/users/${nonExistentId}`)
      .expect(404);
  });

  it('/users/:id (PATCH) - should update an existing user', async () => {
    const user = await userRepository.save({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'Password123!',
    });

    const updatedData = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
    };

    const response = await request(app.getHttpServer())
      .patch(`/users/${user.id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toMatchObject({
      id: user.id,
      name: updatedData.name,
      email: updatedData.email,
    });

    const updatedUserInDb = await userRepository.findOneBy({ id: user.id });
    expect(updatedUserInDb).toMatchObject(updatedData);
  });

  it('/users/:id (DELETE) - should delete an existing user', async () => {
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
    });

    await request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .expect(200);

    const deletedUser = await userRepository.findOneBy({ id: user.id });
    expect(deletedUser).toBeNull();
  });

  it('/users/:id (DELETE) - should return 404 for non-existent user', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000999';
    await request(app.getHttpServer())
      .delete(`/users/${nonExistentId}`)
      .expect(404);
  });
});