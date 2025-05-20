import React from "react";
import Header from "../CoreFile/Header";
import Footer from "../CoreFile/Footer";
import Faq from "./Faq";
import Popup from "./Popup";
import { Process } from "./Process";
import  TradingAccounts  from "./TradingAccounts";
import  Blogs  from "./Blogs";
import  AboutSection from "./AboutSection";
import { TradingChart } from "./TradingChart";
import  HeroSection    from "./HeroSection";

import { Botsection } from "./Botsection";
import  Overview  from "./Overview";

import Packages from "./StaticsPage/Packagessection";
import { Rooms } from "./Rooms";


export const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <AboutSection/>
      <Overview/>
      {/* <Rooms/> */}
      <Process/>
      <TradingAccounts/>
      <Packages/>
      <Blogs/>
      <Faq />
      <Footer />
    </>
  );
};
