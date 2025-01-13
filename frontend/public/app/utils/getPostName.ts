import {IPost} from "~/api/types/content";

export default function getPostName(post: IPost) {
  if (post.subcategory) {
    return post.subcategory.name;
  }
  if (post.category) {
    return post.category.name;
  }

  return null;
}