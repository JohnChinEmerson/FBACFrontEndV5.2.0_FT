import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs';
import { PathCryptoService } from './services/path-crypto.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MariosoftAccountingFrontEndV4.7.3';
  // phones: the splash screen (index.html) stays at least this long
  static readonly SPLASH_MIN_MS = 1500;
  constructor(
    private router: Router,
    private pathCrypto: PathCryptoService,
    private location: Location
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects || event.url;
        const encodedUrl = this.pathCrypto.encodePath(
          currentUrl.startsWith('/') ? currentUrl.slice(1) : currentUrl
        );

        // Replace the browser URL with the encoded one (without reloading!)
        this.location.replaceState('/' + encodedUrl);
      });
    // the first screen is shown: the splash fades out
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), take(1))
      .subscribe(() => this.hideSplash());
  }

  private hideSplash(){
    const splash = document.getElementById('app-splash');
    if (!splash) return;
    const shownAt = (window as any).__splashStart || 0;
    const wait = Math.max(0, AppComponent.SPLASH_MIN_MS - (Date.now() - shownAt));
    setTimeout(() => {
      splash.classList.add('hide');
      setTimeout(() => splash.remove(), 400);
    }, wait);
  }
}
