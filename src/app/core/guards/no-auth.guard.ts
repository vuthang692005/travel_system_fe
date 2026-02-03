import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserStore } from '../../store/user.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const noAuthGuard: CanActivateFn = () => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  // Chuyển signal thành observable để đợi trạng thái load xong
  return toObservable(userStore.isInitialLoaded).pipe(
    filter((loaded) => loaded === true), // Đợi cho đến khi API khởi tạo chạy xong
    take(1), // Chỉ lấy giá trị đầu tiên sau khi load xong
    map(() => {
      if (userStore.isLoggedIn()) {
        router.navigate(['/']);
        return false;
      }
      return true;
    }),
  );
};
