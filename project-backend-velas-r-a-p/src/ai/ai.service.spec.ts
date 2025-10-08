import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';

describe('AiService', () => {
  let aiService: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
      ],
    }).compile();

    aiService = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(aiService).toBeDefined();
  });

  describe('generateMessage', () => {
    it('should generate a message based on the given prompt', async () => {
      const prompt = 'Un mensaje para una vela de cumpleaños';
      const mockResponse = 'Que tu luz ilumine cada momento especial de tu vida.';


      jest.spyOn(aiService, 'generateMessage').mockResolvedValue(mockResponse);

      const result = await aiService.generateMessage(prompt);

      expect(result).toBe(mockResponse);
    });

    it('should throw an error if the AI model fails', async () => {
      const prompt = 'Un mensaje para una vela de cumpleaños';

      jest.spyOn(aiService, 'generateMessage').mockRejectedValue(new Error('AI model error'));

      await expect(aiService.generateMessage(prompt)).rejects.toThrow('AI model error');
    });
  });
});