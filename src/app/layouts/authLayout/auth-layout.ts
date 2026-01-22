import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'auth-layout',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: 'auth-layout.html',
})
export class AuthLayout {}
