"use client";

import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div>
      <h1>Hello</h1>
      <p>
        Text editor <Link href="/editor">here</Link>
      </p>
      <p>
        Page review <Link href="/review">here</Link>
      </p>
    </div>
  );
}
