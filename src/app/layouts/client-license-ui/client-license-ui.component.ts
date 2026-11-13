import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ClientLicenseService } from '../../services/client-license.service';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-client-license-ui',
  templateUrl: './client-license-ui.component.html',
  styleUrls: ['./client-license-ui.component.css']
})
export class ClientLicenseUIComponent implements OnInit {
  loading               : boolean = false;
  clientLicenseUIFrom = new FormGroup({
    ClientId: new FormControl(''),
    ClientName: new FormControl(''),
    BusinessName: new FormControl(''),
    Address: new FormControl('-'),
    ContactNo: new FormControl('-'),
    Host: new FormControl(''),
    ProductId: new FormControl(),
    ProductName: new FormControl(''),
    LicensePlan: new FormControl(''),
    Users: new FormControl('0'),
  });
  btnSave: string = "Save";
  hostName: string;
  products: any[];
  licensePlans: any = [
    'Monthly',
    'Yearly',
    'Unlimited'
  ];
  constructor(
    private clientLicenseService : ClientLicenseService,
    private notif : NotificationService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getHostName();
    await this.getSoftwareCategorys();
  }

  async getHostName(){
    this.hostName = await firstValueFrom(this.clientLicenseService.getHostName());
    this.clientLicenseUIFrom.controls['Host'].setValue(this.hostName);
  }

  async getSoftwareCategorys(){
    this.products = await firstValueFrom(this.clientLicenseService.getSoftwares());
  }

  async onSubmit() {
    this.loading = true;
      this.clientLicenseService.saveEditClientLicense(this.clientLicenseUIFrom.getRawValue()).subscribe({
        next: (res) => {
          this.notif.toastrSuccess(res.message);
          this.loading = false;
        },
        error: (err) => {
          this.notif.toastrError(err.error.message);
          this.loading = false;
        }
      })
  }

  onChangeProduct(data: any) {
    this.clientLicenseUIFrom.controls['ProductId'].setValue(data.id);
    this.clientLicenseUIFrom.controls['ProductName'].setValue(data.ProductName);
  }
}
