import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { ReceivableConfigService } from 'src/app/services/Receivables/receivable-config.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-receivable-config',
  templateUrl: './receivable-config.component.html',
  styleUrls: ['./receivable-config.component.css']
})
export class ReceivableConfigComponent implements OnInit {
  btnText                   : string = "Save";
    receivableConfig     : any=[];
    loading                   : boolean = false;
    receivableConfigForm                = new FormGroup({
          PrinterType               : new FormControl(''),
         
    });
    constructor(
      private configService        : ReceivableConfigService,
      private notif               : NotificationService,
      private toolBoxService    : ToolBoxService,
    ) { }
  
    async ngOnInit(): Promise<void> {
      this.receivableConfig = await firstValueFrom(this.configService.getReceivableConfig());
      this.GetReceivableConfigFormData();
    }
  
    GetReceivableConfigFormData(){
      this.receivableConfigForm.controls['PrinterType'].setValue(this.receivableConfig.PrinterType);
    }
   
    onSubmit(){
      this.loading = true;
      this.configService.updateReceivableConfig(this.receivableConfigForm.getRawValue()).subscribe({
        next:(res)=>{
          this.notif.toastrSuccess(res.message);
          this.ngOnInit();
          this.loading = false;
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
