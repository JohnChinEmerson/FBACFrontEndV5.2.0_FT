import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ClientLicenseService } from 'src/app/services/client-license.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SupportEvaluationService } from 'src/app/services/Support/support-evaluation.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-support-evaluation-ui',
  templateUrl: './support-evaluation-ui.component.html',
  styleUrls: ['./support-evaluation-ui.component.css']
})
export class SupportEvaluationUIComponent implements OnInit {

  btnText                   : string = "Submit";
  scores                    : any=[1,2,3,4,5];
  techSupports              : any=[];
  clientLicense             : any=[];
  loading                   : boolean = false;
  btnTechSupportDisable     : boolean = true;
  btnTechSupportText        : string = 'Load Tech Supports';
  supportEvaluationForm        = new FormGroup({
        SoftwareId              : new FormControl(''),
        SoftwareType            : new FormControl(''),
        EmployeeNo              : new FormControl(''),
        EmployeeName            : new FormControl(''),
        Responsive              : new FormControl(''),
        Professionalism         : new FormControl(''),
        SolveFast               : new FormControl(''),
        Friendly                : new FormControl(''),
        Respectful              : new FormControl(''),
        Humble                  : new FormControl(''),
        Patience                : new FormControl(''),
        Listen                  : new FormControl(''),
        Understanding           : new FormControl(''),
        ExplainClear            : new FormControl(''),
        Comment             : new FormControl(''),
        ClientName              : new FormControl(''),
  });
  constructor(
    private supportEvaluationService      : SupportEvaluationService,
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
    this.getsupportEvaluationFormData();
  }

  getsupportEvaluationFormData(){
    this.supportEvaluationForm.controls['ClientName'].setValue(this.clientLicense.ClientName);
    this.supportEvaluationForm.controls['SoftwareId'].setValue(this.clientLicense.ProductId);
    this.supportEvaluationForm.controls['SoftwareType'].setValue(this.clientLicense.ProductName);
  }

  async onClickLoadTechSupport(){
    this.btnTechSupportDisable = true;
    this.btnTechSupportText = 'LOADING...';
    this.techSupports = await firstValueFrom(this.clientLicenseService.getTechSupportsBySoftwareTypeId(this.clientLicense.ProductId));
    this.btnTechSupportText = 'LOADED';
    this.supportEvaluationForm.controls['EmployeeNo'].setValue(this.techSupports[0].EmployeeNo);
    this.supportEvaluationForm.controls['EmployeeName'].setValue(this.techSupports[0].EmployeeName);
  }
  
  onSubmit(){
    this.loading = true;
    this.supportEvaluationService.saveSupportEvaluation(this.supportEvaluationForm.getRawValue()).subscribe({
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
