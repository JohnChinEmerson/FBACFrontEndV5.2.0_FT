import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderConfigService } from 'src/app/services/Orders/order-config.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-order-config',
  templateUrl: './order-config.component.html',
  styleUrls: ['./order-config.component.css']
})
export class OrderConfigComponent implements OnInit {
  btnText                   : string = "Save";
  orderConfig     : any=[];
  loading                   : boolean = false;
  orderConfigForm                = new FormGroup({
        PrintReceipt              : new FormControl(''),
        PopupQty                  : new FormControl(''),
        ReceiptLabel              : new FormControl(''),
        DisableTransDate          : new FormControl(''),
        DisableItemDiscount       : new FormControl(''),
        DisableReceiptDiscount    : new FormControl(''),
        EditPrice                 : new FormControl(''),
        ReceiptNotes              : new FormControl(''),
  });

  constructor(
    private cnfg_service        : OrderConfigService,
    private notif               : NotificationService,
    private toolBoxService    : ToolBoxService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.orderConfig = await firstValueFrom(this.cnfg_service.getOrderConfig());
    this.GetorderConfigFormData();
  }

  GetorderConfigFormData(){
    

    this.orderConfigForm.controls['PrintReceipt'].setValue(this.orderConfig.PrintReceipt);
    this.orderConfigForm.controls['PopupQty'].setValue(this.orderConfig.PopupQty);
    this.orderConfigForm.controls['ReceiptLabel'].setValue(this.orderConfig.ReceiptLabel);
    this.orderConfigForm.controls['DisableTransDate'].setValue(this.orderConfig.DisableTransDate);
    this.orderConfigForm.controls['DisableItemDiscount'].setValue(this.orderConfig.DisableItemDiscount);
    this.orderConfigForm.controls['DisableReceiptDiscount'].setValue(this.orderConfig.DisableReceiptDiscount);
    this.orderConfigForm.controls['EditPrice'].setValue(this.orderConfig.EditPrice);
    this.orderConfigForm.controls['ReceiptNotes'].setValue(this.orderConfig.ReceiptNotes);
   

    this.onCheck('PrintReceipt', this.orderConfig.PrintReceipt.toLowerCase() == 'yes', this.orderConfig.PrintReceipt, 'Boolean');
    this.onCheck('PopupQty', this.orderConfig.PopupQty.toLowerCase() == 'yes', this.orderConfig.PopupQty, 'Boolean');
    this.onCheck('ReceiptLabel', this.orderConfig.ReceiptLabel, this.orderConfig.ReceiptLabel, 'String');
    this.onCheck('DisableTransDate', this.orderConfig.DisableTransDate.toLowerCase() == 'yes', this.orderConfig.DisableTransDate, 'Boolean');
    this.onCheck('DisableItemDiscount', this.orderConfig.DisableItemDiscount.toLowerCase() == 'yes', this.orderConfig.DisableItemDiscount, 'Boolean');
    this.onCheck('DisableReceiptDiscount', this.orderConfig.DisableReceiptDiscount.toLowerCase() == 'yes', this.orderConfig.DisableReceiptDiscount, 'Boolean');
    this.onCheck('EditPrice', this.orderConfig.EditPrice.toLowerCase() == 'yes', this.orderConfig.EditPrice, 'Boolean');
    this.onCheck('ReceiptNotes', this.orderConfig.ReceiptNotes, this.orderConfig.ReceiptNotes, 'String');
 
  }

  onCheck(Column, Check, Value:any, Type){
    if(Check == true){
      this.orderConfigForm.controls[Column].enable();
      if(Type == 'Number'){
        this.orderConfigForm.controls[Column].setValue(Value);
      }
      if(Type == 'String'){
        this.orderConfigForm.controls[Column].setValue(Value);
      }   
      if(Type == 'Boolean'){
        this.orderConfigForm.controls[Column].setValue('yes');
        this.orderConfigForm.controls[Column].disable();
      }
    }
    
    if(Check == false){
      this.orderConfigForm.controls[Column].disable();
      if(Type == 'Number'){
        this.orderConfigForm.controls[Column].setValue(0);
      }
      if(Type == 'String'){
        this.orderConfigForm.controls[Column].setValue('');
      }   
      if(Type == 'Boolean'){
        this.orderConfigForm.controls[Column].setValue('no');
      }
    }
  }

  onSubmit(){
    this.loading = true;
    this.cnfg_service.updateOrderConfig(this.orderConfigForm.getRawValue()).subscribe({
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
