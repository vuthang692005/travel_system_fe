import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Header, Footer, RouterModule],
  template: `
    <home-header />
    <router-outlet />
    <home-footer />
  `,
})
export class HomeLayout {}
