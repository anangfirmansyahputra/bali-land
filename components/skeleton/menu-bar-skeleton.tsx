import { Skeleton } from "../ui/skeleton"

export default function MenuBarSkeleton() {
  return (
    <div className="absolute z-[53] w-full">
      <div className="m-3 hidden sm:flex items-center gap-5 justify-end sm:justify-between h-full">
        <div className="shadow-xl bg-white p-3 flex-1 rounded-lg hidden sm:flex items-center justify-between">
          {/* <h1 className="text-slate-800 text-base lg:text-2xl font-extrabold">Island.Properties</h1> */}
          <Skeleton className="h-[32px] w-[200px]" />
          <div className="flex">
            <Skeleton className="w-[108px] max-w-[108px] h-[40px] mr-2" />
            <Skeleton className="w-[170px] max-w-[170px] h-[40px]" />
          </div>
        </div>
        {/* <Skeleton className="w-10 h-10 rounded-full" /> */}
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Skeleton className="w-6 h-6 rounded-full" />
        </div>
      </div>
      <div className="w-fit fixed right-3 top-6 sm:hidden flex gap-2">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Skeleton className="w-6 h-6 rounded-full" />
        </div>
      </div>
    </div>
  )
}
