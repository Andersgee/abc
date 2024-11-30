import { cn } from "./utils/cn";
import { JSONE } from "./utils/jsone";
import { api } from "./lib/trpc/api";
import { useRef } from "react";

type Props = {
  className?: string;
};

export function Table4({ className }: Props) {
  const { data, isLoading } = api.table4.getAll.useQuery();

  return (
    <div className={cn("", className)}>
      <div>isLoading {isLoading ? "yep" : "nope"}</div>
      {data?.map((row) => (
        <div key={row.id} className="flex">
          <InputPut row={row} />
          <ButtonDelete row={row} />
        </div>
      ))}
      <InputAdd />

      <ButtonClear />
      <pre>data: {JSONE.stringify(data, 2)}</pre>
    </div>
  );
}

function InputPut({ row }: { row: { id: number; hello: string } }) {
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
        if (str !== undefined) {
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

function InputAdd() {
  const ref = useRef<HTMLInputElement>(null);

  const utils = api.useUtils();
  const { mutate } = api.table4.add.useMutation({
    onSuccess(data) {
      utils.table4.invalidate();
      console.log("add, onSuccess, data:", data);
    },
    onError(error) {
      console.log("add, onError, error:", error);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (ref.current?.value) {
          mutate({ hello: ref.current.value });
          ref.current.value = "";
        }
      }}
    >
      <input
        ref={ref}
        className="p-3 bg-neutral-200"
        defaultValue=""
        placeholder="add"
      ></input>
    </form>
  );
}

function ButtonDelete({ row }: { row: { id: number; hello: string } }) {
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

function ButtonClear() {
  const utils = api.useUtils();
  const { mutate } = api.table4.clear.useMutation({
    onSuccess(data) {
      utils.table4.invalidate();
      console.log("clear, onSuccess, data:", data);
    },
    onError(error) {
      console.log("clear, onError, error:", error);
    },
  });

  return (
    <button
      className="p-2 bg-red-800 block"
      onClick={() => {
        mutate();
      }}
    >
      CLEAR ALL
    </button>
  );
}
