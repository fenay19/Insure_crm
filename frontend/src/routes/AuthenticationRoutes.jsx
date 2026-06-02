import React from 'react';
import { lazy } from 'react';

// project imports
import Loadable from 'component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import ChangePassword from 'views/Login/ChangePassword';
import ForgetPassword from 'views/Login/ForgetPassword';
import Landing from 'layout/Landing';
import Signup from 'layout/Signup';
import PrivacyPolicy from 'PrivacyPolicy';
import TermsAndConditions from 'TermsAndConditions';
import CancellationRefund from 'CancellationRefund';

const AuthLogin = Loadable(lazy(() => import('../views/Login')));
// const AuthRegister = Loadable(lazy(() => import('../views/Register')));

// ==============================|| AUTHENTICATION ROUTES ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      index: true,
      // element: <Landing />
      element: <AuthLogin />
    },
    {
      path: '/login',
      element: <AuthLogin />
    },
    {
      path: '/change-password',
      element: <ChangePassword />
    },
    {
      path: '/forgot-password',
      element: <ForgetPassword />
    },
    {
      path: '/privacy-policy',
      element: <PrivacyPolicy />
    },
    {
      path: '/terms-and-conditions',
      element: <TermsAndConditions />
    },
    {
      path: '/cancellation-refund',
      element: <CancellationRefund />
    },
    {
      path: '/signup',
      element: <Signup />
    }
  ]
};

export default AuthenticationRoutes;
