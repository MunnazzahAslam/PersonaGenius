import {
  BarChart,
  PieChart,
  Upload,
  Users2
} from "lucide-react";

export type StepCard = {
  title: string;
  description: String;
  header: React.ReactNode;
  className: string;
  icon: React.ReactNode;
  key: string;
};

export const icons = [
  {
    value: "results",
    label: "Results",
    path: PieChart,
  },
  {
    value: "personas",
    label: "Personas",
    path: Users2,
  },
  {
    value: "upload",
    label: "Upload",
    path: Upload,
  },
  {
    value: "chart",
    label: "chart",
    path: BarChart,
  }
];

export const sidebarOpt: SidebarOption[] = [
  {
    heading: "",
    items: [
      { name: 'Upload new dataset', icon: 'upload', link: '/upload' },
      { name: "Dashboard", icon: "chart", link: "/dashboard/analytics" },
      { name: "Cluster Summaries", icon: "results", link: "/dashboard/cluster_summaries" },
      { name: "Customer Personas", icon: "personas", link: "/dashboard/cluster_personas" },
      ],
  },
  {
    heading: "",
    items: [],
  },
];

export type CustomerPersona = {
  demographics: {
    name: string;
    age: number;
    gender: string;
    marital_status: string;
    family_structure: string;
    income_level: string;
    location: string;
    occupation: string;
  };
  psychographics: {
    values_and_beliefs: string;
    interests_and_hobbies: string;
    lifestyle_choices: string;
    technology_usage: string;
    brand_preferences: string;
    community_engagement: string;
    health_and_wellness: string;
    family_dynamics: string;
    financial_goals: string;
    media_consumption: string;
    environmental_consciousness: string;
    cultural_influences: string;
  };
  needs_and_pain_points: {
    needs: string;
    pain_points: string;
  };
  behavioral_data: {
    behavioral_drivers: string;
    obstacles_to_purchasing: string;
    expectations: string;
    marketing_suggestions: string;
  };
  avatar: string;
};

export type ClusteringResponseObject = {
  cluster_summaries: string[];
  cluster_personas: CustomerPersona[];
}
