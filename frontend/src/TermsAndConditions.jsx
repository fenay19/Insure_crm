import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import Footer from 'component/Footer';
import Navbar from 'layout/Landing/components/Navbar';

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />

      {/* ✅ CONTENT AREA (navbar margin preserved) */}
      <Box mt={12} className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen py-20">
        <Container maxWidth="lg">
          {/* ✅ HERO HEADER */}
          <Box className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 pt-36 pb-20 text-center rounded-3xl shadow-xl mb-10">
            <Typography variant="h3" fontWeight={800} className="text-white drop-shadow-lg">
              Terms & Conditions
            </Typography>
            <Typography variant="body2" className="text-white opacity-90 mt-2">
              For miraiCRM (Product of Amika Softwares)
            </Typography>
          </Box>

          {/* ✅ MAIN CONTENT CARD */}
          <Box className="bg-white shadow-2xl rounded-3xl p-10 border border-gray-200 space-y-6">
            <Typography variant="body2" paragraph>
              Welcome to miraiCRM, a cloud-based Customer Relationship Management platform (“Platform”) owned and operated by Amika
              Softwares (“Company”). By accessing, using, subscribing to, or registering on miraiCRM, you agree to abide by the following
              Terms & Conditions, along with all policies, guidelines, and rules referenced herein.
            </Typography>

            <Typography variant="body2" paragraph>
              These Terms constitute a legally binding agreement between you (the “User”/“Client”) and Amika Softwares regarding your use of
              miraiCRM and its services.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              1. Modification of Terms & Conditions
            </Typography>
            <Typography variant="body2" paragraph>
              Amika Softwares reserves the right to modify, update, or replace any part of these Terms & Conditions at any time. If changes
              are made, they will be posted on www.miraicrm.com or communicated through your registered account.
            </Typography>
            <Typography variant="body2" paragraph>
              Your continued use of miraiCRM after such changes implies your acceptance of the updated Terms & Conditions. You are advised
              to review them periodically.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              2. Eligibility
            </Typography>
            <Typography variant="body2">To use miraiCRM:</Typography>
            <ul className="list-disc ml-8 text-sm space-y-1">
              <li>Users must be natural or legal persons residing in India or abroad where SaaS platforms are legally permitted.</li>
              <li>Users must be competent to enter into a legally binding contract as per Indian Contract Act, 1872.</li>
              <li>Individuals below 18 years of age are not permitted to register or use miraiCRM.</li>
              <li>Corporate entities must ensure their authorised representatives use the platform responsibly.</li>
            </ul>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              3. Our Rights
            </Typography>
            <Typography variant="body2">Amika Softwares reserves the right, at its sole discretion, to:</Typography>
            <ul className="list-decimal ml-8 text-sm space-y-1">
              <li>Restrict, suspend, or terminate your access to the Platform or specific features.</li>
              <li>Modify, discontinue, or disable any part of the Platform without prior notice.</li>
              <li>Reject, remove, or block any data, content, files, or material submitted by users.</li>
              <li>Limit storage, usage, API calls, number of users, or other functionalities.</li>
              <li>Deactivate or delete user accounts inactive for a long period.</li>
              <li>Establish usage and operational limits for performance, security, and compliance.</li>
            </ul>
            <Typography variant="body2" paragraph className="mt-2">
              Amika Softwares holds no liability for any loss arising due to such actions.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              4. Intellectual Property
            </Typography>

            <Typography variant="subtitle2" fontWeight={700}>
              4.1 Ownership
            </Typography>
            <Typography variant="body2" paragraph>
              All content, code, design, brand elements, modules, interfaces, graphics, workflows, and intellectual property within miraiCRM
              are exclusively owned by Amika Softwares.
            </Typography>

            <Typography variant="subtitle2" fontWeight={700}>
              4.2 User Content
            </Typography>
            <Typography variant="body2" paragraph>
              Users are responsible for all data (client lists, leads, messages, files, etc.) uploaded on the Platform (“User Content”).
            </Typography>

            <Typography variant="subtitle2" fontWeight={700}>
              4.3 License to Use User Content
            </Typography>
            <Typography variant="body2" paragraph>
              By using miraiCRM, you grant Amika Softwares a non-exclusive, royalty-free, worldwide licence to store, process, backup, and
              display your data strictly for providing features, analytics, and service improvements.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              5. Payment Terms
            </Typography>
            <ul className="list-decimal ml-8 text-sm space-y-1">
              <li>miraiCRM is a subscription-based SaaS product.</li>
              <li>Payments must be made in INR or accepted international currency.</li>
              <li>All payments are non-refundable unless otherwise stated.</li>
              <li>Subscription renewal is the user's responsibility.</li>
              <li>Taxes including GST will be applied where applicable.</li>
              <li>Multi-user accounts, add-ons and custom work are chargeable.</li>
              <li>No transfer of subscriptions without valid documentation.</li>
            </ul>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              6. Data Security & Backups
            </Typography>
            <Typography variant="body2" paragraph>
              Amika Softwares ensures encrypted transfers, secure servers, backups and controlled access. The company is not liable for data
              loss caused by user actions, force majeure, credential misuse, or external cyberattacks.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              7. Limitation of Liability
            </Typography>
            <Typography variant="body2" paragraph>
              Amika Softwares shall not be liable for indirect damages, business loss, downtime, user errors, or external issues. Maximum
              liability shall not exceed the last 3 months’ subscription amount.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              8. User Obligations
            </Typography>
            <ul className="list-disc ml-8 text-sm space-y-1">
              <li>Do not use miraiCRM for illegal or harmful activity.</li>
              <li>Do not copy, resell or reverse engineer the platform.</li>
              <li>Do not share login credentials.</li>
              <li>Do not upload malware or harmful files.</li>
            </ul>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              9. Termination
            </Typography>
            <Typography variant="body2" paragraph>
              Accounts may be terminated for non-payment, violations, illegal activity, or service discontinuation. Data may be requested
              before final closure, subject to availability.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              10. Governing Law & Dispute Resolution
            </Typography>
            <Typography variant="body2" paragraph>
              This Agreement is governed by Indian law. Exclusive jurisdiction lies with courts of Nagpur, Maharashtra. Disputes shall be
              resolved via internal escalation, mediation, and arbitration if required.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              11. Contact Information
            </Typography>
            <Typography variant="body2">
              Amika Softwares
              <br />
              03, New Viraj Nagar, Near Chintamani Nagari No.1,
              <br />
              Besa Road, Manewada, Nagpur – 440027
              <br />
              📞 +91 7722075447
              <br />
              📧 info@amikasoftwares.com
              <br />
              🌐 www.miraicrm.com
            </Typography>
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default TermsAndConditions;
