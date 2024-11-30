import { useEffect, useRef, useState } from "react";

import { TrpcProvider } from "./lib/trpc/provider";
import { initIndexedDB } from "./lib/db/init";
import { Table4 } from "./table4";

export default function App() {
  const isReady = useInitIndexedDb();

  if (!isReady) return <div>setting up idb</div>;

  return (
    <TrpcProvider>
      <Table4 />
    </TrpcProvider>
  );
}

function useInitIndexedDb() {
  const didRun = useRef(false);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (!didRun.current) {
      void initIndexedDB().then(() => setIsReady(true));
      didRun.current = true;
    }
  }, []);

  return isReady;
}
