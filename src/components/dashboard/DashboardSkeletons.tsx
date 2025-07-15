
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="h-4 w-1/3 mb-2 bg-muted rounded animate-pulse" />
          <div className="h-8 w-1/2 mb-4 bg-muted rounded animate-pulse" />
          <div className="h-2 w-full bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="h-6 w-1/4 mb-2 bg-muted rounded animate-pulse" />
      <div className="h-4 w-1/3 mb-6 bg-muted rounded animate-pulse" />
      <div className="h-64 w-full rounded-lg bg-muted animate-pulse" />
    </CardContent>
  </Card>
);
