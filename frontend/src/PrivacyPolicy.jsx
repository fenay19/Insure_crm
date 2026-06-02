import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import Footer from 'component/Footer';
import Navbar from 'layout/Landing/components/Navbar';

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />

      {/* ✅ CONTENT AREA */}
      <Box mt={12} className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen py-20">
        <Container maxWidth="lg">
          {/* ✅ HERO HEADER */}
          <Box className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 pt-36 pb-20 text-center">
            <Typography variant="h3" fontWeight={800} className="text-white drop-shadow-lg">
              Privacy Policy
            </Typography>
            <Typography variant="body2" className="text-white opacity-90 mt-2">
              Last Updated: 28th Nov 2025
            </Typography>
          </Box>

          <Box className="bg-white shadow-2xl rounded-3xl p-10 border border-gray-200 space-y-8">
            <Typography variant="h6" fontWeight={700} className="text-blue-700 border-l-4 border-blue-600 pl-3">
              1. Introduction
            </Typography>
            <Typography variant="body2">
              Amika Softwares, a company duly incorporated under the Companies Act, 2013, bearing its registered office at 03, New Viraj
              Nagar, Near Chintamani Nagari No.1, Besa Road, Manewada, Nagpur – 440027, Contact No: +91 7722075447, Email:
              info@amikasoftwares.com (“Company”), owns and operates the website www.miraicrm.com and the associated web-based application
              (collectively referred to as the “MiraiCRM Platform”).
            </Typography>
            <Typography variant="body2">
              The Company provides CRM-related tools and services (“Service(s)”) to its users (“User(s)” or “you” or “your”).
            </Typography>
            <Typography variant="body2">
              By accessing or using the MiraiCRM Platform, you agree to the practices described in this Privacy Policy.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700} className="text-blue-700 border-l-4 border-blue-600 pl-3">
              2. Acceptance of This Privacy Policy
            </Typography>
            <Typography variant="body2">
              By using the MiraiCRM Platform or accessing any of the Services, through any device including mobile, you agree to be bound by
              the terms of this Privacy Policy and the Terms & Conditions.
            </Typography>
            <Typography variant="body2">
              You expressly consent to the collection, storage, processing, use, and disclosure of your personal information as described
              herein.
            </Typography>
            <Typography variant="body2">Please read this Privacy Policy carefully before using the Services.</Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700} className="text-blue-700 border-l-4 border-blue-600 pl-3">
              3. Scope of This Privacy Policy
            </Typography>
            <Typography variant="body2">This Privacy Policy explains:</Typography>
            <ul className="list-disc ml-8 text-sm">
              <li>What information we collect</li>
              <li>Why we collect it</li>
              <li>How we use it</li>
              <li>Under what circumstances we share it</li>
              <li>Your rights regarding your information</li>
            </ul>
            <Typography variant="body2">
              This Policy applies only to our own practices and does not apply to any third parties we do not own or control, including
              external websites, vendors, or platforms you may interact with through MiraiCRM.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700} className="text-blue-700 border-l-4 border-blue-600 pl-3">
              4. Changes to This Policy
            </Typography>
            <Typography variant="body2">Our Privacy Policy may be updated from time to time without prior notice.</Typography>
            <Typography variant="body2">
              We encourage you to periodically review the latest version available on www.miraicrm.com.
            </Typography>
            <Typography variant="body2">For any clarifications, you may contact us at info@amikasoftwares.com.</Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700} className="text-blue-700 border-l-4 border-blue-600 pl-3">
              1. Your Consent
            </Typography>
            <Typography variant="body2">
              By using the MiraiCRM Platform and Services, and/or submitting your information, you consent to the collection, usage,
              sharing, and disclosure of your information as per this Privacy Policy.
            </Typography>
            <Typography variant="body2">
              If any updates are made to the Privacy Policy, the revised version will be available on the MiraiCRM Platform.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700} className="text-blue-700 border-l-4 border-blue-600 pl-3">
              2. Types of Information We Collect
            </Typography>
            <Typography variant="body2">We collect the following categories of information:</Typography>

            <Typography variant="subtitle2" fontWeight={700}>
              A. Personal Information (identifies you):
            </Typography>
            <ul className="list-disc ml-8 text-sm">
              <li>Name</li>
              <li>Email address</li>
              <li>Mobile number</li>
              <li>Date of birth</li>
              <li>Company details (optional)</li>
              <li>Login/Account information</li>
            </ul>
            <Typography variant="body2">
              In cases where you provide information of third parties (e.g., team members, clients, or lead contacts), we assume you have
              their consent.
            </Typography>

            <Typography variant="subtitle2" fontWeight={700}>
              B. Non-Personal Information (does not identify you directly):
            </Typography>
            <ul className="list-disc ml-8 text-sm">
              <li>Demographic details</li>
              <li>Behavioral data</li>
              <li>Interests and usage patterns</li>
            </ul>

            <Typography variant="subtitle2" fontWeight={700}>
              C. Automatically Collected Information:
            </Typography>
            <ul className="list-disc ml-8 text-sm">
              <li>IP address</li>
              <li>Browser and device type</li>
              <li>Operating system</li>
              <li>Pages visited</li>
              <li>Access time</li>
              <li>Referral URLs</li>
            </ul>
            <Typography variant="body2">This helps us understand user behaviour and improve our Services.</Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700} className="text-blue-700 border-l-4 border-blue-600 pl-3">
              10. Contacts and Notices
            </Typography>
            <Typography variant="body2">
              ATTN: Data Protection Officer
              <br />
              Amika Softwares
              <br />
              03, New Viraj Nagar,
              <br />
              Near Chintamani Nagari No.1,
              <br />
              Besa Road, Manewada, Nagpur – 440027
              <br />
              Email: info@amikasoftwares.com
              <br />
              Phone: +91 7722075447
            </Typography>
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
