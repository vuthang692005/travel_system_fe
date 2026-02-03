import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'auth-layout',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: 'auth-layout.html',
})
export class AuthLayout {
  public authService = inject(AuthService);
}
