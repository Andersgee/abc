import { cn } from "./utils/cn";
import { JSONE } from "./utils/jsone";
import { api } from "./lib/trpc/api";
import { useRef } from "react";

type Props = {
  className?: string;
};

export function Table4({ className }: Props) {
  const utils = api.useUtils();
  const { data, isLoading } = api.table4.getAll.useQuery();
  const { data: data2, isLoading: isLoading2 } = api.table4.get.useQuery({
    id: 2,
  });

  const { mutate: add, isPending } = api.table4.add.useMutation({
    onSuccess(data) {
      utils.table4.invalidate();
      console.log("add, onSuccess, data:", data);
    },
    onError(error) {
      console.log("add, onError, error:", error);
    },
  });

  const { mutate: clear } = api.table4.clear.useMutation({
    onSuccess(data) {
      utils.table4.invalidate();
      console.log("clear, onSuccess, data:", data);
    },
    onError(error) {
      console.log("clear, onError, error:", error);
    },
  });

  return (
    <div className={cn("", className)}>
      <div>isLoading {isLoading ? "yep" : "nope"}</div>
      {data?.map((row) => (
        <div key={row.id} className="flex">
          <Input row={row} />
          <Delete row={row} />
        </div>
      ))}
      <div>data: {JSONE.stringify(data)}</div>

      <div>isLoading2 {isLoading2 ? "yep" : "nope"}</div>
      <div>data2: {JSONE.stringify(data2)}</div>

      <button
        className="p-3 bg-green-500"
        onClick={() => add({ hello: "from onclick" })}
      >
        ADD
      </button>
      <div>isPending {isPending ? "yep" : "nope"}</div>

      <button className="p-3 bg-red-400" onClick={() => clear()}>
        CLEAR
      </button>
    </div>
  );
}

function Input({ row }: { row: { id: number; hello: string } }) {
  const ref = useRef<HTMLInputElement>(null);

  const utils = api.useUtils();
  const { mutate } = api.table4.put.useMutation({
    onSuccess(data) {
      utils.table4.invalidate();
      console.log("put, onSuccess, data:", data);
    },
    onError(error) {
      console.log("put, onError, error:", error);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const str = ref.current?.value;
        if (str) {
          mutate({ id: row.id, hello: str });
        }
      }}
    >
      <input
        ref={ref}
        className="p-3 bg-neutral-200"
        defaultValue={row.hello}
      ></input>
    </form>
  );
}

function Delete({ row }: { row: { id: number; hello: string } }) {
  const utils = api.useUtils();
  const { mutate } = api.table4.delete.useMutation({
    onSuccess(data) {
      utils.table4.invalidate();
      console.log("delete, onSuccess, data:", data);
    },
    onError(error) {
      console.log("delete, onError, error:", error);
    },
  });

  return (
    <button
      className="p-2 bg-red-400 block"
      onClick={() => {
        mutate({ id: row.id });
      }}
    >
      delete
    </button>
  );
}
