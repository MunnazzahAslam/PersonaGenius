'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResponse } from '@/providers/response-provider';
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { response } = useResponse();
  const router = useRouter();

  const formatSummary = (summary: string) => {
    const summaryPoints = summary.split('*').filter(point => point.trim() !== '');
    return summaryPoints.map((point, index) => (
      <div key={index}>• {point.trim()}</div>
    ));
  };

  useEffect(() => {
    if (!response) {
      router.push("/upload");
    }
  }, [response, router]);

  return (
    <>{response &&
      <>
        <Typography variant="h3" sx={{ fontWeight: 'bold', ml: 1, mb: 2 }}>
          Cluster Summaries
        </Typography>
        {
          response && response.cluster_summaries && response.cluster_summaries.map((summary, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Cluster {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                {formatSummary(summary)}
              </CardContent>
            </Card>
          ))
        }</>}
    </>
  );
}
