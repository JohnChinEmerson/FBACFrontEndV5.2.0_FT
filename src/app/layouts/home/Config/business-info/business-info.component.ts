import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BusinessInfoService } from 'src/app/services/Config/business-info.service';
import { NotificationService } from 'src/app/services/notification.service';
import { BusinessBackgroundLogoUIComponent } from '../business-background-logo-ui/business-background-logo-ui.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-business-info',
  templateUrl: './business-info.component.html',
  styleUrls: ['./business-info.component.css']
})
export class BusinessInfoComponent implements OnInit {
  loading               : boolean = false;
  BusinessInfo : any;
  businessForm = new FormGroup({
    id: new FormControl(''),
    BusinessName: new FormControl(''),
    BusinessStyle: new FormControl(''),
    Address: new FormControl(''),
    ContactNo: new FormControl(''),
    VATType: new FormControl(''),
    TIN: new FormControl(''),
    ContactPerson: new FormControl(''),
    BranchCode: new FormControl(''),
    Proprietor: new FormControl(''),
    StartYear: new FormControl(''),
  })
  logos : any = ['POSPrinterLogo','OrdinaryPrinterLogo','BackgroundLogo'];
  constructor(
    private router: Router,
    private dialog              : MatDialog,
    private notif: NotificationService,
    private bus_service: BusinessInfoService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.GetBusinessInfo();
    this.GetBusinessFormData();
  }

  async GetBusinessInfo(){
    this.BusinessInfo = await firstValueFrom(this.bus_service.getBusinessInfo());
  }

  GetBusinessFormData(){
    this.businessForm.controls['id'].setValue(this.BusinessInfo.id);
    this.businessForm.controls['BusinessName'].setValue(this.BusinessInfo.BusinessName);
    this.businessForm.controls['BusinessStyle'].setValue(this.BusinessInfo.BusinessStyle);
    this.businessForm.controls['Address'].setValue(this.BusinessInfo.Address);
    this.businessForm.controls['ContactNo'].setValue(this.BusinessInfo.ContactNo);
    this.businessForm.controls['VATType'].setValue(this.BusinessInfo.VATType);
    this.businessForm.controls['TIN'].setValue(this.BusinessInfo.TIN);
    this.businessForm.controls['ContactPerson'].setValue(this.BusinessInfo.ContactPerson);
    this.businessForm.controls['BranchCode'].setValue(this.BusinessInfo.BranchCode);
    this.businessForm.controls['Proprietor'].setValue(this.BusinessInfo.Proprietor);
    this.businessForm.controls['StartYear'].setValue(this.BusinessInfo.StartYear);
  }

  onSubmit()
  {
    this.loading = true;
    this.bus_service.SaveEditBusinessInfo(this.businessForm.getRawValue()).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.loading = false;
        this.router.navigate(['home']);
      },
      error:(e)=>{
        this.notif.toastrError(e.message);
        this.loading = false;
      },
    });
  }
  
  onClose(){
    this.router.navigate(['home']);
  }

  async onClickBackgroundLogo(column){
    var businessInfo:any = await firstValueFrom(this.bus_service.getBusinessInfo());

      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '500px';
      dialogConfig.data         = ([businessInfo, column]);
      this.dialog.open(BusinessBackgroundLogoUIComponent,dialogConfig);
  }

}
