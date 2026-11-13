import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { ReturnToSupplierConfigService } from 'src/app/services/ReturnToSupplier/return-to-supplier-config.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-return-to-supplier-config',
  templateUrl: './return-to-supplier-config.component.html',
  styleUrls: ['./return-to-supplier-config.component.css']
})
export class ReturnToSupplierConfigComponent implements OnInit {

  btnText                   : string = "Save";
  returnToSupplierConfig     : any=[];
  loading                   : boolean = false;
  returnToSupplierConfigForm                = new FormGroup({
        ReceiptLabel    : new FormControl(''),
        ReceiptNotes    : new FormControl(''),
        DisableTransDate    : new FormControl(''),
       
  });

  constructor(
    private configService        : ReturnToSupplierConfigService,
    private notif               : NotificationService,
    private toolBoxService    : ToolBoxService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.returnToSupplierConfig = await firstValueFrom(this.configService.getReturnToSupplierConfig());
    this.GetreturnToSupplierConfigFormData();
  }



  GetreturnToSupplierConfigFormData(){

    this.returnToSupplierConfigForm.controls['ReceiptLabel'].setValue(this.returnToSupplierConfig.ReceiptLabel);
    this.returnToSupplierConfigForm.controls['ReceiptNotes'].setValue(this.returnToSupplierConfig.ReceiptNotes);
    this.returnToSupplierConfigForm.controls['DisableTransDate'].setValue(this.returnToSupplierConfig.DisableTransDate);
    
    this.onCheck('ReceiptLabel', this.returnToSupplierConfig.ReceiptLabel, this.returnToSupplierConfig.ReceiptLabel, 'String');
    this.onCheck('ReceiptNotes', this.returnToSupplierConfig.ReceiptNotes, this.returnToSupplierConfig.ReceiptNotes, 'String');
    this.onCheck('DisableTransDate', this.returnToSupplierConfig.DisableTransDate.toLowerCase() == 'yes', this.returnToSupplierConfig.DisableTransDate, 'Boolean');

  }

  onCheck(Column, Check, Value:any, Type){
    if(Check == true){
      this.returnToSupplierConfigForm.controls[Column].enable();
      if(Type == 'Number'){
        this.returnToSupplierConfigForm.controls[Column].setValue(Value);
      }
      if(Type == 'String'){
        this.returnToSupplierConfigForm.controls[Column].setValue(Value);
      }   
      if(Type == 'Boolean'){
        this.returnToSupplierConfigForm.controls[Column].setValue('yes');
        this.returnToSupplierConfigForm.controls[Column].disable();
      }
    }
    
    if(Check == false){
      this.returnToSupplierConfigForm.controls[Column].disable();
      if(Type == 'Number'){
        this.returnToSupplierConfigForm.controls[Column].setValue(0);
      }
      if(Type == 'String'){
        this.returnToSupplierConfigForm.controls[Column].setValue('');
      }   
      if(Type == 'Boolean'){
        this.returnToSupplierConfigForm.controls[Column].setValue('no');
      }
    }

  }

  onSubmit(){
    this.loading = true;
    this.configService.updateReturnToSupplierConfig(this.returnToSupplierConfigForm.getRawValue()).subscribe({
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
