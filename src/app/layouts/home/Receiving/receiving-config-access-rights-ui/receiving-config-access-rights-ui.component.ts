import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ReceivingConfigAccessRightsService } from 'src/app/services/Receiving/receiving-config-access-rights.service';
import { AccessRightsService } from 'src/app/services/User/access-rights.service';

@Component({
  selector: 'app-receiving-config-access-rights-ui',
  templateUrl: './receiving-config-access-rights-ui.component.html',
  styleUrls: ['./receiving-config-access-rights-ui.component.css']
})
export class ReceivingConfigAccessRightsUIComponent implements OnInit {

  accessRights : any;
  accessRightName : any;
  receivingConfigAccessRights : any=[];
  btnText   : string = "Save";
  loading   : boolean = false;
  receivingConfigAccessRightForm = new FormGroup({
      AccessRightName: new FormControl(''),
      HideCost : new FormControl(''),
      HidePrice : new FormControl(''),
      EditPrice : new FormControl(''),
  });
  constructor(
    private authService : AuthService,
    private accessRightsService : AccessRightsService,
    private receivingConfigAccessRightsService : ReceivingConfigAccessRightsService,
    private notificationService : NotificationService, 
    private dialogRef : MatDialogRef<ReceivingConfigAccessRightsUIComponent>,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCBOAccessRights();
    await this.getReceivingConfigAccessRight();
  }

  async getCBOAccessRights(){
      this.accessRights = await firstValueFrom(this.accessRightsService.getCBOAccessRights(this.authService.Branch?.BranchId));
      this.accessRightName  = this.accessRights[0].AccessRightName;
  }

  async getReceivingConfigAccessRight(){
    this.receivingConfigAccessRights = await firstValueFrom(this.receivingConfigAccessRightsService.getReceivingConfigAccessRightByAccessRightName(this.accessRightName));
    this.getreceivingConfigAccessRightFormData();
  }

  getreceivingConfigAccessRightFormData(){
      this.receivingConfigAccessRightForm.controls['AccessRightName'].setValue(this.accessRightName);
      this.receivingConfigAccessRightForm.controls['HideCost'].setValue(this.receivingConfigAccessRights.HideCost);
      this.receivingConfigAccessRightForm.controls['HidePrice'].setValue(this.receivingConfigAccessRights.HidePrice);
      this.receivingConfigAccessRightForm.controls['EditPrice'].setValue(this.receivingConfigAccessRights.EditPrice);

      this.onCheck('HideCost', this.receivingConfigAccessRights.HideCost.toLowerCase() == 'yes', this.receivingConfigAccessRights.HideCost, 'Boolean');
      this.onCheck('HidePrice', this.receivingConfigAccessRights.HidePrice.toLowerCase() == 'yes', this.receivingConfigAccessRights.HidePrice, 'Boolean');
      this.onCheck('EditPrice', this.receivingConfigAccessRights.EditPrice.toLowerCase() == 'yes', this.receivingConfigAccessRights.EditPrice, 'Boolean');

  }

   onCheck(Column, Check, Value:any, Type){
    if(Check == true){
      this.receivingConfigAccessRightForm.controls[Column].enable();
      if(Type == 'Number'){
        this.receivingConfigAccessRightForm.controls[Column].setValue(Value);
      }
      if(Type == 'String'){
        this.receivingConfigAccessRightForm.controls[Column].setValue(Value);
      }   
      if(Type == 'Boolean'){
        this.receivingConfigAccessRightForm.controls[Column].setValue('yes');
        this.receivingConfigAccessRightForm.controls[Column].disable();
      }
    }
    
    if(Check == false){
      this.receivingConfigAccessRightForm.controls[Column].disable();
      if(Type == 'Number'){
        this.receivingConfigAccessRightForm.controls[Column].setValue(0);
      }
      if(Type == 'String'){
        this.receivingConfigAccessRightForm.controls[Column].setValue('');
      }   
      if(Type == 'Boolean'){
        this.receivingConfigAccessRightForm.controls[Column].setValue('no');
      }
    }
  }

  onSubmit(){
    this.loading = true;
    this.receivingConfigAccessRightsService.updateReceivingConfigAccessRight(this.receivingConfigAccessRightForm.getRawValue()).subscribe({
      next:(res)=>{
        this.notificationService.toastrSuccess(res.message);
        this.loading = false;
      },
      error:(err)=>{
        this.notificationService.toastrError(err.error);
        this.loading = false;
      },
    })
  }

  onClose(){
    this.dialogRef.close();
  }

}
