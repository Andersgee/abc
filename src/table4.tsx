import { cn } from "./utils/cn";
import { JSONE } from "./utils/jsone";
import { api } from "./lib/trpc/api";

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
