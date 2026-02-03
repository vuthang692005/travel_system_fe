import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/authLayout/auth-layout';
import { Login } from './features/auth/pages/loginPage/login';
import { Register } from './features/auth/pages/registerPage/register';
import { HomeLayout } from './layouts/homeLayout/homeLayout/homeLayout';
import { VerifyEmailPage } from './features/auth/pages/verifyEmailPage/verifyEmail';
import { ResendVerificationPage } from './features/auth/pages/ResendVerificationPage/ResendVerification';
import { RegisterSuccess } from './features/auth/pages/registerPage/registerSuccess';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { ProfileLayout } from './layouts/profileLayout/ProfileLayout';
import { UserProfileComponent } from './features/profile/pages/userProfile/userProfile';
import { MembershipComponent } from './features/profile/pages/membership/membership';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    canActivate: [noAuthGuard],
    children: [
      { path: '', component: Login },
      { path: 'register', component: Register },
    ],
  },
  {
    path: '',
    component: HomeLayout,
    children: [
      {
        path: 'profile',
        component: ProfileLayout,
        children: [
          { path: '', component: UserProfileComponent },
          { path: 'membership', component: MembershipComponent },
        ],
      },
    ],
  },
  {
    path: 'verify-email',
    component: VerifyEmailPage,
  },
  {
    path: 'auth/resend-verification',
    component: ResendVerificationPage,
  },
  {
    path: 'auth/register-success',
    component: RegisterSuccess,
  },
];
