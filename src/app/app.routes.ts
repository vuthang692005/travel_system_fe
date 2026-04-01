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
import { PartnershipForms } from './features/partnership/pages/partnershipForm/partnershipForm';
import { PartnershipPage } from './features/partnership/pages/partnershipPage/partnershipPage';
import { AdminLayout } from './layouts/adminLayout/admin-layout';
import { OwnerApplicationsList } from './features/owner-applications/pages/owner-applications';
import { OwnerLayout } from './layouts/onwerLayout/owner-layout';
import { PropertyRegistrationComponent } from './features/properties/add-property/property-registration';
import { MyPropertiesComponent } from './features/properties/my-properties/my-properties';
import { AdminPropertyListComponent } from './features/properties/admin-property/admin-property-list';
import { PropertyRoomListComponent } from './features/properties/property-room/property-room-list';
import { RoomManagementComponent } from './features/properties/property-room/room-management';
import { HomeHeroSearchComponent } from './features/home/home-hero-search';
import { HotelListPageComponent } from './features/home/hotel-list';
import { HotelDetailPageComponent } from './features/home/hotel-detail';
import { BookingPageComponent } from './features/home/booking';
import { BookingPaymentPageComponent } from './features/home/booking-payment';
import { OwnerBookingsPageComponent } from './features/booking/owner-bookings';
import { AdminUsersPageComponent } from './features/users/admin-users';

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
      {
        path: 'partnershipForm',
        component: PartnershipForms,
      },
      {
        path: 'partnershipPage',
        component: PartnershipPage,
      },
      {
        path: '',
        component: HomeHeroSearchComponent,
      },
      {
        path: 'hotels',
        component: HotelListPageComponent,
      },
      {
        path: 'hotels/:id',
        component: HotelDetailPageComponent,
      },
      {
        path: 'booking',
        component: BookingPageComponent,
      },
      {
        path: 'booking',
        component: BookingPageComponent,
      },
      {
        path: 'booking/payment',
        component: BookingPaymentPageComponent,
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
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: 'owner-applications', component: OwnerApplicationsList },
      { path: 'hotels/submissions', component: AdminPropertyListComponent },
      { path: 'users', component: AdminUsersPageComponent },
    ],
  },
  {
    path: 'owner',
    component: OwnerLayout,
    children: [
      { path: 'property/registration', component: PropertyRegistrationComponent },
      { path: 'property/list', component: MyPropertiesComponent },
      { path: 'hotels', component: PropertyRoomListComponent },
      { path: 'hotels/:id', component: RoomManagementComponent },
      {
        path: 'bookings',
        component: OwnerBookingsPageComponent,
      },
    ],
  },
];
