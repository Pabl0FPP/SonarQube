import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RulesController } from '../src/rules/rules.controller';
import { RulesService } from '../src/rules/rules.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

const mockRecommendations = [
  { id: '1', name: 'Lavender Bliss', description: 'Relaxing lavender scent' },
  { id: '2', name: 'Citrus Burst', description: 'Energizing citrus aroma' },
];

const mockRulesService = {
  getRecommendations: jest.fn().mockResolvedValue(mockRecommendations),
};

describe('RulesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RulesController],
      providers: [
        {
          provide: RulesService,
          useValue: mockRulesService,
        },
        {
          provide: JwtService,
          useValue: {}, // Mock del JwtService si es necesario
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: jest.fn(() => true), // Mock del AuthGuard para permitir acceso
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/recommend (POST) - should return recommendations', async () => {
    const answers = { intention: 'decorate', space: 'living_room', ambiance: 'cozy' };

    const response = await request(app.getHttpServer())
      .post('/recommend')
      .send({ answers })
      .expect(201);

    expect(response.body).toEqual(mockRecommendations);
    expect(mockRulesService.getRecommendations).toHaveBeenCalledWith({ answers });
  });
});