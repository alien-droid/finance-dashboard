"use client";

import { useUser } from "@clerk/nextjs";

const Welcome = () => {
  const { user, isLoaded } = useUser();
  return (
    <div className="space-y-2 mb-4 ">
      <h2 className="text-2xl lg:text-4xl text-white font-medium ">
        Welcome{isLoaded && user?.firstName ? `, ${user.firstName}` : ""} 👋
      </h2>
      <p className="text-sm lg:text-base text-[#d5d8dc]">
        Your <span className="underline text-[#48c9b0]">Financial</span> Overview Report
      </p>
    </div>
  );
};

export default Welcome;
