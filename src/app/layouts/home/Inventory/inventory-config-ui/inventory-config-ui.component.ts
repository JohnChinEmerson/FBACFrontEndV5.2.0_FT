import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { InventoryConfigService } from 'src/app/services/Inventory/inventory-config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-inventory-config-ui',
  templateUrl: './inventory-config-ui.component.html',
  styleUrls: ['./inventory-config-ui.component.css']
})
export class InventoryConfigUIComponent implements OnInit {

  btnText                   : string = "Save";
  ConfigStockAdjustment     : any=[];
  loading                   : boolean = false;
  InventoryConfigForm                = new FormGroup({
        PositiveVariance             : new FormControl(''),
        NegativeVariance             : new FormControl(''),
        ColorOutOfStock             : new FormControl(''),
  });

  constructor(
    private cnfg_service        : InventoryConfigService,
    private notif               : NotificationService,
    private toolBoxService    : ToolBoxService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.ConfigStockAdjustment = await firstValueFrom(this.cnfg_service.getInventoryConfig());
    this.GetInventoryConfigFormData();
  }

  GetInventoryConfigFormData(){
    this.InventoryConfigForm.controls['PositiveVariance'].setValue(this.ConfigStockAdjustment.PositiveVariance);
    this.InventoryConfigForm.controls['NegativeVariance'].setValue(this.ConfigStockAdjustment.NegativeVariance);
    this.InventoryConfigForm.controls['ColorOutOfStock'].setValue(this.ConfigStockAdjustment.ColorOutOfStock);
    this.onCheck('PositiveVariance', this.ConfigStockAdjustment.PositiveVariance, this.ConfigStockAdjustment.PositiveVariance, 'String');
    this.onCheck('NegativeVariance', this.ConfigStockAdjustment.NegativeVariance, this.ConfigStockAdjustment.NegativeVariance, 'String');
    this.onCheck('ColorOutOfStock', this.ConfigStockAdjustment.ColorOutOfStock.toLowerCase() == 'yes', this.ConfigStockAdjustment.ColorOutOfStock, 'Boolean');

  }

  onCheck(Column, Check, Value:any, Type){
    if(Check == true){
      this.InventoryConfigForm.controls[Column].enable();
      if(Type == 'Number'){
        this.InventoryConfigForm.controls[Column].setValue(Value);
      }
      if(Type == 'String'){
        this.InventoryConfigForm.controls[Column].setValue(Value);
      }   
      if(Type == 'Boolean'){
        this.InventoryConfigForm.controls[Column].setValue('yes');
        this.InventoryConfigForm.controls[Column].disable();
      }
    }
    
    if(Check == false){
      this.InventoryConfigForm.controls[Column].disable();
      if(Type == 'Number'){
        this.InventoryConfigForm.controls[Column].setValue(0);
      }
      if(Type == 'String'){
        this.InventoryConfigForm.controls[Column].setValue('');
      }   
      if(Type == 'Boolean'){
        this.InventoryConfigForm.controls[Column].setValue('no');
      }
    }
  }

  onSubmit(){
    this.loading = true;
    this.cnfg_service.updateInventoryConfig(this.InventoryConfigForm.getRawValue()).subscribe({
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
