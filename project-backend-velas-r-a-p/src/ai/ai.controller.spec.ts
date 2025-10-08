import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

describe('AiController', () => {
  let aiController: AiController;
  let aiService: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        {
          provide: AiService,
          useValue: {
            generateMessage: jest.fn(), 
          },
        },
      ],
    }).compile();

    aiController = module.get<AiController>(AiController);
    aiService = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(aiController).toBeDefined();
  });

  describe('generateMessage', () => {
    it('should call AiService.generateMessage with the correct prompt', async () => {
      const prompt = 'A birthday candle for my best friend who loves the stars';
      const expectedMessage = 'May your dreams shine as bright as the stars tonight.';
      jest.spyOn(aiService, 'generateMessage').mockResolvedValue(expectedMessage);

      const result = await aiController.generateMessage(prompt);

      expect(aiService.generateMessage).toHaveBeenCalledWith(prompt);
      expect(result).toBe(expectedMessage);
    });

    it('should throw an error if AiService.generateMessage fails', async () => {
      const prompt = 'A birthday candle for my best friend who loves the stars';
      jest.spyOn(aiService, 'generateMessage').mockRejectedValue(new Error('Service error'));

      await expect(aiController.generateMessage(prompt)).rejects.toThrow('Service error');
    });
  });
});