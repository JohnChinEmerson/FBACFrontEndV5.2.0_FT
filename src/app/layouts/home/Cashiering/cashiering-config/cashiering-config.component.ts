import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CashieringConfigService } from 'src/app/services/Cashiering/cashiering-config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-cashiering-config',
  templateUrl: './cashiering-config.component.html',
  styleUrls: ['./cashiering-config.component.css']
})
export class CashieringConfigComponent implements OnInit {

 btnText                   : string = "Save";
   cashieringConfig     : any=[];
   loading                   : boolean = false;
   cashieringConfigForm                = new FormGroup({
         PrinterType               : new FormControl(''),
        
   });
 
   constructor(
     private configService        : CashieringConfigService,
     private notif               : NotificationService,
     private toolBoxService    : ToolBoxService,
   ) { }
 
   async ngOnInit(): Promise<void> {
     this.cashieringConfig = await firstValueFrom(this.configService.getCashieringConfig());
     this.GetcashieringConfigFormData();
   }
 
  
 
   GetcashieringConfigFormData(){
     this.cashieringConfigForm.controls['PrinterType'].setValue(this.cashieringConfig.PrinterType);
   }
 
  
   onSubmit(){
     this.loading = true;
     this.configService.updateCashieringConfig(this.cashieringConfigForm.getRawValue()).subscribe({
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
