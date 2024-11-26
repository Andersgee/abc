import { cn } from "./utils/cn";

type Props = {
  className?: string;
};

export function Table({ className }: Props) {
  return <div className={cn("", className)}>table</div>;
}
