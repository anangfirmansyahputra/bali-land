import { Skeleton } from "../ui/skeleton";

export default function LandplotCardSkeleton() {
  return (
    <section className="w-full relative plot h-fit">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <div className="mt-2 w-full space-y-1">
        <div className="flex items-start gap-2 justify-between">
            <Skeleton className="flex-1 h-[20px]" />
            <Skeleton className="max-w-[44px] w-[44px] h-[20px]" />
        </div>
        <Skeleton className="w-[60%] h-[20px]" />
        <Skeleton className="w-[50%] h-[20px]" />
        <Skeleton className="w-[40%] h-[20px]" />
      </div>
    </section>
  );
}
