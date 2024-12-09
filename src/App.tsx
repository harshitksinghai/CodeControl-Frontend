import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MarketingPage from './pages/MarketingPage.tsx';
import AuthPage from './features/auth/pages/AuthPage.tsx';
import OnboardPage from './features/auth/pages/OnboardPage.tsx';
import HomePage from './pages/HomePage.tsx';

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MarketingPage />
    },
    {
      path: '/login',
      element: <AuthPage mode="login" />
    },
    {
      path: '/register',
      element: <AuthPage mode="register" />
    },
    {
      path: '/onboard',
      element: <OnboardPage />
    },
    {
      path: '/home',
      element: <HomePage />
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;