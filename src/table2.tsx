import { cn } from "./utils/cn";
import { JSONE } from "./utils/jsone";
import { trpc } from "./lib/trpc/client/trpc";

type Props = {
  className?: string;
};

export function Table2({ className }: Props) {
  //const { data, isLoading } = trpc.greeting.useQuery({ hello: "mek" });
  const { data, isLoading } = trpc.greeting.useQuery();
  const { mutate, isPending } = trpc.nested.mut.useMutation({
    onSuccess(data, variables, context) {
      console.log("onSuccess", data, variables, context);
    },
  });

  return (
    <div className={cn("", className)}>
      <div>isLoading {isLoading ? "yep" : "nope"}</div>
      <div>data: {JSONE.stringify(data)}</div>
      <button
        onClick={async () => {
          mutate({ stuff: "apa" });
        }}
      >
        CLICK ME
      </button>
      <div>isPending {isPending ? "yep" : "nope"}</div>
    </div>
  );
}
