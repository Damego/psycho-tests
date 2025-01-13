import { ICategory, ISubCategory } from "../../api/types/content";
import React from "react";
import { Link } from "@remix-run/react";

export const LinkWrapper = ({
  category,
  subcategory,
  children,
}: {
  category?: ICategory;
  subcategory?: ISubCategory;
  children: React.ReactNode;
}) => {
  let href;
  if (category) {
    if (category.subcategories?.length) {
      return children;
    }
    href = category.post
      ? `/posts/edit/${category.post.id}`
      : {
          pathname: "/posts/add",
          search: `?category_id=${category.id}`,
        };
  } else if (subcategory) {
    href = subcategory.post
      ? `/posts/edit/${subcategory.post.id}`
      : {
          pathname: "/posts/add",
          search: `?subcategory_id=${subcategory.id}`,
        };
  }

  return (
    <Link
      style={{ textDecoration: "none", color: "inherit" }}
      to={href!}
    >
      {children}
    </Link>
  );
};
