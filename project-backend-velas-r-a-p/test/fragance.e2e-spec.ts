import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FraganceModule } from '../src/fragance/fragance.module';
import { Fragance } from '../src/fragance/entities/fragance.entity';
import { Repository } from 'typeorm';
import { mockFragances } from './mock-data';
import { ConfigModule } from '@nestjs/config';
import { Candle } from 'src/candle/entities/candle.entity';
import { Container } from 'src/container/entities/container.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';

// Centralizar los mocks
const mockAuthGuard = {
  canActivate: jest.fn(() => true), // Permitir acceso en las pruebas
};

const mockJwtService = {
  sign: jest.fn(() => 'mocked-jwt-token'),
  verify: jest.fn(() => ({ userId: 'mocked-user-id' })),
};

describe('FraganceController (e2e)', () => {
  let app: INestApplication;
  let fraganceRepository: Repository<Fragance>;

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
        JwtModule.register({
          secret: 'test-secret', // Configuración ficticia para pruebas
          signOptions: { expiresIn: '1h' },
        }),
        FraganceModule,
      ],
    })
      .overrideGuard(AuthGuard('jwt')) // Mock del AuthGuard
      .useValue(mockAuthGuard)
      .overrideProvider(JwtService) // Mock del JwtService
      .useValue(mockJwtService)
      .compile();

    app = moduleFixture.createNestApplication();
    fraganceRepository = moduleFixture.get('FraganceRepository');
    await app.init();
  });

  beforeEach(async () => {
    await fraganceRepository.clear();
    await fraganceRepository.save(mockFragances);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('/fragance (GET) - Happy Path', async () => {
    const response = await request(app.getHttpServer())
      .get('/fragance')
      .expect(200);

    expect(response.body).toHaveLength(mockFragances.length);
  });

  it('/fragance/:id (GET) - Happy Path', async () => {
    const fraganceId = '00000000-0000-0000-0000-000000000001';
    const response = await request(app.getHttpServer())
      .get(`/fragance/${fraganceId}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: fraganceId,
      name: 'Lavender Bliss',
    });
  });

  it('/fragance/:id (GET) - Non-Happy Path', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000999';
    await request(app.getHttpServer())
      .get(`/fragance/${nonExistentId}`)
      .expect(404);
  });

  it('/fragance (POST) - Happy Path', async () => {
    const newFragance = {
      name: 'Nueva Fragancia',
      topNotes: 'Notas frescas',
      middleNotes: 'Notas florales',
      baseNotes: 'Notas amaderadas',
      image: 'nueva_fragancia.jpg',
    };

    const response = await request(app.getHttpServer())
      .post('/fragance')
      .send(newFragance)
      .expect(201);

    expect(response.body).toMatchObject({
      ...newFragance,
      id: expect.any(String),
    });
  });
});