import { useState } from "react";
import { useIndexedDbMutation, useIndexedDbQuery } from "./use-indexed-db";
import { cn } from "./utils/cn";
import { JSONE } from "./utils/jsone";

type Props = {
  className?: string;
};

export function Table({ className }: Props) {
  const { data, isLoading } = useIndexedDbQuery("Bill");
  const { mutate } = useIndexedDbMutation("Bill");
  const [value, setValue] = useState("");

  return (
    <div className={cn("", className)}>
      <div>{isLoading ? "isLoading" : "not loading"}</div>
      <div>{JSONE.stringify(data)}</div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={() => {
          mutate({
            text: value,
            hehehe: {
              apa: 1,
              k: BigInt(7),
              b: new Uint8Array([1, 2, 3, 4]),
            },
          });
        }}
      >
        SAVE
      </button>
    </div>
  );
}
