import { useEffect, useRef, useState } from "react";
import { TrpcProvider } from "./lib/trpc/provider";
import { initIndexedDB } from "./lib/db/init";
import { Posts } from "./components/posts";
import { Table } from "./components/table";

export default function App() {
  const isReady = useInitIndexedDb();

  if (!isReady) return <div>setting up idb</div>;

  return (
    <TrpcProvider>
      <Table />
      {/* 
      <Posts />
       */}
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
