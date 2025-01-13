import React from "react";

function IconBookmark({ color, ...props }: React.SVGProps<SVGSVGElement>) {
  color = color ?? "#638EFF";
  return (
    <svg
      width="23"
      height="33"
      viewBox="0 0 23 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 16.0408L11.1395 25.8436L0 32.75V16.0408Z" fill={color} />
      <path
        d="M22.2789 16.0408L11.1395 25.8436L22.2789 32.75V16.0408Z"
        fill={color}
      />
      <rect width="22.2789" height="25.8435" rx="4" fill={color} />
    </svg>
  );
}

export default IconBookmark;
