import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { _systemTitle } from 'src/global-variables';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  HasToken: boolean = false;
  systemTitle: string;
  constructor(
    public router: Router,
    public auth_service : AuthService
  ) { 
    if(!this.auth_service.isLoggedIn()){
      this.HasToken = false;
      // phones open on the login screen (no landing page in between)
      this.router.navigate([LandingComponent.isPhone() ? '/landing/login' : '/landing']);
    }
    else{
      this.router.navigate(['/home']);
      this.HasToken = true;
    }
  }

  ngOnInit(): void {
    this.systemTitle = _systemTitle;
  }

  // same width as the phone login (LoginComponent.PHONE_QUERY)
  static isPhone(): boolean {
    return typeof window != 'undefined' && !!window.matchMedia && window.matchMedia('(max-width: 767.98px)').matches;
  }

  openLink() {
    window.open("https://www.facebook.com/mariosoftsolutions", "_blank");
  }


  login() {
    if( this.HasToken == true){
      this.router.navigate(['/home']);
    }
    else{
      this.router.navigate(['landing/login']);
    }
  }
}
