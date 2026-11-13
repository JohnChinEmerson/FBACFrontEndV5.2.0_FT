import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { PathCryptoService } from 'src/app/services/path-crypto.service';
import { _systemTitle } from 'src/global-variables';

@Component({
  selector: 'app-encrypted-redirect',
  templateUrl: './encrypted-redirect.component.html',
  styleUrls: ['./encrypted-redirect.component.css']
})
export class EncryptedRedirectComponent implements OnInit {
  systemTitle : string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pathCrypto: PathCryptoService
  ) {
    const encryptedPath = this.route.snapshot.url.map(s => s.path).join('/');
    try {
      const decodedPath = this.pathCrypto.decodePath(encryptedPath);
      this.router.navigateByUrl('/' + decodedPath);
    } catch (e) {
      console.error('Invalid encoded path:', encryptedPath);
      this.router.navigate(['/not-found']);
      
    }
  }

  ngOnInit(): void {
    this.systemTitle = _systemTitle;
    
  }

  onClickHome(){
    this.router.navigate(['/home']);
  }

}
