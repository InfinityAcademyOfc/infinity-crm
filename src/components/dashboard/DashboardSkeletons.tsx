
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="relative overflow-hidden">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <Skeleton className="h-6 w-1/4 mb-2" />
      <Skeleton className="h-4 w-1/3 mb-6" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </CardContent>
  </Card>
);
