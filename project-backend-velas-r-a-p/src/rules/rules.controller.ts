import { Body, Controller, Post } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RecommendationDto } from './dto/rules.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('recommend')
@Controller('recommend')
export class RulesController {
    constructor(private readonly rulesService: RulesService) {}

    @Post()
    @ApiOperation({ summary: 'Get fragrance recommendations based on user answers' })
    @ApiBody({
        type: RecommendationDto,
        description: 'Answers to the recommendation questions'
    })
    @ApiResponse({
        status: 201,
        description: 'List of recommended fragrances',
        schema: {
            example: [
                {
                    name: 'Vanilla Dream',
                    top_notes: 'Vanilla, Citrus',
                    middle_notes: 'Jasmine, Rose',
                    base_notes: 'Sandalwood, Musk',
                    image: 'https://example.com/image.jpg'
                }
            ]
        }
    })
    async recommend(@Body() answers: RecommendationDto) {
        return this.rulesService.getRecommendations(answers);
    }
}
