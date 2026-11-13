import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ReceivingConfigService } from 'src/app/services/Receiving/receiving-config.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { ReceivingConfigAccessRightsUIComponent } from '../receiving-config-access-rights-ui/receiving-config-access-rights-ui.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-receiving-config',
  templateUrl: './receiving-config.component.html',
  styleUrls: ['./receiving-config.component.css']
})
export class ReceivingConfigComponent implements OnInit {

  btnText                   : string = "Save";
  receivingConfig     : any=[];
  loading                   : boolean = false;
  receivingConfigForm                = new FormGroup({
        AutoAdjustPriceCostUp     : new FormControl(''),
        AutoAdjustPriceCostDown   : new FormControl(''),
        AutoVoucher               : new FormControl(''),
        AutoDisburse              : new FormControl(''),
        CashCashAccount           : new FormControl(''),
        CheckCashAccount          : new FormControl(''),
        BankDepositCashAccount    : new FormControl(''),
       
  });
  cash  : any=[];
  bankDeposits  : any=[];
  checks  : any=[];

  constructor(
    private configService        : ReceivingConfigService,
    private cashAccountsService        : CashAccountsService,
    private notif               : NotificationService,
    private toolBoxService    : ToolBoxService,
    private dialog : MatDialog,
  ) { }

  async ngOnInit(): Promise<void> {
    this.receivingConfig = await firstValueFrom(this.configService.getReceivingConfig());
    await this.getCashAccounts();
   
    this.GetreceivingConfigFormData();
  }

  async getCashAccounts(){
    this.cash = await firstValueFrom(this.cashAccountsService.loadCashAccounts("CASH"));
    this.bankDeposits = await firstValueFrom(this.cashAccountsService.loadCashAccounts("CHECK"));
    this.checks = await firstValueFrom(this.cashAccountsService.loadCashAccounts("BANK DEPOSIT"));
  }

  GetreceivingConfigFormData(){
    

    this.receivingConfigForm.controls['AutoAdjustPriceCostUp'].setValue(this.receivingConfig.AutoAdjustPriceCostUp);
    this.receivingConfigForm.controls['AutoAdjustPriceCostDown'].setValue(this.receivingConfig.AutoAdjustPriceCostDown);
    this.receivingConfigForm.controls['AutoVoucher'].setValue(this.receivingConfig.AutoVoucher);
    this.receivingConfigForm.controls['AutoDisburse'].setValue(this.receivingConfig.AutoDisburse);
    this.receivingConfigForm.controls['CashCashAccount'].setValue(this.receivingConfig.CashCashAccount);
    this.receivingConfigForm.controls['CheckCashAccount'].setValue(this.receivingConfig.CheckCashAccount);
    this.receivingConfigForm.controls['BankDepositCashAccount'].setValue(this.receivingConfig.BankDepositCashAccount);
    
    this.onCheck('AutoAdjustPriceCostUp', this.receivingConfig.AutoAdjustPriceCostUp.toLowerCase() == 'yes', this.receivingConfig.AutoAdjustPriceCostUp, 'Boolean');
    this.onCheck('AutoAdjustPriceCostDown', this.receivingConfig.AutoAdjustPriceCostDown.toLowerCase() == 'yes', this.receivingConfig.AutoAdjustPriceCostDown, 'Boolean');
    this.onCheck('AutoVoucher', this.receivingConfig.AutoVoucher.toLowerCase() == 'yes', this.receivingConfig.AutoVoucher, 'Boolean');
    this.onCheck('AutoDisburse', this.receivingConfig.AutoDisburse.toLowerCase() == 'yes', this.receivingConfig.AutoDisburse, 'Boolean');
    this.onCheck('CashCashAccount', this.receivingConfig.CashCashAccount, this.receivingConfig.CashCashAccount, 'String');
    this.onCheck('CheckCashAccount', this.receivingConfig.CheckCashAccount, this.receivingConfig.CheckCashAccount, 'String');
    this.onCheck('BankDepositCashAccount', this.receivingConfig.BankDepositCashAccount, this.receivingConfig.BankDepositCashAccount, 'String');
  }

  onCheck(Column, Check, Value:any, Type){
    if(Check == true){
      this.receivingConfigForm.controls[Column].enable();
      if(Type == 'Number'){
        this.receivingConfigForm.controls[Column].setValue(Value);
      }
      if(Type == 'String'){
        this.receivingConfigForm.controls[Column].setValue(Value);
      }   
      if(Type == 'Boolean'){
        this.receivingConfigForm.controls[Column].setValue('yes');
        this.receivingConfigForm.controls[Column].disable();
      }
    }
    
    if(Check == false){
      this.receivingConfigForm.controls[Column].disable();
      if(Type == 'Number'){
        this.receivingConfigForm.controls[Column].setValue(0);
      }
      if(Type == 'String'){
        this.receivingConfigForm.controls[Column].setValue('');
      }   
      if(Type == 'Boolean'){
        this.receivingConfigForm.controls[Column].setValue('no');
      }
    }

    if(Column.toLowerCase() == 'autodisburse'){
      if(Check == true){
        this.onCheck('AutoVoucher', false, 'no', 'Boolean');
        this.receivingConfig.AutoVoucher ='no';

        this.receivingConfigForm.controls['CashCashAccount'].enable();
        this.receivingConfigForm.controls['CheckCashAccount'].enable();
        this.receivingConfigForm.controls['BankDepositCashAccount'].enable();
      }
      else{
        this.onCheck('AutoVoucher', true, 'yes', 'Boolean');
        this.receivingConfig.AutoVoucher ='yes';

        this.receivingConfigForm.controls['CashCashAccount'].disable();
        this.receivingConfigForm.controls['CheckCashAccount'].disable();
        this.receivingConfigForm.controls['BankDepositCashAccount'].disable();
      }
    }
  }

  onSubmit(){
    this.loading = true;
    this.configService.updateReceivingConfig(this.receivingConfigForm.getRawValue()).subscribe({
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

  onClickReceivingConfigAccessRights(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(ReceivingConfigAccessRightsUIComponent,dialogConfig);
  }


}
