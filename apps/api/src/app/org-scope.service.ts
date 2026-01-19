import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';


@Injectable()
export class OrgScopeService {
    constructor(
      @InjectRepository(Organization) private readonly orgRepo: Repository<Organization>
    ) {}

    async allowedOrgIdsForUserOrg(userOrgId: string): Promise<string[]> {
    const children = await this.orgRepo.find({
      where: { 
        parent: { 
          id: userOrgId 
        } 
      },
      relations: { 
        parent: true 
      },
      select: { 
        id: true 
      },
    });

    return [userOrgId, ...children.map((c) => c.id)];
  }
}