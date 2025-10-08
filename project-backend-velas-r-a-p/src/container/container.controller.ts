import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ContainerService } from './container.service';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudinaryStorage } from '../cloudinary/cloudinary.storage';

@ApiTags('container')
@Controller('container')
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Post()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new container' })
  @ApiBody({ type: CreateContainerDto })
  @ApiResponse({ status: 201, description: 'Container successfully created.' })
  @UseInterceptors(FileInterceptor('file', { storage: cloudinaryStorage }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createContainerDto: CreateContainerDto
  ) {
    if (file) {
      createContainerDto.image = file.path;
    }
    return this.containerService.create(createContainerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all containers' })
  @ApiResponse({ status: 200, description: 'List of containers.' })
  findAll() {
    return this.containerService.findAll();
  }

  @Get(':id')
  @Auth(Role.USER)
  @ApiOperation({ summary: 'Get a container by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Container UUID' })
  @ApiResponse({ status: 200, description: 'Container found.' })
  @ApiResponse({ status: 404, description: 'Container not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.containerService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Update a container by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Container UUID' })
  @ApiBody({ type: UpdateContainerDto })
  @ApiResponse({ status: 200, description: 'Container updated.' })
  @ApiResponse({ status: 404, description: 'Container not found.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateContainerDto: UpdateContainerDto) {
    return this.containerService.update(id, updateContainerDto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a container by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Container UUID' })
  @ApiResponse({ status: 200, description: 'Container deleted.' })
  @ApiResponse({ status: 404, description: 'Container not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.containerService.remove(id);
  }
}
