import { Component, OnInit } from '@angular/core';
import { AccessRightsService } from '../../../../services/User/access-rights.service';
import { SaleConfigAccessRightsService } from '../../../../services/Sales/sale-config-access-rights.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { NotificationService } from '../../../../services/notification.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sale-config-access-rights-ui',
  templateUrl: './sale-config-access-rights-ui.component.html',
  styleUrls: ['./sale-config-access-rights-ui.component.css']
})
export class SaleConfigAccessRightsUIComponent implements OnInit {

  accessRights : any;
  accessRightName : any;
  saleConfigAccessRights : any=[];
  btnText   : string = "Save";
  loading   : boolean = false;
  saleConfigAccessRightForm = new FormGroup({
      AccessRightName: new FormControl(''),
      DisableTransDate : new FormControl(''),
      DisableItemDiscount : new FormControl(''),
      DisableReceiptDiscount : new FormControl(''),
      DisableOtherPrice : new FormControl(''),
      EditPrice : new FormControl(''),
      HideDrawerSales : new FormControl(''),
      HideTotalCashCount : new FormControl(''),
      PasswordEditRemovePending : new FormControl(''),
     
  });
  constructor(
    private authService : AuthService,
    private accessRightsService : AccessRightsService,
    private saleConfigAccessRightsService : SaleConfigAccessRightsService,
    private notificationService : NotificationService, 
    private dialogRef : MatDialogRef<SaleConfigAccessRightsUIComponent>,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCBOAccessRights();
    await this.getSaleConfigAccessRight();
  }

  async getCBOAccessRights(){
      this.accessRights = await firstValueFrom(this.accessRightsService.getCBOAccessRights(this.authService.Branch?.BranchId));
      this.accessRightName  = this.accessRights[0].AccessRightName;
  }

  async getSaleConfigAccessRight(){
    this.saleConfigAccessRights = await firstValueFrom(this.saleConfigAccessRightsService.getSaleConfigAccessRightByAccessRightName(this.accessRightName));
    this.getsaleConfigAccessRightFormData();
  }

  getsaleConfigAccessRightFormData(){
      this.saleConfigAccessRightForm.controls['AccessRightName'].setValue(this.accessRightName);
      this.saleConfigAccessRightForm.controls['DisableTransDate'].setValue(this.saleConfigAccessRights.DisableTransDate);
      this.saleConfigAccessRightForm.controls['DisableItemDiscount'].setValue(this.saleConfigAccessRights.DisableItemDiscount);
      this.saleConfigAccessRightForm.controls['DisableReceiptDiscount'].setValue(this.saleConfigAccessRights.DisableReceiptDiscount);
      this.saleConfigAccessRightForm.controls['DisableOtherPrice'].setValue(this.saleConfigAccessRights.DisableOtherPrice);
      this.saleConfigAccessRightForm.controls['EditPrice'].setValue(this.saleConfigAccessRights.EditPrice);
      this.saleConfigAccessRightForm.controls['HideDrawerSales'].setValue(this.saleConfigAccessRights.HideDrawerSales);
      this.saleConfigAccessRightForm.controls['HideTotalCashCount'].setValue(this.saleConfigAccessRights.HideTotalCashCount);
      this.saleConfigAccessRightForm.controls['PasswordEditRemovePending'].setValue(this.saleConfigAccessRights.PasswordEditRemovePending);

      this.onCheck('DisableTransDate', (this.saleConfigAccessRights.DisableTransDate || '').toLowerCase() == 'yes', this.saleConfigAccessRights.DisableTransDate, 'Boolean');
      this.onCheck('DisableItemDiscount', (this.saleConfigAccessRights.DisableItemDiscount || '').toLowerCase() == 'yes', this.saleConfigAccessRights.DisableItemDiscount, 'Boolean');
      this.onCheck('DisableReceiptDiscount', (this.saleConfigAccessRights.DisableReceiptDiscount || '').toLowerCase() == 'yes', this.saleConfigAccessRights.DisableReceiptDiscount, 'Boolean');
      this.onCheck('DisableOtherPrice', (this.saleConfigAccessRights.DisableOtherPrice || '').toLowerCase() == 'yes', this.saleConfigAccessRights.DisableOtherPrice, 'Boolean');
      this.onCheck('EditPrice', (this.saleConfigAccessRights.EditPrice || '').toLowerCase() == 'yes', this.saleConfigAccessRights.EditPrice, 'Boolean');
      this.onCheck('HideDrawerSales', (this.saleConfigAccessRights.HideDrawerSales || '').toLowerCase() == 'yes', this.saleConfigAccessRights.HideDrawerSales, 'Boolean');
      this.onCheck('HideTotalCashCount', (this.saleConfigAccessRights.HideTotalCashCount || '').toLowerCase() == 'yes', this.saleConfigAccessRights.HideTotalCashCount, 'Boolean');
      this.onCheck('PasswordEditRemovePending', this.saleConfigAccessRights.PasswordEditRemovePending, this.saleConfigAccessRights.PasswordEditRemovePending, 'String');
    
  }

   onCheck(Column, Check, Value:any, Type){
    if(Check == true){
      this.saleConfigAccessRightForm.controls[Column].enable();
      if(Type == 'Number'){
        this.saleConfigAccessRightForm.controls[Column].setValue(Value);
      }
      if(Type == 'String'){
        this.saleConfigAccessRightForm.controls[Column].setValue(Value);
      }   
      if(Type == 'Boolean'){
        this.saleConfigAccessRightForm.controls[Column].setValue('yes');
        this.saleConfigAccessRightForm.controls[Column].disable();
      }
    }
    
    if(Check == false){
      this.saleConfigAccessRightForm.controls[Column].disable();
      if(Type == 'Number'){
        this.saleConfigAccessRightForm.controls[Column].setValue(0);
      }
      if(Type == 'String'){
        this.saleConfigAccessRightForm.controls[Column].setValue('');
      }   
      if(Type == 'Boolean'){
        this.saleConfigAccessRightForm.controls[Column].setValue('no');
      }
    }
  }

  onSubmit(){
    this.loading = true;
    this.saleConfigAccessRightsService.updateSaleConfigAccessRight(this.saleConfigAccessRightForm.getRawValue()).subscribe({
      next:(res)=>{
        this.notificationService.toastrSuccess(res.message);
        this.loading = false;
      },
      error:(err)=>{
        this.notificationService.toastrHttpError(err, 'Unable to save the Sales Config.');
        this.loading = false;
      },
    })
  }

  onClose(){
    this.dialogRef.close();
  }

}
