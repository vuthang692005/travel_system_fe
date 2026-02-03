import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { APP_INITIALIZER } from '@angular/core';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { UserService } from './core/services/user.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptor]), // Đăng ký tại đây
    ),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: (userService: UserService) => () => userService.getCurrentUser(),
      deps: [UserService],
      multi: true,
    },
  ],
};
