import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import Footer from 'component/Footer';
import Navbar from 'layout/Landing/components/Navbar';

const CancellationRefund = () => {
  return (
    <>
      <Navbar />

      {/* ✅ CONTENT AREA (same mt={12}, navbar & footer preserved) */}
      <Box mt={12} className="bg-gradient-to-br from-indigo-100 via-sky-100 to-cyan-100 min-h-screen py-20">
        <Container maxWidth="lg">
          {/* ✅ HERO HEADER */}
          <Box className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 pt-24 pb-20 text-center rounded-3xl shadow-2xl mb-14">
            <Typography variant="h3" fontWeight={900} className="text-white drop-shadow-xl">
              Cancellation and Refund Policy – MiraiCRM
            </Typography>
          </Box>

          {/* ✅ MAIN CONTENT CARD */}
          <Box className="bg-white shadow-2xl rounded-3xl p-10 border border-gray-200 space-y-8">
            <Typography variant="h6" fontWeight={700}>
              Subscription Cancellation
            </Typography>
            <Typography variant="body2" paragraph>
              MiraiCRM reserves the right to cancel, suspend, or terminate any subscription or service at any time and for any specific
              reason without prior notice.
            </Typography>
            <Typography variant="body2" paragraph>
              If MiraiCRM cancels a subscription, the remaining balance (if any) will be credited to the customer’s MiraiCRM wallet, which
              can be used toward future subscription renewals or upgrades.
            </Typography>
            <Typography variant="body2" paragraph>
              No monetary refunds will be issued for cancellations initiated by MiraiCRM.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              Refunds
            </Typography>
            <Typography variant="body2" paragraph>
              All subscription fees, setup fees, onboarding fees, custom development fees, and renewal charges are non-refundable once paid.
            </Typography>
            <Typography variant="body2" paragraph>
              If MiraiCRM discontinues a feature, module, or service, the equivalent value may be adjusted in the customer’s MiraiCRM wallet
              for future use.
            </Typography>
            <Typography variant="body2" paragraph>
              Any wallet credit must be utilised within 90 days (3 months) from the date of issuance. Unused amounts beyond this period will
              automatically lapse and cannot be claimed later.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              Disputes
            </Typography>
            <Typography variant="body2" paragraph>
              Customers who have queries or disputes regarding cancellations or refunds may contact us.
            </Typography>
            <Typography variant="body2" paragraph>
              MiraiCRM will review the matter and take a decision based on internal policies.
            </Typography>
            <Typography variant="body2" paragraph>
              All decisions taken by MiraiCRM regarding refunds or cancellations will be final and binding.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              Changes to This Policy
            </Typography>
            <Typography variant="body2" paragraph>
              MiraiCRM reserves the right to modify, update, or change this Cancellation & Refund Policy at any time without prior notice.
            </Typography>
            <Typography variant="body2" paragraph>
              If major changes are implemented, we will update the policy on our website and may notify users through email or in-app
              alerts.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              Acceptance of Policy
            </Typography>
            <Typography variant="body2" paragraph>
              By using the MiraiCRM web-based application, mobile application, or any associated services, you acknowledge and accept this
              Cancellation & Refund Policy.
            </Typography>
            <Typography variant="body2" paragraph>
              If you do not agree with any part of this policy, you are requested not to use MiraiCRM.
            </Typography>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              Non-Refundable Fees
            </Typography>
            <ul className="list-disc ml-8 text-sm space-y-1">
              <li>Subscription fees (monthly, quarterly, or annual)</li>
              <li>Setup and onboarding charges</li>
              <li>Customisation or development charges</li>
              <li>Training fees</li>
              <li>Data migration fees</li>
              <li>Add-on module fees</li>
            </ul>

            <Divider />

            <Typography variant="h6" fontWeight={700}>
              Changes in CRM Features, Modules, or Service Rules
            </Typography>
            <Typography variant="body2" paragraph>
              MiraiCRM may revise features, modules, service rules, or pricing at any time based on product updates and business
              requirements.
            </Typography>
            <Typography variant="body2" paragraph>
              Any updates or major changes will be communicated to users via email or in-app notifications.
            </Typography>
            <Typography variant="body2" paragraph>
              If any user chooses to discontinue using the service after such changes, no refund will be applicable.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default CancellationRefund;
