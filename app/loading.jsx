"use client";
import { ThreeDot } from "react-loading-indicators";

export default function Loading() {
  return (
    <div className="flex my-auto h-[90vh] justify-center items-center">
      <ThreeDot
        variant="pulsate"
        color="rgb(148 163 184)"
        size="large"
        text=""
        textColor=""
      />
    </div>
  );
}
