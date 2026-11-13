import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { SaleConfigAccessRightsUIComponent } from '../sale-config-access-rights-ui/sale-config-access-rights-ui.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SalesConfigPerMachineComponent } from '../sales-config-per-machine/sales-config-per-machine.component';

@Component({
  selector: 'app-sales-config',
  templateUrl: './sales-config.component.html',
  styleUrls: ['./sales-config.component.css']
})
export class SalesConfigComponent implements OnInit {

  btnText                   : string = "Save";
  saleConfig     : any=[];
  loading                   : boolean = false;
  saleConfigForm                = new FormGroup({
      ValidatePrice               : new FormControl(''),
      ValidateQty                 : new FormControl(''),
      PopupQty                    : new FormControl(''),
      HideZeroItemQty             : new FormControl(''),
      ItemsPrintByCategory        : new FormControl(''),
      ItemsPrintByName            : new FormControl(''),
      ReceiptNotes                : new FormControl(''),
      ReceiptLabel                : new FormControl(''),
      LoyaltyPoints               : new FormControl(''),
      CloseDrawerNextDay          : new FormControl(''),
      PrintReceipt              : new FormControl(''),
      POSFontSize                 : new FormControl(''),
      POSMargin                 : new FormControl(''),
      HasTable                  : new FormControl(''),
      // Desktop SaleConfigUI
      HasPhoto                  : new FormControl(''),
      OnScreenKeyboard          : new FormControl(''),
      ButtonWidth               : new FormControl(182),
      ButtonHeight              : new FormControl(110),
      POSReceiptNotesHeight     : new FormControl(0),
      ServiceFee                : new FormControl(0),
      ServiceFeeType            : new FormControl('percent'),
      SendKitchen               : new FormControl('POS'),

  });
  // Send Kitchen: what SEND does in Sales Transaction (backend SaleConfigs::SEND_KITCHEN)
  sendKitchenOptions = [
    { 'Value': 'POS',             'Label': 'POS (print kitchen slip)' },
    { 'Value': 'Kitchen Display', 'Label': 'Kitchen Display (Kitchen Queue only)' },
    { 'Value': 'Both',            'Label': 'Both (print and Kitchen Queue)' },
  ];

  constructor(
    private cnfg_service        : SaleConfigService,
    private dialog : MatDialog, 
    private notif               : NotificationService,
    private toolBoxService    : ToolBoxService,
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.saleConfig = await firstValueFrom(this.cnfg_service.getSaleConfig());
    } catch (err: any) {
      this.saleConfig = null;
      this.notif.toastrHttpError(err, 'Unable to load the Sales Config.');
    }
    if (!this.saleConfig) {
      this.saleConfig = {};
      return this.notif.toastrWarning('Sales Config is not set up for this branch.');
    }
    this.GetsaleConfigFormData();
  }

  GetsaleConfigFormData(){
    this.saleConfigForm.controls['ValidateQty'].setValue(this.saleConfig.ValidateQty);
    this.saleConfigForm.controls['ValidatePrice'].setValue(this.saleConfig.ValidatePrice);
    this.saleConfigForm.controls['HideZeroItemQty'].setValue(this.saleConfig.HideZeroItemQty);
    this.saleConfigForm.controls['ItemsPrintByCategory'].setValue(this.saleConfig.ItemsPrintByCategory);
    this.saleConfigForm.controls['ItemsPrintByName'].setValue(this.saleConfig.ItemsPrintByName);
    this.saleConfigForm.controls['ReceiptNotes'].setValue(this.saleConfig.ReceiptNotes);
    this.saleConfigForm.controls['CloseDrawerNextDay'].setValue(this.saleConfig.CloseDrawerNextDay);
    this.saleConfigForm.controls['PrintReceipt'].setValue(this.saleConfig.PrintReceipt);
    this.saleConfigForm.controls['PopupQty'].setValue(this.saleConfig.PopupQty);
    this.saleConfigForm.controls['LoyaltyPoints'].setValue(this.saleConfig.LoyaltyPoints);
    this.saleConfigForm.controls['POSFontSize'].setValue(this.saleConfig.POSFontSize);
    this.saleConfigForm.controls['POSMargin'].setValue(this.saleConfig.POSMargin);
    this.saleConfigForm.controls['ReceiptLabel'].setValue(this.saleConfig.ReceiptLabel);
    this.saleConfigForm.controls['HasPhoto'].setValue((this.saleConfig.HasPhoto || 'no').toLowerCase());
    this.saleConfigForm.controls['OnScreenKeyboard'].setValue((this.saleConfig.OnScreenKeyboard || 'no').toLowerCase());
    this.saleConfigForm.controls['ButtonWidth'].setValue(+(this.saleConfig.ButtonWidth || 182));
    this.saleConfigForm.controls['ButtonHeight'].setValue(+(this.saleConfig.ButtonHeight || 110));
    this.saleConfigForm.controls['POSReceiptNotesHeight'].setValue(+(this.saleConfig.POSReceiptNotesHeight || 0));
    this.saleConfigForm.controls['ServiceFee'].setValue(+(this.saleConfig.ServiceFee || 0));
    this.saleConfigForm.controls['ServiceFeeType'].setValue((this.saleConfig.ServiceFeeType || 'percent').toLowerCase());
    this.saleConfigForm.controls['SendKitchen'].setValue(this.sendKitchenOptions.some(o => o.Value == this.saleConfig.SendKitchen) ? this.saleConfig.SendKitchen : 'POS');
   
   
    this.onCheck('ValidateQty', (this.saleConfig.ValidateQty || 'no').toLowerCase() == 'yes', this.saleConfig.ValidateQty, 'Boolean');
    this.onCheck('ValidatePrice', (this.saleConfig.ValidatePrice || 'no').toLowerCase() == 'yes', this.saleConfig.ValidatePrice, 'Boolean');
    this.onCheck('ReceiptNotes', this.saleConfig.ReceiptNotes, this.saleConfig.ReceiptNotes, 'String');
    this.onCheck('CloseDrawerNextDay', (this.saleConfig.CloseDrawerNextDay || 'no').toLowerCase() == 'yes', this.saleConfig.CloseDrawerNextDay, 'Boolean');
    this.onCheck('HideZeroItemQty', (this.saleConfig.HideZeroItemQty || 'no').toLowerCase() == 'yes', this.saleConfig.HideZeroItemQty, 'Boolean');
    this.onCheck('ItemsPrintByCategory', (this.saleConfig.ItemsPrintByCategory || 'no').toLowerCase() == 'yes', this.saleConfig.ItemsPrintByCategory, 'Boolean');
    this.onCheck('ItemsPrintByName', (this.saleConfig.ItemsPrintByName || 'no').toLowerCase() == 'yes', this.saleConfig.ItemsPrintByName, 'Boolean');
    this.onCheck('PrintReceipt', (this.saleConfig.PrintReceipt || 'no').toLowerCase() == 'yes', this.saleConfig.PrintReceipt, 'Boolean');
    this.onCheck('PopupQty', (this.saleConfig.PopupQty || 'no').toLowerCase() == 'yes', this.saleConfig.PopupQty, 'Boolean');
    this.onCheck('LoyaltyPoints', this.saleConfig.LoyaltyPoints, this.saleConfig.LoyaltyPoints, 'Number');
    this.onCheck('POSFontSize', this.saleConfig.POSFontSize, this.saleConfig.POSFontSize, 'Number');
    this.onCheck('POSMargin', this.saleConfig.POSMargin, this.saleConfig.POSMargin, 'Number');
    this.onCheck('ReceiptLabel', this.saleConfig.ReceiptLabel, this.saleConfig.ReceiptLabel, 'String');
    this.onCheck('HasTable', (this.saleConfig.HasTable || 'no').toLowerCase() == 'yes', this.saleConfig.HasTable, 'Boolean');
    this.onCheck('HasPhoto', (this.saleConfig.HasPhoto || 'no').toLowerCase() == 'yes', this.saleConfig.HasPhoto, 'Boolean');
    this.onCheck('OnScreenKeyboard', (this.saleConfig.OnScreenKeyboard || 'no').toLowerCase() == 'yes', this.saleConfig.OnScreenKeyboard, 'Boolean');
    this.onCheck('POSReceiptNotesHeight', +(this.saleConfig.POSReceiptNotesHeight || 0) > 0, this.saleConfig.POSReceiptNotesHeight, 'Number');
  }

  onCheck(Column, Check, Value:any, Type){
    if(Check == true){
      this.saleConfigForm.controls[Column].enable();
      if(Type == 'Number'){
        this.saleConfigForm.controls[Column].setValue(Value);
      }
      if(Type == 'String'){
        this.saleConfigForm.controls[Column].setValue(Value);
      }   
      if(Type == 'Boolean'){
        this.saleConfigForm.controls[Column].setValue('yes');
        this.saleConfigForm.controls[Column].disable();
      }
    }
    
    if(Check == false){
      this.saleConfigForm.controls[Column].disable();
      if(Type == 'Number'){
        this.saleConfigForm.controls[Column].setValue(0);
      }
      if(Type == 'String'){
        this.saleConfigForm.controls[Column].setValue('');
      }   
      if(Type == 'Boolean'){
        this.saleConfigForm.controls[Column].setValue('no');
      }
    }
  }

  onSubmit(){
    this.loading = true;
    this.cnfg_service.updateSaleConfig(this.saleConfigForm.getRawValue()).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.ngOnInit();
        this.loading = false;
      },
      error:(err)=>{
        this.notif.toastrHttpError(err, 'Unable to save the Sales Config.');
        this.loading = false;
      },
    })
  }

  onClose(){
    this.toolBoxService.onHome();
  }

  onClickSaleConfigAccessRights(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(SaleConfigAccessRightsUIComponent,dialogConfig);
  }

  onClickSaleConfigPerMachine(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(SalesConfigPerMachineComponent,dialogConfig);
  }


}
