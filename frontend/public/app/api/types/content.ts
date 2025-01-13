import { MediaTypes, UserContentTypes } from "./enums";

export interface ICategory {
  id: number;
  name: string;
  subcategories: ISubCategory[];
  post?: IPost;
}

export interface ISubCategory {
  id: number;
  category_id: number;
  name: string;
  category: ICategory;
  post?: IPost;
}

export interface IPost {
  id: number;
  category_id: number;
  subcategory_id?: number;
  content: string;
  category: ICategory;
  subcategory: ISubCategory;
}

export interface IMedia<T> {
  id: number;
  file_url?: string;
  file_name?: string;
  type: MediaTypes;
  data?: T;
}

export interface IUserContent {
  id: number;
  user_id: number;
  post_id: number;
  content_type: UserContentTypes;
  content?: string;

  post: IPost;
}
