import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { TestModule } from './test.module';
import { testDbConfig } from './test.module';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    // const moduleFixture: TestingModule = await Test.createTestingModule({
    //   imports: [
    //     TypeOrmModule.forRoot({
    //       type: 'sqlite',
    //       database: ':memory:',
    //       entities: [User],
    //       synchronize: true,
    //     }),
    //     AppModule,
    //   ],
    // }).compile();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
         AppModule,
         TestModule
      ],
    }).overrideModule(TypeOrmModule)
      .useModule(TypeOrmModule.forRoot(testDbConfig))
      .compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get('UserRepository');
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: registerDto.name,
        email: registerDto.email,
      });
    });

    it('should return 400 if email is already registered', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      };

      await userRepository.save({
        name: registerDto.name,
        email: registerDto.email,
        password: bcrypt.hashSync(registerDto.password, 10), // Encripta la contraseña
      });

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login an existing user', async () => {
      const user = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      };

      await userRepository.save({
        name: user.name,
        email: user.email,
        password: bcrypt.hashSync(user.password, 10), // Encripta la contraseña
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        email: user.email,
        token: expect.any(String),
      });
    });

    it('should return 401 for invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);
    });
  });
});