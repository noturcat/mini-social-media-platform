export interface PostDoc  {
  id: number;
  title: string;
  body: string;
};

export interface BlogDoc  {
  id: number;
  title: string;
  body: string;
  summary?: string;
};

export interface EventDoc  {
  id: number;
  title: string;
  location: string;
  time: string;
};

export interface PersonDoc  {
  id: number;
  name: string;
  email: string;
  bio?: string;
};
