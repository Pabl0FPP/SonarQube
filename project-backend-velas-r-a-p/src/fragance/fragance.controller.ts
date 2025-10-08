import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FraganceService } from './fragance.service';
import { CreateFraganceDto } from './dto/create-fragance.dto';
import { UpdateFraganceDto } from './dto/update-fragance.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudinaryStorage } from '../cloudinary/cloudinary.storage';

@ApiTags('fragance')
@Controller('fragance')
export class FraganceController {
  constructor(private readonly fraganceService: FraganceService) {}

  @Post()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new fragance' })
  @ApiBody({ type: CreateFraganceDto })
  @ApiResponse({ status: 201, description: 'Fragance successfully created.' })
  @UseInterceptors(FileInterceptor('file', { storage: cloudinaryStorage }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFraganceDto: CreateFraganceDto
  ) {
    if (file) {
      createFraganceDto.image = file.path;
    }
    return this.fraganceService.create(createFraganceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fragances' })
  @ApiResponse({ status: 200, description: 'List of fragances.' })
  findAll() {
    return this.fraganceService.findAll();
  }

  @Get(':id')
  @Auth(Role.USER)
  @ApiOperation({ summary: 'Get a fragance by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Fragance UUID' })
  @ApiResponse({ status: 200, description: 'Fragance found.' })
  @ApiResponse({ status: 404, description: 'Fragance not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.fraganceService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Update a fragance by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Fragance UUID' })
  @ApiBody({ type: UpdateFraganceDto })
  @ApiResponse({ status: 200, description: 'Fragance updated.' })
  @ApiResponse({ status: 404, description: 'Fragance not found.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateFraganceDto: UpdateFraganceDto) {
    return this.fraganceService.update(id, updateFraganceDto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a fragance by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Fragance UUID' })
  @ApiResponse({ status: 200, description: 'Fragance deleted.' })
  @ApiResponse({ status: 404, description: 'Fragance not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.fraganceService.remove(id);
  }
}
