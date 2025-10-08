import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CandleService } from './candle.service';
import { CreateCandleDto } from './dto/create-candle.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudinaryStorage } from '../cloudinary/cloudinary.storage';

@ApiTags('candle')
@Controller('candle')
export class CandleController {
  constructor(private readonly candleService: CandleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new candle' })
  @ApiBody({ type: CreateCandleDto })
  @ApiResponse({ status: 201, description: 'Candle successfully created.' })
  @UseInterceptors(FileInterceptor('file', { storage: cloudinaryStorage }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCandleDto: CreateCandleDto
  ) {
    if (file) {
      createCandleDto.image = file.path;
    }
    return this.candleService.create(createCandleDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a candle by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Candle UUID' })
  @ApiResponse({ status: 200, description: 'Candle found.' })
  @ApiResponse({ status: 404, description: 'Candle not found.' })
  findOne(@Param('id') id: string) {
    return this.candleService.findOne(id);
  }


}
