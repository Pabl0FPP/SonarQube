import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ExtraProductService } from './extra-product.service';
import { CreateExtraProductDto } from './dto/create-extra-product.dto';
import { UpdateExtraProductDto } from './dto/update-extra-product.dto';
import { Role } from 'src/common/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('extra-products')
export class ExtraProductController {
  constructor(private readonly extraProductService: ExtraProductService) {}

  @Post()
  @Auth(Role.ADMIN)
  create(@Body() createExtraProductDto: CreateExtraProductDto) {
    return this.extraProductService.create(createExtraProductDto);
  }

  @Get()
  findAll() {
    return this.extraProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.extraProductService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateExtraProductDto: UpdateExtraProductDto) {
    return this.extraProductService.update(id, updateExtraProductDto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.extraProductService.remove(id);
  }
} 