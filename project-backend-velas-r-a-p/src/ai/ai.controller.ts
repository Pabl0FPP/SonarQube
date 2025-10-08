import { Body, Controller, Post} from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('message')
  @ApiOperation({ summary: 'Generate a creative message for a personalized candle' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          example: 'A birthday candle for my best friend who loves the stars',
          description: 'Context or idea for the personalized candle message'
        }
      },
      required: ['prompt']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Generated creative message for the candle.',
    schema: { example: 'May your dreams shine as bright as the stars tonight.' }
  })
  async generateMessage(@Body('prompt') prompt: string) {
    return { message: await this.aiService.generateMessage(prompt)};
  }

  @Post('image')
  @ApiOperation({ summary: 'Generate an image for a personalized candle label' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          example: 'Fondo pastel con flores de lava',
          description: 'Descripción de la imagen que deseas generar',
        },
      },
      required: ['prompt'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Generated image for the candle label.',
    schema: { example: { imageUrl: 'data:image/png;base64,...' } },
  })
  async generateImage(@Body('prompt') prompt: string) {
    const imageUrl = await this.aiService.generateImageWithOpenAI(prompt);
    return { imageUrl };
  }
}
