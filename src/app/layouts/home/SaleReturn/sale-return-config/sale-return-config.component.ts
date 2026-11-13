import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaleReturnConfigService } from 'src/app/services/SaleReturn/sale-return-config.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-sale-return-config',
  templateUrl: './sale-return-config.component.html',
  styleUrls: ['./sale-return-config.component.css']
})
export class SaleReturnConfigComponent implements OnInit {

  btnText                   : string = "Save";
  saleReturnConfig     : any=[];
  loading                   : boolean = false;
  saleReturnConfigForm                = new FormGroup({
        AutoVoucher               : new FormControl(''),
        AutoDisburse              : new FormControl(''),
        CashCashAccount           : new FormControl(''),
        CheckCashAccount          : new FormControl(''),
        BankDepositCashAccount    : new FormControl(''),
        ReceiptLabel    : new FormControl(''),
        ReceiptNotes    : new FormControl(''),
        DisableTransDate    : new FormControl(''),
       
  });
  cash  : any=[];
  bankDeposits  : any=[];
  checks  : any=[];

  constructor(
    private configService        : SaleReturnConfigService,
    private cashAccountsService        : CashAccountsService,
    private notif               : NotificationService,
    private toolBoxService    : ToolBoxService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.saleReturnConfig = await firstValueFrom(this.configService.getSaleReturnConfig());
    await this.getCashAccounts();
   
    this.GetsaleReturnConfigFormData();
  }

  async getCashAccounts(){
    this.cash = await firstValueFrom(this.cashAccountsService.loadCashAccounts("CASH"));
    this.bankDeposits = await firstValueFrom(this.cashAccountsService.loadCashAccounts("CHECK"));
    this.checks = await firstValueFrom(this.cashAccountsService.loadCashAccounts("BANK DEPOSIT"));
  }

  GetsaleReturnConfigFormData(){

    this.saleReturnConfigForm.controls['ReceiptLabel'].setValue(this.saleReturnConfig.ReceiptLabel);
    this.saleReturnConfigForm.controls['ReceiptNotes'].setValue(this.saleReturnConfig.ReceiptNotes);
    this.saleReturnConfigForm.controls['AutoVoucher'].setValue(this.saleReturnConfig.AutoVoucher);
    this.saleReturnConfigForm.controls['AutoDisburse'].setValue(this.saleReturnConfig.AutoDisburse);
    this.saleReturnConfigForm.controls['CashCashAccount'].setValue(this.saleReturnConfig.CashCashAccount);
    this.saleReturnConfigForm.controls['CheckCashAccount'].setValue(this.saleReturnConfig.CheckCashAccount);
    this.saleReturnConfigForm.controls['BankDepositCashAccount'].setValue(this.saleReturnConfig.BankDepositCashAccount);
    this.saleReturnConfigForm.controls['DisableTransDate'].setValue(this.saleReturnConfig.DisableTransDate);
    
    this.onCheck('AutoVoucher', this.saleReturnConfig.AutoVoucher.toLowerCase() == 'yes', this.saleReturnConfig.AutoVoucher, 'Boolean');
    this.onCheck('AutoDisburse', this.saleReturnConfig.AutoDisburse.toLowerCase() == 'yes', this.saleReturnConfig.AutoDisburse, 'Boolean');
    this.onCheck('CashCashAccount', this.saleReturnConfig.CashCashAccount, this.saleReturnConfig.CashCashAccount, 'String');
    this.onCheck('CheckCashAccount', this.saleReturnConfig.CheckCashAccount, this.saleReturnConfig.CheckCashAccount, 'String');
    this.onCheck('BankDepositCashAccount', this.saleReturnConfig.BankDepositCashAccount, this.saleReturnConfig.BankDepositCashAccount, 'String');
    this.onCheck('ReceiptLabel', this.saleReturnConfig.ReceiptLabel, this.saleReturnConfig.ReceiptLabel, 'String');
    this.onCheck('ReceiptNotes', this.saleReturnConfig.ReceiptNotes, this.saleReturnConfig.ReceiptNotes, 'String');
    this.onCheck('DisableTransDate', this.saleReturnConfig.DisableTransDate.toLowerCase() == 'yes', this.saleReturnConfig.DisableTransDate, 'Boolean');

  }

  onCheck(Column, Check, Value:any, Type){
    if(Check == true){
      this.saleReturnConfigForm.controls[Column].enable();
      if(Type == 'Number'){
        this.saleReturnConfigForm.controls[Column].setValue(Value);
      }
      if(Type == 'String'){
        this.saleReturnConfigForm.controls[Column].setValue(Value);
      }   
      if(Type == 'Boolean'){
        this.saleReturnConfigForm.controls[Column].setValue('yes');
        this.saleReturnConfigForm.controls[Column].disable();
      }
    }
    
    if(Check == false){
      this.saleReturnConfigForm.controls[Column].disable();
      if(Type == 'Number'){
        this.saleReturnConfigForm.controls[Column].setValue(0);
      }
      if(Type == 'String'){
        this.saleReturnConfigForm.controls[Column].setValue('');
      }   
      if(Type == 'Boolean'){
        this.saleReturnConfigForm.controls[Column].setValue('no');
      }
    }

    if(Column.toLowerCase() == 'autodisburse'){
      if(Check == true){
        this.onCheck('AutoVoucher', false, 'no', 'Boolean');
        this.saleReturnConfig.AutoVoucher ='no';

        this.saleReturnConfigForm.controls['CashCashAccount'].enable();
        this.saleReturnConfigForm.controls['CheckCashAccount'].enable();
        this.saleReturnConfigForm.controls['BankDepositCashAccount'].enable();
      }
      else{
        this.onCheck('AutoVoucher', true, 'yes', 'Boolean');
        this.saleReturnConfig.AutoVoucher ='yes';

        this.saleReturnConfigForm.controls['CashCashAccount'].disable();
        this.saleReturnConfigForm.controls['CheckCashAccount'].disable();
        this.saleReturnConfigForm.controls['BankDepositCashAccount'].disable();
      }
    }
  }

  onSubmit(){
    this.loading = true;
    this.configService.updateSaleReturnConfig(this.saleReturnConfigForm.getRawValue()).subscribe({
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
