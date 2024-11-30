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
    onSuccess(data, variables, context) {
      utils.table4.invalidate();
      console.log("onSuccess, data:", data);
    },
    onError(error, variables, context) {
      console.log("onError, error:", error);
    },
  });

  return (
    <div className={cn("", className)}>
      <div>isLoading {isLoading ? "yep" : "nope"}</div>
      <div>data: {JSONE.stringify(data)}</div>

      <div>isLoading2 {isLoading2 ? "yep" : "nope"}</div>
      <div>data2: {JSONE.stringify(data2)}</div>

      <button onClick={() => add({ hello: "from onclick" })}>CLICK ME</button>
      <div>isPending {isPending ? "yep" : "nope"}</div>
    </div>
  );
}
