import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentStaff, JwtAuthGuard, Roles, RolesGuard, type StaffTokenPayload } from '../../common/auth/common-auth.module';
import { CreateStaffDto, ListStaffQueryDto, UpdateStaffDto } from './dto/staff.dto';
import { StaffService, type StaffSummary } from './staff.service';

/** `/admin/staff` — the "Staff & roles" page in the operations console. */
@ApiTags('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/staff')
export class StaffController {
  constructor(private readonly staff: StaffService) {}

  @Get('me')
  me(@CurrentStaff() staff: StaffTokenPayload): StaffTokenPayload {
    return staff;
  }

  @Roles('platform_administrator')
  @Post()
  create(@Body() body: CreateStaffDto): Promise<StaffSummary> {
    return this.staff.create(body);
  }

  @Get()
  list(@Query() query: ListStaffQueryDto) {
    return this.staff.list(query);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string): Promise<StaffSummary> {
    return this.staff.getById(id);
  }

  @Roles('platform_administrator')
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateStaffDto): Promise<StaffSummary> {
    return this.staff.update(id, body);
  }
}
