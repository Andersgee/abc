import { cn } from "./utils/cn";
import { JSONE } from "./utils/jsone";
import { api } from "./lib/trpc/api";

type Props = {
  className?: string;
};

export function Table2({ className }: Props) {
  //const { data, isLoading } = trpc.greeting.useQuery({ hello: "mek" });
  const { data, isLoading } = api.greeting.useQuery();
  const { mutate, isPending } = api.nested.mut.useMutation({
    onMutate(variables) {
      return { some: "special context" };
    },
    onSuccess(data, variables, context) {
      console.log("onSuccess, data:", data);
      console.log("onSuccess,variables:", variables);
      console.log("onSuccess, context", context);
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
