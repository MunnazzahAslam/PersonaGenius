"use client";

import { useResponse } from "@/providers/response-provider";
import { useRouter } from 'next/navigation';
import CustomToast from "@/components/global/custom-toast";
import { clusterData, edaFile, generateSummary } from "@/lib/api/results/service";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingSkeleton from "@/components/ui/loading-skeleton";

export default function Page() {
  const { setResponse } = useResponse();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Performing initial data processing...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setLoadingMessage("Performing EDA...");
  
        const edaResponse = await edaFile();
  
        if (edaResponse) {
          setLoadingMessage("Clustering data...");
          toast(CustomToast({ title: "Success", description: "Data cleaned and EDA successfully." }));
  
          const clusterResponse = await clusterData();
  
          if (clusterResponse) {
            setLoadingMessage("Generating summary and personas...");
            toast(CustomToast({ title: "Success", description: "Data clustered successfully." }));
  
            const summaryResponse = await generateSummary();
  
            if (summaryResponse) {
              setResponse(summaryResponse.response ? summaryResponse.response : summaryResponse);
              setLoadingMessage("");
              toast(CustomToast({ title: "Success", description: "Summary and personas generated successfully." }));
              router.push('/dashboard/cluster_summaries');
            }
          }
        }
      } catch (error: any) {
        toast(CustomToast({ title: "Error", description: error.message }));
        setIsLoading(false);
        setLoadingMessage("");
        router.push('/upload');
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <div className="min-h-96 flex items-center justify-center">
      {isLoading && <LoadingSkeleton message={loadingMessage} />}
    </div>
  );
}

