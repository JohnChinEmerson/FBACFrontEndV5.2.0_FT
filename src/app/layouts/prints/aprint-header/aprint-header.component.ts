import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BusinessInfoService } from 'src/app/services/Config/business-info.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { _url } from 'src/global-variables';

@Component({
  selector: 'app-aprint-header',
  templateUrl: './aprint-header.component.html',
  styleUrls: ['./aprint-header.component.css']
})
export class APrintHeaderComponent implements OnInit {

  businessInfo : any=[];
  WithLogo : boolean = this.toolBoxService.WithLogo();
  hasPhoto          : boolean = true;
  photoUrl : string = _url+"img/config/businessinfo/";
  ordinaryPrinterLogo : string;
  constructor(
    private businessInfoService: BusinessInfoService,
    private toolBoxService : ToolBoxService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.businessInfo = await firstValueFrom(this.businessInfoService.getBusinessInfo());
    this.hasPhoto = this.businessInfo.OrdinaryPrinterLogo != null;
    this.photoUrl += this.businessInfo.OrdinaryPrinterLogo;
    this.photoUrl =  this.photoUrl.replace('/api','');
    this.ordinaryPrinterLogo    =  this.photoUrl;
  }
}
