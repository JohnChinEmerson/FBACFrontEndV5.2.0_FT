import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { VendorPermitsService } from 'src/app/services/Config/vendor-permits.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-vendor-permits',
  templateUrl: './vendor-permits.component.html',
  styleUrls: ['./vendor-permits.component.css']
})
export class VendorPermitsComponent implements OnInit {

  VendorPermit  : any;
  loading       : boolean = false;
  vendorPermitForm = new FormGroup({
    id: new FormControl(''),
    VendorName: new FormControl(''),
    Address: new FormControl(''),
    TIN: new FormControl(''),
    SoftwareVersion: new FormControl(''),
    AccreditationNo: new FormControl(''),
    AccreditationDate: new FormControl(''),
    ExpiryDate: new FormControl(''),
  })
  constructor(
    private router: Router,
    private notif: NotificationService,
    private vendor_service: VendorPermitsService,
    private DateTimesService: DateTimesService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.GetVendorPermit();
    this.GetvendorPermitFormData();
  }

  async GetVendorPermit(){
    this.VendorPermit = await firstValueFrom(this.vendor_service.getVendorPermit());
  }

  GetvendorPermitFormData(){
    this.vendorPermitForm.controls['id'].setValue(this.VendorPermit.id);
    this.vendorPermitForm.controls['VendorName'].setValue(this.VendorPermit.VendorName);
    this.vendorPermitForm.controls['Address'].setValue(this.VendorPermit.Address);
    this.vendorPermitForm.controls['SoftwareVersion'].setValue(this.VendorPermit.SoftwareVersion);
    this.vendorPermitForm.controls['AccreditationNo'].setValue(this.VendorPermit.AccreditationNo);
    this.vendorPermitForm.controls['TIN'].setValue(this.VendorPermit.TIN);
    this.vendorPermitForm.controls['AccreditationDate'].setValue( this.DateTimesService.ConvertToDateFormat(new Date(this.VendorPermit.AccreditationDate)) );
    this.vendorPermitForm.controls['ExpiryDate'].setValue(this.DateTimesService.ConvertToDateFormat(new Date(this.VendorPermit.ExpiryDate)));
  }

  onSubmit()
  {
    this.loading = true;
    this.vendorPermitForm.controls['AccreditationDate'].setValue( this.DateTimesService.ConvertToDateFormat(new Date( this.vendorPermitForm.controls['AccreditationDate'].value)) );
    this.vendorPermitForm.controls['ExpiryDate'].setValue(this.DateTimesService.ConvertToDateFormat(new Date( this.vendorPermitForm.controls['ExpiryDate'].value)));

    this.vendor_service.saveEditVendorPermits(this.vendorPermitForm.getRawValue()).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.router.navigate(['home']);
        this.loading = false;
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
}
