import { toast } from "sonner";
import { apiClient } from "../apiService";
import CustomToast from "@/components/global/custom-toast";

export const uploadFile = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    toast(
      CustomToast({
        title: "Error",
        description: "Error uploading dataset.",
      })
    );
    throw error;
  }
}

export const edaFile = async () => {
  try {
    const response = await apiClient.get('/eda');
    return response.data;
  } catch (error) {
    toast(
      CustomToast({
        title: "Error",
        description: "Error uploading dataset.",
      })
    );
    throw error;
  }
}

export const clusterData = async () => {
  try {
    const response = await apiClient.get('/cluster');
    return response.data;
  } catch (error) {
    toast(
      CustomToast({
        title: "Error",
        description: "Error clustering data.",
      })
    );
    throw error;
  }
}

export const generateSummary = async () => {
  try {
    const response = await apiClient.get('/summary');
    return response.data;
  } catch (error) {
      toast(
        CustomToast({
          title: "Error",
          description: "Error generating summary and personas.",
        })
      );
      throw error;
  }
};

export const generateAnalytics = async () => {
  try {
    const response = await apiClient.get('/analytics');
    return response.data;
  } catch (error) {
    toast(
      CustomToast({
        title: "Error",
        description: "Error fetching analytics.",
      })
    );
    throw error;
  }
}

export const uploadSampleDataset = async (filename: string, selectedFeatures: string[]) => {
  try {
    const response = await fetch(`/datasets/${filename}`);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, filename);
    formData.append('selected_features', JSON.stringify(selectedFeatures));

    const uploadResponse = await uploadFile(formData);
    return uploadResponse;

  } catch (error) {
    toast(
      CustomToast({
        title: "Error",
        description: "Error uploading the dataset.",
      })
    );
    throw error;
  }
}








