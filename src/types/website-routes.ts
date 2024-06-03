export interface Route {
  uuid: string;
  websiteId: string;
  method: string;
  path: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Website {
  status: string;
  uuid: string;
  name: string;
  url: string;
  token: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  routes: Route[];
}

export interface ProjectsData {
  total: number;
  websites: Website[];
}
