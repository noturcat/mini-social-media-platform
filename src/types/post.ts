
export interface Post {
  id: number;
  title: string;
  body: string;
  image_url?: string;
  tags: string[];
  person_id: number;
}
