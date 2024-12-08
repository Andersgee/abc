import { useRef, useState } from "react";
import { idbapi, RouterOutputs } from "../lib/trpc/hook";
import { Input } from "./input";
import { ButtonDanger } from "./button";
import { cn } from "../utils/cn";

type Props = {
  className?: string;
};

export function Posts({ className }: Props) {
  return (
    <div className={cn("space-y-2", className)}>
      <List />
      <InputAdd />
    </div>
  );
}

function List() {
  const [value, setValue] = useState("");
  const { data } = idbapi.post.search.useQuery({ value });

  //const isSearching = isFetching && !isLoading; //fetching but not first time
  return (
    <div className="space-y-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-56"
        placeholder="Search"
      />

      <div className="space-y-2">
        {data?.map((post) => (
          <div key={post.key} className="flex gap-2">
            <InputPut row={post} />
            <ButtonDelete id={post.key} />
          </div>
        ))}
      </div>
    </div>
  );
}

function InputPut({ row }: { row: RouterOutputs["post"]["search"][number] }) {
  const ref = useRef<HTMLInputElement>(null);

  const utils = idbapi.useUtils();
  const { mutate } = idbapi.post.update.useMutation({
    onSuccess(data) {
      utils.post.invalidate();
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
          mutate({ key: row.key, text: str });
        }
      }}
    >
      <Input ref={ref} defaultValue={row.text} className="w-56" />
    </form>
  );
}

function InputAdd() {
  const ref = useRef<HTMLInputElement>(null);

  const utils = idbapi.useUtils();
  const { mutate } = idbapi.post.create.useMutation({
    onSuccess(data) {
      utils.post.invalidate();
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
          mutate({ text: ref.current.value });
          ref.current.value = "";
        }
      }}
    >
      <Input ref={ref} defaultValue="" className="w-56" placeholder="add" />
    </form>
  );
}

function ButtonDelete({ id }: { id: number }) {
  const utils = idbapi.useUtils();
  const { mutate } = idbapi.post.remove.useMutation({
    onSuccess(data) {
      utils.post.invalidate();
      console.log("delete, onSuccess, data:", data);
    },
    onError(error) {
      console.log("delete, onError, error:", error);
    },
  });

  return <ButtonDanger onClick={() => mutate({ key: id })}>X</ButtonDanger>;
}
