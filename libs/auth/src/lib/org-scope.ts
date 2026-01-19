export type OrgNode = { 
    id: string; 
    parentId?: string | null 
};


export function computeAllowedOrgIds( params: {
    userOrgId: string;
    orgs: OrgNode[];
}): string[] {
  const { userOrgId, orgs } = params;

  const children = orgs.filter((o) => o.parentId === userOrgId).map((o) => o.id);
  
  return [userOrgId, ...children];
}