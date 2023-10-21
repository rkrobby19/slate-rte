import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className=" flex justify-center h-[50px] ">
      <div className="w-[1240px] flex items-center justify-between">
        <div className="flex items-center w-[577px] justify-between">
          <div className="flex w-[340px] justify-between">
            <span className="text-purple-700">
              {" "}
              <Link href="/">Home</Link>{" "}
            </span>
            <span>
              {" "}
              <Link href="/editor">Text Editor</Link>{" "}
            </span>
            <span>
              {" "}
              <Link href="/review">Page Review</Link>
            </span>
          </div>
        </div>
        {/* <div className="w-[279px] flex justify-between">
          <button className="bg-purple-200 px-[36px] py-[10px] rounded-[47px]">
            <p className="text-purple-700">Sign in</p>
          </button>
          <button className="bg-purple-600 px-[36px] py-[10px] rounded-[47px]">
            <p className="text-white">Sign Up</p>
          </button>
        </div> */}
      </div>
    </nav>
  );
}
