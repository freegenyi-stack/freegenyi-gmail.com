import React, { Suspense } from "react";
import ChildPairClient from "./ChildPairClient";

export default function ChildPairPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center">…</div>}>
      <ChildPairClient />
    </Suspense>
  );
}
