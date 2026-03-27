import { Controller, Get, NotFoundException, Query, Param } from '@nestjs/common';
import { MentorsService } from './mentors.service';

@Controller('mentors')
export class MentorsController {
  constructor(private readonly mentors: MentorsService) {}

  @Get('professions')
  async professions() {
    return await this.mentors.listProfessions();
  }

  @Get()
  async list(@Query('q') q?: string) {
    return this.mentors.list({ query: q });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const mentor = await this.mentors.getById(id);
    if (!mentor) throw new NotFoundException('MENTOR_NOT_FOUND');
    return mentor;
  }
}
