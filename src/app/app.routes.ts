import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/authLayout/auth-layout';
import { Login } from './features/auth/pages/loginPage/login';
import { Register } from './features/auth/pages/registerPage/register';
import { HomeLayout } from './layouts/homeLayout/homeLayout/homeLayout';
import { VerifyEmailPage } from './features/auth/pages/verifyEmailPage/verifyEmail';
import { ResendVerificationPage } from './features/auth/pages/ResendVerificationPage/ResendVerification';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: '', component: Login },
      { path: 'register', component: Register },
    ],
  },
  {
    path: '',
    component: HomeLayout,
    children: [],
  },
  {
    path: 'verify-email',
    component: VerifyEmailPage,
  },
  {
    path: 'auth/resend-verification',
    component: ResendVerificationPage,
  },
];
