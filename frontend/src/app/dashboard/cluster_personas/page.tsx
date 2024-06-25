"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useResponse } from "@/providers/response-provider";
import Avatar from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import generatePDF from "react-to-pdf";
import { CustomerPersona } from "@/lib/constants";
import { Typography } from "@mui/material";

export default function Page() {
  const { response } = useResponse();
  const [showPdfContent, setShowPdfContent] = useState(false);

  const getTargetElement = () => document.getElementById("container");

  const downloadPdf = () => {
    setShowPdfContent(true);
  };

  useEffect(() => {
    if (showPdfContent) {
      generatePDF(getTargetElement, { filename: "customer-persona?.pdf" });
      setShowPdfContent(false);
    }
  }, [showPdfContent]);

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Typography variant="h3" sx={{ fontWeight: "bold", ml: 1 }}>
          Customer Personas
        </Typography>
        <motion.div className="bg-transparent p-4 flex justify-end">
          <Button onClick={downloadPdf} className="font-bold">Download Personas</Button>
        </motion.div>
      </div>
      <Tabs className="TabsRoot" defaultValue="0">
        <TabsList className="TabsList" aria-label="Customer Personas">
          {response && response.cluster_personas && response.cluster_personas.map((_persona: CustomerPersona, index: number) => (
            <TabsTrigger className="TabsTrigger" key={index} value={index.toString()}>
              Cluster {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>
        {response && response.cluster_personas && response.cluster_personas.map((persona: CustomerPersona, index: number) => (
          <TabsContent className="TabsContent" key={index} value={index.toString()}>

            <div className="flex justify-start items-center my-12">
              <Avatar svgContent={persona?.avatar} />
              <h2 className="text-2xl font-bold mt-8 mb-4 mx-4">{persona?.demographics?.name}</h2>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Demographic Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="my-2"><strong>🎂 Age:</strong> {persona?.demographics?.age}</p>
                <p className="my-2"><strong>⚤ Gender:</strong> {persona?.demographics?.gender}</p>
                <p className="my-2"><strong>💍 Marital Status:</strong> {persona?.demographics?.marital_status}</p>
                <p className="my-2"><strong>👪 Family Structure:</strong> {persona?.demographics?.family_structure}</p>
                <p className="my-2"><strong>💰 Income Level:</strong> {persona?.demographics?.income_level}</p>
                <p className="my-2"><strong>🌍 Location:</strong> {persona?.demographics?.location}</p>
                <p className="my-2"><strong>💼 Occupation:</strong> {persona?.demographics?.occupation}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Psychographics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="my-2"><strong>💡 Values and Beliefs:</strong> {persona?.psychographics?.values_and_beliefs}</p>
                <p className="my-2"><strong>🎨 Interests and Hobbies:</strong> {persona?.psychographics?.interests_and_hobbies}</p>
                <p className="my-2"><strong>🏡 Lifestyle Choices:</strong> {persona?.psychographics?.lifestyle_choices}</p>
                <p className="my-2"><strong>💻 Technology Usage:</strong> {persona?.psychographics?.technology_usage}</p>
                <p className="my-2"><strong>🛍️ Brand Preferences:</strong> {persona?.psychographics?.brand_preferences}</p>
                <p className="my-2"><strong>👥 Community Engagement:</strong> {persona?.psychographics?.community_engagement}</p>
                <p className="my-2"><strong>💪 Health and Wellness:</strong> {persona?.psychographics?.health_and_wellness}</p>
                <p className="my-2"><strong>👨‍👩‍👧‍👦 Family Dynamics:</strong> {persona?.psychographics?.family_dynamics}</p>
                <p className="my-2"><strong>💰 Financial Goals:</strong> {persona?.psychographics?.financial_goals}</p>
                <p className="my-2"><strong>📺 Media Consumption:</strong> {persona?.psychographics?.media_consumption}</p>
                <p className="my-2"><strong>🌱 Environmental Consciousness:</strong> {persona?.psychographics?.environmental_consciousness}</p>
                <p className="my-2"><strong>🌍 Cultural Influences:</strong> {persona?.psychographics?.cultural_influences}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Needs and Pain Points</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="my-2"><strong>🛒 Needs:</strong> {persona?.needs_and_pain_points?.needs}</p>
                <p className="my-2"><strong>😩 Pain Points:</strong> {persona?.needs_and_pain_points?.pain_points}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Behavioral Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="my-2"><strong>🚀 Behavioral Drivers:</strong> {persona?.behavioral_data?.behavioral_drivers}</p>
                <p className="my-2"><strong>🚧 Obstacles to Purchasing:</strong> {persona?.behavioral_data?.obstacles_to_purchasing}</p>
                <p className="my-2"><strong>🔍 Expectations:</strong> {persona?.behavioral_data?.expectations}</p>
                <p className="my-2"><strong>📣 Marketing suggestions:</strong> {persona?.behavioral_data?.marketing_suggestions}</p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div id="container">
        {showPdfContent && response && response.cluster_personas && response.cluster_personas.map((persona: CustomerPersona, index: number) => (
          <div key={index}>
            <div className="flex justify-start items-center my-12">
              <Avatar svgContent={persona?.avatar} />
              <h2 className="text-2xl font-bold mt-8 mb-4 mx-4">{persona?.demographics?.name}</h2>
            </div>
            {persona?.demographics && <Card>
              <CardHeader>
                <CardTitle>Demographic Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="my-2"><strong>🎂 Age:</strong> {persona?.demographics.age}</p>
                <p className="my-2"><strong>⚤ Gender:</strong> {persona?.demographics.gender}</p>
                <p className="my-2"><strong>💍 Marital Status:</strong> {persona?.demographics.marital_status}</p>
                <p className="my-2"><strong>👪 Family Structure:</strong> {persona?.demographics.family_structure}</p>
                <p className="my-2"><strong>💰 Income Level:</strong> {persona?.demographics.income_level}</p>
                <p className="my-2"><strong>🌍 Location:</strong> {persona?.demographics.location}</p>
                <p className="my-2"><strong>💼 Occupation:</strong> {persona?.demographics.occupation}</p>
              </CardContent>
            </Card>}

            {persona?.psychographics && <Card>
              <CardHeader>
                <CardTitle>Psychographics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="my-2"><strong>💡 Values and Beliefs:</strong> {persona?.psychographics?.values_and_beliefs}</p>
                <p className="my-2"><strong>🎨 Interests and Hobbies:</strong> {persona?.psychographics?.interests_and_hobbies}</p>
                <p className="my-2"><strong>🏡 Lifestyle Choices:</strong> {persona?.psychographics?.lifestyle_choices}</p>
                <p className="my-2"><strong>💻 Technology Usage:</strong> {persona?.psychographics?.technology_usage}</p>
                <p className="my-2"><strong>🛍️ Brand Preferences:</strong> {persona?.psychographics?.brand_preferences}</p>
                <p className="my-2"><strong>👥 Community Engagement:</strong> {persona?.psychographics?.community_engagement}</p>
                <p className="my-2"><strong>💪 Health and Wellness:</strong> {persona?.psychographics?.health_and_wellness}</p>
                <p className="my-2"><strong>👨‍👩‍👧‍👦 Family Dynamics:</strong> {persona?.psychographics?.family_dynamics}</p>
                <p className="my-2"><strong>💰 Financial Goals:</strong> {persona?.psychographics?.financial_goals}</p>
                <p className="my-2"><strong>📺 Media Consumption:</strong> {persona?.psychographics?.media_consumption}</p>
                <p className="my-2"><strong>🌱 Environmental Consciousness:</strong> {persona?.psychographics?.environmental_consciousness}</p>
                <p className="my-2"><strong>🌍 Cultural Influences:</strong> {persona?.psychographics?.cultural_influences}</p>
              </CardContent>
            </Card>}

            {persona?.needs_and_pain_points && <Card>
              <CardHeader>
                <CardTitle>Needs and Pain Points</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="my-2"><strong>🛒 Needs:</strong> {persona?.needs_and_pain_points?.needs}</p>
                <p className="my-2"><strong>😩 Pain Points:</strong> {persona?.needs_and_pain_points?.pain_points}</p>
              </CardContent>
            </Card>}

            {persona?.behavioral_data && <Card>
              <CardHeader>
                <CardTitle>Behavioral Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="my-2"><strong>🚀 Behavioral Drivers:</strong> {persona?.behavioral_data?.behavioral_drivers}</p>
                <p className="my-2"><strong>🚧 Obstacles to Purchasing:</strong> {persona?.behavioral_data?.obstacles_to_purchasing}</p>
                <p className="my-2"><strong>🔍 Expectations:</strong> {persona?.behavioral_data?.expectations}</p>
                <p className="my-2"><strong>📣 Marketing suggestions:</strong> {persona?.behavioral_data?.marketing_suggestions}</p>
              </CardContent>
            </Card>}
          </div>
        ))}
      </div>
    </>
  );
}
