import { cn } from "./utils/cn";
import { JSONE } from "./utils/jsone";
import { idb } from "./lib/trpc/hook";
import { useEffect, useRef, useState } from "react";
import type { Table4 as Table4Type } from "./lib/db/schema";
import { ButtonDanger } from "./components/button";
import { Input } from "./components/input";
import { uuid } from "./utils/uuid";

type Props = {
  className?: string;
};

export function Table4({ className }: Props) {
  const { data, isLoading } = idb.table4.getAll.useQuery();

  return (
    <div className={cn("space-y-2", className)}>
      <div>isLoading {isLoading ? "yep" : "nope"}</div>
      <Count />
      {data?.map((row) => (
        <div key={row.id} className="flex items-center gap-2">
          <InputPut row={row} />
          <ButtonDelete id={row.id} />
        </div>
      ))}
      <InputAdd />

      <ButtonClear />
      <pre>data: {JSONE.stringify(data, 2)}</pre>

      <Test />
      <Test2 />
    </div>
  );
}

function Test() {
  const { data } = idb.table4.getAllWithCursor.useQuery({});

  return <div>{JSONE.stringify(data, 2)}</div>;
}
function Test2() {
  const [value, setValue] = useState("stu");
  const utils = idb.useUtils();
  const { data } = idb.table4.filter.useQuery((x) => x.hello.includes(value));
  useEffect(() => {
    utils.table4.filter.refetch();
  }, [value]);

  return (
    <div>
      <div>Sök</div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-56"
        placeholder="add"
      />
      {JSONE.stringify(data, 2)}
    </div>
  );
}

function InputPut({ row }: { row: Table4Type }) {
  const ref = useRef<HTMLInputElement>(null);

  const utils = idb.useUtils();
  const { mutate } = idb.table4.put.useMutation({
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
      <Input ref={ref} defaultValue={row.hello} className="w-56" />
    </form>
  );
}

function InputAdd() {
  const ref = useRef<HTMLInputElement>(null);

  const utils = idb.useUtils();
  const { mutate } = idb.table4.add.useMutation({
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
      className="max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();

        if (ref.current?.value) {
          mutate({ hello: ref.current.value, id: uuid() });
          ref.current.value = "";
        }
      }}
    >
      <Input ref={ref} defaultValue="" className="w-56" placeholder="add" />
    </form>
  );
}

function ButtonDelete({ id }: { id: string }) {
  const utils = idb.useUtils();
  const { mutate } = idb.table4.delete.useMutation({
    onSuccess(data) {
      utils.table4.invalidate();
      console.log("delete, onSuccess, data:", data);
    },
    onError(error) {
      console.log("delete, onError, error:", error);
    },
  });

  return <ButtonDanger onClick={() => mutate({ id })}>delete</ButtonDanger>;
}

function ButtonClear() {
  const utils = idb.useUtils();
  const { mutate } = idb.table4.clear.useMutation({
    onSuccess(data) {
      utils.table4.invalidate();
      console.log("clear, onSuccess, data:", data);
    },
    onError(error) {
      console.log("clear, onError, error:", error);
    },
  });

  return <ButtonDanger onClick={() => mutate()}>CLEAR ALL</ButtonDanger>;
}

function Count() {
  const { data } = idb.table4.count.useQuery();

  return <div>count:{data}</div>;
}
