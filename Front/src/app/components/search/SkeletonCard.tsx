import React from "react";

export function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 overflow-hidden"
      style={{
        background: "#FFFFFF",
        border: "1.5px solid rgba(0,0,0,0.06)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div className="animate-pulse flex flex-col gap-3">
        <div
          className="w-16 h-5 rounded-full"
          style={{ background: "#F3F4F6" }}
        />
        <div
          className="w-40 h-5 rounded-lg"
          style={{ background: "#F3F4F6" }}
        />
        <div
          className="w-24 h-4 rounded-lg"
          style={{ background: "#F9FAFB" }}
        />
        <div className="flex flex-col gap-1.5">
          <div className="w-full h-3 rounded-lg" style={{ background: "#F3F4F6" }} />
          <div className="w-5/6 h-3 rounded-lg" style={{ background: "#F3F4F6" }} />
        </div>
        <div className="flex gap-2">
          <div className="w-16 h-6 rounded-full" style={{ background: "#F3F4F6" }} />
          <div className="w-20 h-6 rounded-full" style={{ background: "#F3F4F6" }} />
        </div>
        <div className="w-full h-10 rounded-xl" style={{ background: "#F3F4F6" }} />
      </div>
    </div>
  );
}
