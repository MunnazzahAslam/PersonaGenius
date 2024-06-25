"use client";
import Image from "next/image";
import { BarChart3, Database, PieChart } from "lucide-react";
import Link from "next/link";
import Steps from "@/components/site/steps/steps";
import { motion, useInView } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRef } from "react";
import Footer from "@/components/site/footer";

export default function Home() {
  const { theme } = useTheme();
  const previewRef = useRef(null);

  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);

  const isStep1inView = useInView(step1Ref, { once: true });
  const isStep2inView = useInView(step2Ref, { once: true });
  const isStep3inView = useInView(step3Ref, { once: true });


  const UploadDataHeader = () => {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
      >
        <motion.div className="w-full bg-white dark:bg-primary/40 border border-neutral-100 dark:border-white/[0.2] rounded-2xl p-4">
          <div className="my-4 grid gap-5 place-content-center">
            <div className="text-xl font-bold">Upload or Select Sample Dataset</div>
            <div className="flex flex-row rounded-xl border border-neutral-200 dark:border-primary/[0.2] p-2 items-center space-x-2 bg-white dark:bg-primary/40 w-[240px] lg:h-[200px] lg:w-[300px]">
              <div className="w-full bg-gray-100 h-[130px] rounded-lg dark:bg-primary/60" />
            </div>
            <Button className="font-bold">Upload Data</Button>
            <Button className="font-bold">Use Sample Data</Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const AnalyzeDataHeader = () => {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
      >
        <motion.div className="w-full bg-white dark:bg-primary/40 border border-neutral-100 dark:border-white/[0.2] rounded-2xl p-4">
          <div className="my-4 grid gap-5 place-content-center">
            <div className="text-xl font-bold">Select Features & Analyze Data</div>
            <div className="flex flex-row rounded-xl border border-neutral-200 dark:border-primary/[0.2] p-2 items-center space-x-2 bg-white dark:bg-primary/40 w-[240px] lg:h-[200px] lg:w-[300px]">
              <div className="w-full bg-gray-100 h-[140px] rounded-lg dark:bg-primary/60" />
            </div>
            <Button className="font-bold">Perform Clustering</Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const ViewResultsHeader = () => {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
      >
        <motion.div className="w-full bg-white dark:bg-primary/40 border border-neutral-100 dark:border-white/[0.2] rounded-2xl p-4">
          <div className="my-4 grid gap-5 place-content-center">
            <div className="text-xl font-bold">Review and Download Results</div>
            <div className="flex flex-row rounded-xl border border-neutral-200 dark:border-primary/[0.2] p-2 items-center space-x-2 bg-white dark:bg-primary/40 w-[240px] lg:h-[200px] lg:w-[300px]">
              <div className="w-full bg-gray-100 h-[130px] rounded-lg dark:bg-primary/60" />
            </div>
            <Button className="font-bold">Download Results</Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const stepCards = [
    {
      title: "Upload or Select Sample Data",
      description: "Start by uploading your dataset or using one of our sample datasets.",
      header: <UploadDataHeader />,
      className: "w-full max-w-xs lg:max-w-lg mx-auto",
      icon: <Database />,
      key: "1",
    },
    {
      title: "Select Features & Analyze Data",
      description: "Choose up to 5 features for analysis and let our tool do the rest.",
      header: <AnalyzeDataHeader />,
      className: "w-full max-w-xs lg:max-w-lg mx-auto",
      icon: <PieChart />,
      key: "2",
    },
    {
      title: "Review and Download Results",
      description: "View detailed cluster summaries and personas, and download your results.",
      header: <ViewResultsHeader />,
      className: "w-full max-w-xs lg:max-w-lg mx-auto",
      icon: <BarChart3 />,
      key: "3",
    },
  ];

  return (
    <>
      {/**Grid and Linear Gradient */}
      <section className="absolute inset-0 z-0">
        <div className="h-[50rem] w-full dark:bg-dot-white/[0.1] bg-dot-black/[0.1] relative flex items-center justify-center">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-gradient-to-b from-[#1C65EE]/50 to-bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]" />
        </div>
      </section>
      {/**Header Section */}
      <section className="relative z-10 mx-10 mt-28">
        <div className="flex flex-col gap-y-6 mt-10 p-0 lg:p-10 text-center items-center z-20 bg-clip-text">
          <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
            <h1 className="text-5xl lg:text-6xl lh-2 font-bold text-center" style={{ lineHeight: 1.4 }}>
              Elevate Your Strategy: Ecommerce Customer Segmentation Made Easy
            </h1>
          </div>
          <p className="text-muted-foreground text-md">
            Unlock valuable insights with PersonaGenius: Effortlessly segment your customers.
          </p>

          <Link href="/upload">
            <motion.button
              className="w-fit flex flex-row gap-2 rounded-lg bg-primary px-10 py-4 font-medium text-white text-sm items-center"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ bounceDamping: 10 }}
            >
              Get Started Now
            </motion.button>
          </Link>

          <div
            ref={previewRef}
            className="hidden md:block px-4 md:p-10 mt-20 bg-card/40 rounded-2xl border border-muted backdrop-blur-2xl dark:bg-dot-white/[0.1] bg-dot-black/[0.1] mx-10"
          >
            <Image
              src={
                theme === "dark"
                  ? "/assets/preview.png"
                  : "/assets/previewlight.png"
              }
              width={1200}
              height={1200}
              alt="preview image"
              className="rounded-2xl lg:max-w-[1000px] "
            />
          </div>
        </div>
      </section>
      <section className="z-10 flex-col gap-4 mt-20 justify-center px-4 xl:px-48 mb-10">
        <h2 className="text-5xl font-bold text-center my-14 leading-tight text-secondary">
          Start Your Journey Now!
        </h2>

        <div className="">
          {/* Step 1 */}
          <div
            className="relative py-10 lg:py-0"
            ref={step1Ref}
            style={{
              transform: isStep1inView ? "none" : "translateX(200px)",
              opacity: isStep1inView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <Steps
              title="Upload or Select Sample Data"
              description="Start by uploading your dataset or using one of our sample datasets."
              stepCard={stepCards[0]}
              className="md:order-last"
            />
          </div>
          {/* Step 2 */}
          <div
            className="relative"
            ref={step2Ref}
            style={{
              transform: isStep2inView ? "none" : "translateX(-200px)",
              opacity: isStep2inView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <Steps
              title="Select Features & Analyze Data"
              description="Choose up to 5 features for analysis and let our tool do the rest."
              stepCard={stepCards[1]}
            />
          </div>
          {/* Step 3 */}
          <div
            className="relative py-10 lg
            "
            ref={step3Ref}
            style={{
              transform: isStep3inView ? "none" : "translateX(200px)",
              opacity: isStep3inView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <Steps
              title="Review and Download Results"
              description="View detailed cluster summaries and personas, and download your results."
              stepCard={stepCards[2]}
              className="md:order-last"
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
