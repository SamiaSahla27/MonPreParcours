import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { EngagedCompaniesService } from './engaged-companies.service';

@Controller('engaged-companies')
export class EngagedCompaniesController {
  constructor(private readonly engagedCompanies: EngagedCompaniesService) {}

  @Get('overview')
  async overview() {
    return this.engagedCompanies.getOverview();
  }

  @Get()
  async list(
    @Query('q') q?: string,
    @Query('sector') sector?: string,
    @Query('theme') theme?: string,
    @Query('minScore') minScore?: string,
    @Query('sort') sort?: string,
  ) {
    const parsedMinScore =
      typeof minScore === 'string' && minScore.trim() !== ''
        ? Number.parseInt(minScore, 10)
        : undefined;

    return this.engagedCompanies.list({
      query: q,
      sector,
      theme,
      minScore: Number.isNaN(parsedMinScore) ? undefined : parsedMinScore,
      sort,
    });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const company = await this.engagedCompanies.getById(id);
    if (!company) throw new NotFoundException('ENGAGED_COMPANY_NOT_FOUND');
    return company;
  }
}
