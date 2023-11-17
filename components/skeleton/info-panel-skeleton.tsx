import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import LandplotCardSkeleton from "./landplot-card-skeleton";

export default function InfoPanelSkeleton() {
  return (
    <div
    className="fixed z-[60] h-[calc(100vh-10px)] sm:h-[calc(100vh-88px)] lg:w-[60%] xl:w-[50%] 2xl:w-[30%] top-0 mt-[88px] left-3 right-3 "
  >
    <Card
      role="button"
      className={`flex flex-col rounded-none rounded-t-lg`}
    >
      <CardHeader className="py-2 px-5">
        <Skeleton className="w-full h-[40px]" />
      </CardHeader>
      <CardContent
        className={`p-0 pr-2 h-[calc(100vh-150px)] sm:h-[calc(100vh-88px)] mx-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5`}
      >
        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((plot) => (
          <LandplotCardSkeleton key={plot} />
        ))}
      </CardContent>
    </Card>
  </div>
  )
}
