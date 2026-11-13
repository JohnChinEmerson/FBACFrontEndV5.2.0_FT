import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PayableConfigService } from 'src/app/services/Payables/payable-config.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-payable-config',
  templateUrl: './payable-config.component.html',
  styleUrls: ['./payable-config.component.css']
})
export class PayableConfigComponent implements OnInit {

 btnText                   : string = "Save";
  payableConfig     : any=[];
  loading                   : boolean = false;
  payableConfigForm                = new FormGroup({
        AutoVoucher               : new FormControl(''),
        AutoDisburse              : new FormControl(''),
        CashCashAccount           : new FormControl(''),
        CashCashAccountType           : new FormControl(''),
        CheckCashAccount          : new FormControl(''),
        CheckCashAccountType          : new FormControl(''),
        BankDepositCashAccount    : new FormControl(''),
        BankDepositCashAccountType    : new FormControl(''),
       
  });
  cash  : any=[];
  bankDeposits  : any=[];
  checks  : any=[];

  constructor(
    private configService        : PayableConfigService,
    private cashAccountsService        : CashAccountsService,
    private notif               : NotificationService,
    private toolBoxService    : ToolBoxService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.payableConfig = await firstValueFrom(this.configService.getPayableConfig());
    await this.getCashAccounts();
   
    this.GetpayableConfigFormData();
  }

  async getCashAccounts(){
    this.cash = await firstValueFrom(this.cashAccountsService.loadCashAccounts("CASH"));
    this.bankDeposits = await firstValueFrom(this.cashAccountsService.loadCashAccounts("CHECK"));
    this.checks = await firstValueFrom(this.cashAccountsService.loadCashAccounts("BANK DEPOSIT"));
  }

  GetpayableConfigFormData(){
    this.payableConfigForm.controls['AutoVoucher'].setValue(this.payableConfig.AutoVoucher);
    this.payableConfigForm.controls['AutoDisburse'].setValue(this.payableConfig.AutoDisburse);
    this.payableConfigForm.controls['CashCashAccount'].setValue(this.payableConfig.CashCashAccount);
    this.payableConfigForm.controls['CheckCashAccount'].setValue(this.payableConfig.CheckCashAccount);
    this.payableConfigForm.controls['BankDepositCashAccount'].setValue(this.payableConfig.BankDepositCashAccount);

    this.payableConfigForm.controls['CashCashAccountType'].setValue(this.payableConfig.CashCashAccountType);
    this.payableConfigForm.controls['CheckCashAccountType'].setValue(this.payableConfig.CheckCashAccountType);
    this.payableConfigForm.controls['BankDepositCashAccountType'].setValue(this.payableConfig.BankDepositCashAccountType);

    
    this.onCheck('AutoVoucher', this.payableConfig.AutoVoucher.toLowerCase() == 'yes', this.payableConfig.AutoVoucher, 'Boolean');
    this.onCheck('AutoDisburse', this.payableConfig.AutoDisburse.toLowerCase() == 'yes', this.payableConfig.AutoDisburse, 'Boolean');
    this.onCheck('CashCashAccount', this.payableConfig.CashCashAccount, this.payableConfig.CashCashAccount, 'String');
    this.onCheck('CheckCashAccount', this.payableConfig.CheckCashAccount, this.payableConfig.CheckCashAccount, 'String');
    this.onCheck('BankDepositCashAccount', this.payableConfig.BankDepositCashAccount, this.payableConfig.BankDepositCashAccount, 'String');
  }

  onCheck(Column, Check, Value:any, Type){
    if(Check == true){
      this.payableConfigForm.controls[Column].enable();
      if(Type == 'Number'){
        this.payableConfigForm.controls[Column].setValue(Value);
      }
      if(Type == 'String'){
        this.payableConfigForm.controls[Column].setValue(Value);
      }   
      if(Type == 'Boolean'){
        this.payableConfigForm.controls[Column].setValue('yes');
        this.payableConfigForm.controls[Column].disable();
      }
    }
    
    if(Check == false){
      this.payableConfigForm.controls[Column].disable();
      if(Type == 'Number'){
        this.payableConfigForm.controls[Column].setValue(0);
      }
      if(Type == 'String'){
        this.payableConfigForm.controls[Column].setValue('');
      }   
      if(Type == 'Boolean'){
        this.payableConfigForm.controls[Column].setValue('no');
      }
    }

    if(Column.toLowerCase() == 'autodisburse'){
      if(Check == true){
        this.onCheck('AutoVoucher', false, 'no', 'Boolean');
        this.payableConfig.AutoVoucher ='no';

        this.payableConfigForm.controls['CashCashAccount'].enable();
        this.payableConfigForm.controls['CheckCashAccount'].enable();
        this.payableConfigForm.controls['BankDepositCashAccount'].enable();
      }
      else{
        this.onCheck('AutoVoucher', true, 'yes', 'Boolean');
        this.payableConfig.AutoVoucher ='yes';

        this.payableConfigForm.controls['CashCashAccount'].disable();
        this.payableConfigForm.controls['CheckCashAccount'].disable();
        this.payableConfigForm.controls['BankDepositCashAccount'].disable();
      }
    }
  }

  onChangeBankDepositCashAccount(data){
    this.payableConfigForm.controls['BankDepositCashAccountType'].setValue(data.CashAccountType);
  }

  onChangeCheckCashAccount(data){
    this.payableConfigForm.controls['CheckCashAccountType'].setValue(data.CashAccountType);
  }

  onChangeCashCashAccount(data){
    this.payableConfigForm.controls['CashCashAccountType'].setValue(data.CashAccountType);
  }
  onSubmit(){
    this.loading = true;
    this.configService.updatePayableConfig(this.payableConfigForm.getRawValue()).subscribe({
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
