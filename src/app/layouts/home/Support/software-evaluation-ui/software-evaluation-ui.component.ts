import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ClientLicenseService } from 'src/app/services/client-license.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SoftwareEvaluationService } from 'src/app/services/Support/software-evaluation.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-software-evaluation-ui',
  templateUrl: './software-evaluation-ui.component.html',
  styleUrls: ['./software-evaluation-ui.component.css']
})
export class SoftwareEvaluationUIComponent implements OnInit {
  btnText                   : string = "Submit";
  scores                    : any=[1,2,3,4,5];
  techSupports              : any=[];
  clientLicense             : any=[];
  loading                   : boolean = false;
  btnTechSupportDisable     : boolean = true;
  btnTechSupportText        : string = 'Load Tech Supports';
  softwareEvaluationForm        = new FormGroup({
        SoftwareId              : new FormControl(''),
        SoftwareType            : new FormControl(''),
        EasyToUse               : new FormControl(''),
        Reliability             : new FormControl(''),
        Completenes             : new FormControl(''),
        FlexibleToUse           : new FormControl(''),
        SpeedPerformance        : new FormControl(''),
        CostEffective           : new FormControl(''),
        EasyToAdapt             : new FormControl(''),
        ReportingFeatures       : new FormControl(''),
        SecurityFeatures        : new FormControl(''),
        DesignFeatures            : new FormControl(''),
        Comment             : new FormControl(''),
        ClientName              : new FormControl(''),
  });
  constructor(
    private softwareEvaluationService      : SoftwareEvaluationService,
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
    this.getsoftwareEvaluationFormData();
  }

  getsoftwareEvaluationFormData(){
    this.softwareEvaluationForm.controls['ClientName'].setValue(this.clientLicense.ClientName);
    this.softwareEvaluationForm.controls['SoftwareId'].setValue(this.clientLicense.ProductId);
    this.softwareEvaluationForm.controls['SoftwareType'].setValue(this.clientLicense.ProductName);
  }

  
  onSubmit(){
    this.loading = true;
    this.softwareEvaluationService.saveSoftwareEvaluation(this.softwareEvaluationForm.getRawValue()).subscribe({
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
