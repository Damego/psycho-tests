import React from "react";

export default function Indicator({ color }: { color: string }) {
  return (
    <div
      style={{
        width: "10px",
        height: "10px",
        backgroundColor: color,
        borderRadius: "5px",
      }}
    />
  );
}
