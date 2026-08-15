export interface RootNews {
  id: number;
  title: string;
}

export interface ParentNews {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string | null;

  category: {
    id: number;
    name: string;
  };

  root_blog: number;

  tags: string[];

  lang: "fa" | "en";

  published: boolean;
}

export interface ChildNews {
  id: number;

  blog: number;

  title: string;

  description: string;

  image: string | null;
}
