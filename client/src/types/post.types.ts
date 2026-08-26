export interface Post {
  _id: string;
  title: string;
  category: string;
  desc: string;
  slug: string;
  content: string;
  visit: number;
  user: {
    _id: string;
    username: string;
    img: string;
  };
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
