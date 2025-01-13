import {UserContentTypes} from "~/api/types/enums";

export interface IUserForm {
  name?: string;
  email?: string;
  password?: string;
  permissions?: number;
}

export interface ICreateUserContent {
  post_id: number;
  content_type: UserContentTypes;
  content?: string;
}

export interface IUserContentUpdate {
  content: string;
}