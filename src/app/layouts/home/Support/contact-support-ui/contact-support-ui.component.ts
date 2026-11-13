import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ClientLicenseService } from 'src/app/services/client-license.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ContactSupportService } from 'src/app/services/Support/contact-support.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-contact-support-ui',
  templateUrl: './contact-support-ui.component.html',
  styleUrls: ['./contact-support-ui.component.css']
})
export class ContactSupportUIComponent implements OnInit {

    btnText                   : string = "Send";
    contactSupport            : any=[];
    techSupports              : any=[];
    clientLicense              : any=[];
    loading                   : boolean = false;
    btnTechSupportDisable : boolean = true;
    btnTechSupportText : string = 'Load Tech Supports';
    contactSupportForm        = new FormGroup({
          TransDate               : new FormControl(''),
          SoftwareId              : new FormControl(''),
          SoftwareType            : new FormControl(''),
          EmployeeNo              : new FormControl(''),
          EmployeeName            : new FormControl(''),
          Description             : new FormControl(''),
          ClientName             : new FormControl(''),
    });
    constructor(
      private contactSupportService         : ContactSupportService,
      private clientLicenseService          : ClientLicenseService,
      private notif                         : NotificationService,
      private toolBoxService                : ToolBoxService,
    ) { }
  
    async ngOnInit(): Promise<void> {
      this.getClientLicense();
    }


    async getClientLicense(){
      this.clientLicense = await firstValueFrom(this.clientLicenseService.getClientLicense());
      this.btnTechSupportDisable = false;
      this.getcontactSupportFormData();
    }

    getcontactSupportFormData(){
      this.contactSupportForm.controls['ClientName'].setValue(this.clientLicense.ClientName);
      this.contactSupportForm.controls['SoftwareId'].setValue(this.clientLicense.ProductId);
      this.contactSupportForm.controls['SoftwareType'].setValue(this.clientLicense.ProductName);
    }

    async onClickLoadTechSupport(){
      this.btnTechSupportDisable = true;
      this.btnTechSupportText = 'LOADING...';
      this.techSupports = await firstValueFrom(this.clientLicenseService.getTechSupportsBySoftwareTypeId(this.clientLicense.ProductId));
      this.btnTechSupportText = 'LOADED';
      this.contactSupportForm.controls['EmployeeNo'].setValue(this.techSupports[0].EmployeeNo);
      this.contactSupportForm.controls['EmployeeName'].setValue(this.techSupports[0].EmployeeName);
    }
   
    onSubmit(){
      this.loading = true;
      this.contactSupportService.saveContactSupport(this.contactSupportForm.getRawValue()).subscribe({
        next:(res)=>{
          this.loading = false;
          this.notif.toastrSuccess(res.message);
          this.onClose();
        },
        error:(err)=>{
          this.notif.toastrError(err.error);
          this.loading = false;
        },
      })
    }
  
    onClose(){
      this.toolBoxService.onHome();
    }

}
