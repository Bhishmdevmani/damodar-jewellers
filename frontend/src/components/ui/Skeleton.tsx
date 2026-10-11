import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[2px] bg-[#191713]/80 border border-[rgba(201,164,92,0.08)]',
        className
      )}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col space-y-4 p-4 border border-[rgba(201,164,92,0.12)] bg-[#11100E]/60">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="pt-2 flex justify-between items-center">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}
