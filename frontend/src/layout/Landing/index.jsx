import React from 'react';
import Navbar from './components/Navbar';
import LandingHome from './components/LandingHome';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from 'component/Footer';

const Landing = () => {
  return (
    <div>
      <Navbar />

      <div id="About">
        <LandingHome />
      </div>

      <div id="Features">
        <Features />
      </div>

      <div id="Pricing">
        {/* <div style={{ height: '100vh', background: '#e3f2fd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
        {/* <h1>Pricing Section</h1> */}
        <Pricing />
        {/* </div> */}
      </div>

      <div id="Contact">
        {/* <div style={{ height: '100vh', background: '#fce4ec', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
        <Contact />
        {/* </div> */}
      </div>

      <Footer />
    </div>
  );
};

export default Landing;
