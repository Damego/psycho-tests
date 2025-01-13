import React from "react";

export default function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12.5" cy="7.5" r="7.5" fill="#638EFF" />
      <path
        d="M6.25305 19.9976C9.90524 17.0758 15.0948 17.0758 18.747 19.9976L25 25H13.0001H0L6.25305 19.9976Z"
        fill="#638EFF"
      />
    </svg>
  );
}
