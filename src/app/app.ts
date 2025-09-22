import { Component, OnInit, PLATFORM_ID, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./sahred/components/navbar/navbar.component";
import { FooterComponent } from "./sahred/components/footer/footer.component";
import { AuthService } from './core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('start');
  constructor(private authService: AuthService) { }
  private platformId = inject(PLATFORM_ID);
  ngOnInit(): void {
    console.log('hiiii');
    
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.authService.decodedToken(token);
      }
    }
  }
}
