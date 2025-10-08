import { Test, TestingModule } from "@nestjs/testing";
import { RecommendationDto } from "./dto/rules.dto";
import { RulesController } from "./rules.controller";
import { RulesService } from "./rules.service";

describe('RulesController', () => {
  let controller: RulesController;
  let service: RulesService;

  const mockRulesService = {
    getRecommendations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RulesController],
      providers: [
        {
          provide: RulesService,
          useValue: mockRulesService,
        },
      ],
    }).compile();

    controller = module.get<RulesController>(RulesController);
    service = module.get<RulesService>(RulesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('recommend', () => {
    const mockAnswers: RecommendationDto = {
      intention: 'decorate', // Propiedad requerida
      space: 'living_room', // Propiedad opcional
      ambiance: 'cozy', // Propiedad opcional
    };

    const invalidAnswers: RecommendationDto = {
      intention: 'invalid', // Propiedad requerida
    };

    const mockRecommendations = [
      {
        id: '1',
        name: 'Lavender Bliss',
        topNotes: 'Lavender',
        middleNotes: 'Floral',
        baseNotes: 'Woody',
        image: 'lavender_bliss.jpg',
        candles: [
          {
            id: 'c1',
            name: 'Lavender Candle',
            message: 'Relaxing lavender scent',
            image: 'lavender_candle.jpg',
            price: 20,
            qr: 'qr_code_lavender.jpg',
            fragance: {
              id: 'f1',
              name: 'Lavender Bliss',
              topNotes: 'Lavender',
              middleNotes: 'Floral',
              baseNotes: 'Woody',
              image: 'lavender_bliss.jpg',
              candles: [],
            },
            container: {
              id: 'co1',
              name: 'Glass Jar',
              material: 'Glass',
              diameter: 10,
              height: 15,
              image: 'glass_jar.jpg',
              candles: [],
            },
            cartItems: [],
          },
        ],
      },
    ];

    it('should return recommendations from the service (positive case)', async () => {
      jest.spyOn(service, 'getRecommendations').mockResolvedValue(mockRecommendations);

      const result = await controller.recommend(mockAnswers );

      expect(service.getRecommendations).toHaveBeenCalledWith(mockAnswers);
      expect(result).toEqual(mockRecommendations);
    });

    it('should handle service errors (negative case)', async () => {
      jest.spyOn(service, 'getRecommendations').mockRejectedValue(new Error('Service error'));

      await expect(controller.recommend(mockAnswers )).rejects.toThrow('Service error');
      expect(service.getRecommendations).toHaveBeenCalledWith(mockAnswers);
    });

    it('should return an empty array if no recommendations are found', async () => {
      jest.spyOn(service, 'getRecommendations').mockResolvedValue([]);

      const result = await controller.recommend( mockAnswers );

      expect(service.getRecommendations).toHaveBeenCalledWith(mockAnswers);
      expect(result).toEqual([]);
    });

    it('should handle invalid input gracefully', async () => {
      jest.spyOn(service, 'getRecommendations').mockResolvedValue([]);

      const result = await controller.recommend(invalidAnswers );

      expect(service.getRecommendations).toHaveBeenCalledWith(invalidAnswers);
      expect(result).toEqual([]);
    });
  });
});