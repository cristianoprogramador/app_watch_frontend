// src/types/website-routes.ts

export interface Route {
  uuid: string;
  method: string;
  route: string;
  body: string;
  websiteId: string;
  path: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface SiteStatus {
  uuid: string;
  siteId: string;
  status: string;
  lastChecked: string;
}

export interface Website {
  uuid: string;
  name: string;
  url: string;
  token?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  routes: Route[];
  siteStatus: SiteStatus;
}

export interface ProjectsData {
  total: number;
  websites: Website[];
}
