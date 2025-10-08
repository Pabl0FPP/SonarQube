import { Test, TestingModule } from '@nestjs/testing';
import { RulesService } from './rules.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Fragance } from '../fragance/entities/fragance.entity';
import { In, Repository } from 'typeorm';
import { Engine, EngineResult, Almanac } from 'json-rules-engine';

describe('RulesService', () => {
  let service: RulesService;
  let fraganceRepository: Repository<Fragance>;

  const mockFraganceRepository = {
    find: jest.fn(),
  };

  const mockAlmanac: Partial<Almanac> = {
    factValue: jest.fn(),
    addFact: jest.fn(),
    addRuntimeFact: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RulesService,
        {
          provide: getRepositoryToken(Fragance),
          useValue: mockFraganceRepository,
        },
      ],
    }).compile();

    service = module.get<RulesService>(RulesService);
    fraganceRepository = module.get<Repository<Fragance>>(getRepositoryToken(Fragance));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRecommendations', () => {
    const mockAnswers = { intention: 'decorate', space: 'living_room', ambiance: 'cozy' };
    const mockFragances = [
      {
        name: 'Lavender Bliss',
        topNotes: 'Lavender',
        middleNotes: 'Floral',
        baseNotes: 'Woody',
        image: 'lavender_bliss.jpg',
      },
    ];

    it('should return recommendations when rules match', async () => {
      jest.spyOn(service['engine'], 'run').mockResolvedValue({
        events: [{ type: 'recommendations', params: { fragance_names: ['Lavender Bliss'] } }],
        failureEvents: [],
        almanac: mockAlmanac as Almanac,
        results: [],
        failureResults: [],
      } as EngineResult);
      jest.spyOn(mockFraganceRepository, 'find').mockResolvedValue(mockFragances);

      const result = await service.getRecommendations(mockAnswers);

      expect(result).toEqual(mockFragances);
      expect(mockFraganceRepository.find).toHaveBeenCalledWith({
        where: { name: In(['Lavender Bliss']) },
        select: ['name', 'topNotes', 'middleNotes', 'baseNotes', 'image'],
      });
    });

    it('should throw an error if no events are triggered', async () => {
      jest.spyOn(service['engine'], 'run').mockResolvedValue({
        events: [],
        failureEvents: [],
        almanac: mockAlmanac as Almanac,
        results: [],
        failureResults: [],
      } as EngineResult);

      await expect(service.getRecommendations(mockAnswers)).rejects.toThrow(
        'No hay recomendaciones para estas respuestas',
      );
    });

    it('should throw an error if no fragance names are found in events', async () => {
      jest.spyOn(service['engine'], 'run').mockResolvedValue({
        events: [{ type: 'recommendations', params: {} }],
        failureEvents: [],
        almanac: mockAlmanac as Almanac,
        results: [],
        failureResults: [],
      } as EngineResult);

      await expect(service.getRecommendations(mockAnswers)).rejects.toThrow(
        'No se encontraron nombres de fragancias',
      );
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(service['engine'], 'run').mockResolvedValue({
        events: [{ type: 'recommendations', params: { fragance_names: ['Lavender Bliss'] } }],
        failureEvents: [],
        almanac: mockAlmanac as Almanac,
        results: [],
        failureResults: [],
      } as EngineResult);
      jest.spyOn(mockFraganceRepository, 'find').mockRejectedValue(new Error('Database error'));

      await expect(service.getRecommendations(mockAnswers)).rejects.toThrow('Database error');
    });

    it('should handle invalid input gracefully', async () => {
      const invalidAnswers = { intention: 'decorate' };
      jest.spyOn(service['engine'], 'run').mockResolvedValue({
        events: [],
        failureEvents: [],
        almanac: mockAlmanac as Almanac,
        results: [],
        failureResults: [],
      } as EngineResult);

      await expect(service.getRecommendations(invalidAnswers)).rejects.toThrow(
        'No hay recomendaciones para estas respuestas',
      );
    });

    it('should throw an error if intention is invalid', async () => {
      const invalidAnswers = { intention: 'invalid_intention' };

      await expect(service.getRecommendations(invalidAnswers)).rejects.toThrow(
        'No hay recomendaciones para estas respuestas',
      );
    });

    it('should handle intention "feel" and add the correct facts', async () => {
      const mockAnswers = { intention: 'feel', emotion: 'happy' };

      jest.spyOn(service['engine'], 'addFact');

      jest.spyOn(service['engine'], 'run').mockResolvedValue({
        events: [{ type: 'recommendations', params: { fragance_names: ['Lavender Bliss'] } }],
        failureEvents: [],
        almanac: mockAlmanac as Almanac,
        results: [],
        failureResults: [],
      } as EngineResult);

      jest.spyOn(mockFraganceRepository, 'find').mockResolvedValue(mockFragances);

      const result = await service.getRecommendations(mockAnswers);

      expect(result).toEqual(mockFragances);
      expect(service['engine'].addFact).toHaveBeenCalledWith('emotion', expect.any(Function));
    });

    it('should handle intention "gift" and add the correct facts', async () => {
      const mockAnswers = { intention: 'gift', occasion: 'birthday' };

      jest.spyOn(service['engine'], 'addFact');

      jest.spyOn(service['engine'], 'run').mockResolvedValue({
        events: [{ type: 'recommendations', params: { fragance_names: ['Lavender Bliss'] } }],
        failureEvents: [],
        almanac: mockAlmanac as Almanac,
        results: [],
        failureResults: [],
      } as EngineResult);

      jest.spyOn(mockFraganceRepository, 'find').mockResolvedValue(mockFragances);

      const result = await service.getRecommendations(mockAnswers);

      expect(result).toEqual(mockFragances);
      expect(service['engine'].addFact).toHaveBeenCalledWith('occasion', expect.any(Function));
    });
  });
});