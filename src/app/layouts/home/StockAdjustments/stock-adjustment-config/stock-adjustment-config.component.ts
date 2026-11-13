import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { StockAdjustmentConfigService } from 'src/app/services/StockAdjustments/stock-adjustment-config.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-stock-adjustment-config',
  templateUrl: './stock-adjustment-config.component.html',
  styleUrls: ['./stock-adjustment-config.component.css']
})
export class StockAdjustmentConfigComponent implements OnInit {
  btnText                   : string = "Save";
  stockadjustmentconfig     : any=[];
  loading                   : boolean = false;
  stockadjustmentForm                = new FormGroup({
      ValidateQtyOnStockOut                 : new FormControl(''),
  });

  constructor(
    private stockadjustmentconfigService        : StockAdjustmentConfigService,
    private dialog             : MatDialog, 
    private notif             : NotificationService,
    private toolBoxService    : ToolBoxService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.stockadjustmentconfig = await firstValueFrom(this.stockadjustmentconfigService.getStockAdjustmentConfig());
    this.GetstockadjustmentFormData();
  }

  GetstockadjustmentFormData(){
    this.stockadjustmentForm.controls['ValidateQtyOnStockOut'].setValue(this.stockadjustmentconfig.ValidateQtyOnStockOut);

    this.onCheck('ValidateQtyOnStockOut', this.stockadjustmentconfig.ValidateQtyOnStockOut.toLowerCase() == 'yes', this.stockadjustmentconfig.ValidateQtyOnStockOut, 'Boolean');
  }

  onCheck(Column, Check, Value:any, Type){
    if(Check == true){
      this.stockadjustmentForm.controls[Column].enable();
      if(Type == 'Number'){
        this.stockadjustmentForm.controls[Column].setValue(Value);
      }
      if(Type == 'String'){
        this.stockadjustmentForm.controls[Column].setValue(Value);
      }   
      if(Type == 'Boolean'){
        this.stockadjustmentForm.controls[Column].setValue('yes');
        this.stockadjustmentForm.controls[Column].disable();
      }
    }
    
    if(Check == false){
      this.stockadjustmentForm.controls[Column].disable();
      if(Type == 'Number'){
        this.stockadjustmentForm.controls[Column].setValue(0);
      }
      if(Type == 'String'){
        this.stockadjustmentForm.controls[Column].setValue('');
      }   
      if(Type == 'Boolean'){
        this.stockadjustmentForm.controls[Column].setValue('no');
      }
    }
  }

  onSubmit(){
    this.loading = true;
    this.stockadjustmentconfigService.updateStockAdjustmentConfig(this.stockadjustmentForm.getRawValue()).subscribe({
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
