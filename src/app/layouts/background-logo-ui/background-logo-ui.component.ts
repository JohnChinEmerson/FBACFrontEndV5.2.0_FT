import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { _url } from 'src/global-variables';
import { BusinessInfoService } from 'src/app/services/Config/business-info.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-background-logo-ui',
  templateUrl: './background-logo-ui.component.html',
  styleUrls: ['./background-logo-ui.component.css']
})
export class BackgroundLogoUIComponent implements OnInit {
  // Cash Drawer: on phones the logo is centred with a welcome under it
  @Input() welcome : boolean = false;
  photoUrl : string = _url+"img/config/businessinfo/";
  backgroundLogo : any;
  hasPhoto          : boolean = true;
  businessInfo : any=[];
  constructor(
    private businessInfoService :  BusinessInfoService, 
  ) { }

  async ngOnInit(): Promise<void> {
    this.businessInfo = await firstValueFrom(this.businessInfoService.getBusinessInfo());
    this.hasPhoto = this.businessInfo.BackgroundLogo != null;
    this.photoUrl += this.businessInfo.BackgroundLogo;
    this.photoUrl =  this.photoUrl.replace('/api','');
    this.backgroundLogo    =  this.photoUrl;
  }

}
