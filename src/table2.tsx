import { cn } from "./utils/cn";
import { JSONE } from "./utils/jsone";
import { api } from "./lib/trpc/api";

type Props = {
  className?: string;
};

export function Table2({ className }: Props) {
  const { data, isLoading } = api.userList.useQuery({ hello: "mek" });

  return (
    <div className={cn("", className)}>
      <div>idLoading {isLoading ? "yep" : "nope"}</div>
      <div>data: {JSONE.stringify(data)}</div>
      <div>{JSONE.stringify(data)}</div>
    </div>
  );
}
