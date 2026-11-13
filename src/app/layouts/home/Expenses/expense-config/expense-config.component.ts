import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { ExpenseConfigService } from 'src/app/services/Expenses/expense-config.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-expense-config',
  templateUrl: './expense-config.component.html',
  styleUrls: ['./expense-config.component.css']
})
export class ExpenseConfigComponent implements OnInit {

  btnText                   : string = "Save";
  expenseConfig     : any=[];
  loading                   : boolean = false;
  expenseConfigForm                = new FormGroup({
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
    private configService        : ExpenseConfigService,
    private cashAccountsService        : CashAccountsService,
    private notif               : NotificationService,
    private toolBoxService    : ToolBoxService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.expenseConfig = await firstValueFrom(this.configService.getExpenseConfig());
    await this.getCashAccounts();
   
    this.GetexpenseConfigFormData();
  }

  async getCashAccounts(){
    this.cash = await firstValueFrom(this.cashAccountsService.loadCashAccounts("CASH"));
    this.bankDeposits = await firstValueFrom(this.cashAccountsService.loadCashAccounts("CHECK"));
    this.checks = await firstValueFrom(this.cashAccountsService.loadCashAccounts("BANK DEPOSIT"));
  }

  GetexpenseConfigFormData(){
    this.expenseConfigForm.controls['AutoVoucher'].setValue(this.expenseConfig.AutoVoucher);
    this.expenseConfigForm.controls['AutoDisburse'].setValue(this.expenseConfig.AutoDisburse);
    this.expenseConfigForm.controls['CashCashAccount'].setValue(this.expenseConfig.CashCashAccount);
    this.expenseConfigForm.controls['CheckCashAccount'].setValue(this.expenseConfig.CheckCashAccount);
    this.expenseConfigForm.controls['BankDepositCashAccount'].setValue(this.expenseConfig.BankDepositCashAccount);

    this.expenseConfigForm.controls['CashCashAccountType'].setValue(this.expenseConfig.CashCashAccountType);
    this.expenseConfigForm.controls['CheckCashAccountType'].setValue(this.expenseConfig.CheckCashAccountType);
    this.expenseConfigForm.controls['BankDepositCashAccountType'].setValue(this.expenseConfig.BankDepositCashAccountType);

    
    this.onCheck('AutoVoucher', this.expenseConfig.AutoVoucher.toLowerCase() == 'yes', this.expenseConfig.AutoVoucher, 'Boolean');
    this.onCheck('AutoDisburse', this.expenseConfig.AutoDisburse.toLowerCase() == 'yes', this.expenseConfig.AutoDisburse, 'Boolean');
    this.onCheck('CashCashAccount', this.expenseConfig.CashCashAccount, this.expenseConfig.CashCashAccount, 'String');
    this.onCheck('CheckCashAccount', this.expenseConfig.CheckCashAccount, this.expenseConfig.CheckCashAccount, 'String');
    this.onCheck('BankDepositCashAccount', this.expenseConfig.BankDepositCashAccount, this.expenseConfig.BankDepositCashAccount, 'String');
  }

  onCheck(Column, Check, Value:any, Type){
    if(Check == true){
      this.expenseConfigForm.controls[Column].enable();
      if(Type == 'Number'){
        this.expenseConfigForm.controls[Column].setValue(Value);
      }
      if(Type == 'String'){
        this.expenseConfigForm.controls[Column].setValue(Value);
      }   
      if(Type == 'Boolean'){
        this.expenseConfigForm.controls[Column].setValue('yes');
        this.expenseConfigForm.controls[Column].disable();
      }
    }
    
    if(Check == false){
      this.expenseConfigForm.controls[Column].disable();
      if(Type == 'Number'){
        this.expenseConfigForm.controls[Column].setValue(0);
      }
      if(Type == 'String'){
        this.expenseConfigForm.controls[Column].setValue('');
      }   
      if(Type == 'Boolean'){
        this.expenseConfigForm.controls[Column].setValue('no');
      }
    }

    if(Column.toLowerCase() == 'autodisburse'){
      if(Check == true){
        this.onCheck('AutoVoucher', false, 'no', 'Boolean');
        this.expenseConfig.AutoVoucher ='no';

        this.expenseConfigForm.controls['CashCashAccount'].enable();
        this.expenseConfigForm.controls['CheckCashAccount'].enable();
        this.expenseConfigForm.controls['BankDepositCashAccount'].enable();
      }
      else{
        this.onCheck('AutoVoucher', true, 'yes', 'Boolean');
        this.expenseConfig.AutoVoucher ='yes';

        this.expenseConfigForm.controls['CashCashAccount'].disable();
        this.expenseConfigForm.controls['CheckCashAccount'].disable();
        this.expenseConfigForm.controls['BankDepositCashAccount'].disable();
      }
    }
  }

  onChangeBankDepositCashAccount(data){
    this.expenseConfigForm.controls['BankDepositCashAccountType'].setValue(data.CashAccountType);
  }

  onChangeCheckCashAccount(data){
    this.expenseConfigForm.controls['CheckCashAccountType'].setValue(data.CashAccountType);
  }

  onChangeCashCashAccount(data){
    this.expenseConfigForm.controls['CashCashAccountType'].setValue(data.CashAccountType);
  }
  onSubmit(){
    this.loading = true;
    this.configService.updateExpenseConfig(this.expenseConfigForm.getRawValue()).subscribe({
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
