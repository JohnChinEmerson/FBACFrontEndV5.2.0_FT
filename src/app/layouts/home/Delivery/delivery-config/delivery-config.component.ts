import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { DeliveryConfigService } from 'src/app/services/Delivery/delivery-config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-delivery-config',
  templateUrl: './delivery-config.component.html',
  styleUrls: ['./delivery-config.component.css']
})
export class DeliveryConfigComponent implements OnInit {

  btnText                   : string = "Save";
  deliveryConfig            : any=[];
  loading                   : boolean = false;
  deliveryConfigForm                = new FormGroup({
      ReceiptLabel              : new FormControl(''),
      DisableTransDate          : new FormControl(''),
      ReceiptNotes              : new FormControl(''),
  });

  constructor(
    private cnfg_service        : DeliveryConfigService,
    private notif               : NotificationService,
    private toolBoxService    : ToolBoxService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.deliveryConfig = await firstValueFrom(this.cnfg_service.getDeliveryConfig());
    this.GetdeliveryConfigFormData();
  }

  GetdeliveryConfigFormData(){
    this.deliveryConfigForm.controls['ReceiptLabel'].setValue(this.deliveryConfig.ReceiptLabel);
    this.deliveryConfigForm.controls['DisableTransDate'].setValue(this.deliveryConfig.DisableTransDate);
    this.deliveryConfigForm.controls['ReceiptNotes'].setValue(this.deliveryConfig.ReceiptNotes);
   
    this.onCheck('ReceiptLabel', this.deliveryConfig.ReceiptLabel, this.deliveryConfig.ReceiptLabel, 'String');
    this.onCheck('DisableTransDate', this.deliveryConfig.DisableTransDate.toLowerCase() == 'yes', this.deliveryConfig.DisableTransDate, 'Boolean');
    this.onCheck('ReceiptNotes', this.deliveryConfig.ReceiptNotes, this.deliveryConfig.ReceiptNotes, 'String');
  }

  onCheck(Column, Check, Value:any, Type){
    if(Check == true){
      this.deliveryConfigForm.controls[Column].enable();
      if(Type == 'Number'){
        this.deliveryConfigForm.controls[Column].setValue(Value);
      }
      if(Type == 'String'){
        this.deliveryConfigForm.controls[Column].setValue(Value);
      }   
      if(Type == 'Boolean'){
        this.deliveryConfigForm.controls[Column].setValue('yes');
        this.deliveryConfigForm.controls[Column].disable();
      }
    }
    
    if(Check == false){
      this.deliveryConfigForm.controls[Column].disable();
      if(Type == 'Number'){
        this.deliveryConfigForm.controls[Column].setValue(0);
      }
      if(Type == 'String'){
        this.deliveryConfigForm.controls[Column].setValue('');
      }   
      if(Type == 'Boolean'){
        this.deliveryConfigForm.controls[Column].setValue('no');
      }
    }
  }

  onSubmit(){
    this.loading = true;
    this.cnfg_service.updateDeliveryConfig(this.deliveryConfigForm.getRawValue()).subscribe({
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
