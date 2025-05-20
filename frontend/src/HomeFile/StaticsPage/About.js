import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Header from "../../CoreFile/Header";
import Footer from "../../CoreFile/Footer";
import { AboutHeroSection } from "./AboutHeroSection";
import  AboutSection  from "../AboutSection";
import  Overview  from "../Overview";

export const About = () => {
  const stats = [
    {
      number: "50K+",
      label: "Active Forex Traders",
      description: "A growing global community trusts GFM for smarter trading.",
    },
    {
      number: "100+",
      label: "Supported Currency Pairs",
      description: "Trade all major, minor, and exotic pairs with ease.",
    },
    {
      number: "$500M+",
      label: " Monthly Trading Volume",
      description: "High-volume trading powered by smart automation.",
    },
    {
      number: "99.9%",
      label: "  Bot Uptime & System Reliability",
      description: "Trade with confidence—anytime, anywhere.",
    },
  ];



  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const shapeRef = useRef(null);

  useEffect(() => {
    const rotateShape = () => {
      if (shapeRef.current) {
        // Increased rotation speed by multiplying the time factor by 8
        shapeRef.current.style.transform = `rotate(${
          ((Date.now() / 1000) * 8) % 360
        }deg)`;
        requestAnimationFrame(rotateShape);
      }
    };

    const animationId = requestAnimationFrame(rotateShape);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);
  return (
    <>
      <Header />
      <AboutHeroSection />
      <AboutSection/>
<Overview/>





      <Footer />
    </>
  );
};
