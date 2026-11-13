import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { EmployeesService } from 'src/app/services/Files/employees.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PrintService } from 'src/app/services/print.service';
import { VoucherTransService } from 'src/app/services/Vouchering/voucher-trans.service';
import { EmployeesUIComponent } from '../../Files/employees-ui/employees-ui.component';
import { DisbursementTransactionService } from 'src/app/services/Disbursements/disbursement-transaction.service';
import { BanksService } from 'src/app/services/Cashflow/banks.service';
import { CheckBookletsService } from 'src/app/services/Cashflow/check-booklets.service';
import { AuthService } from 'src/app/services/auth.service';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';
import { MatTableService } from 'src/app/services/mat-table.service';
import { UnpaidSupplierChecksUIComponent } from '../../SupplierChecks/unpaid-supplier-checks-ui/unpaid-supplier-checks-ui.component';
import { SupplierChecksComponent } from '../../SupplierChecks/supplier-checks/supplier-checks.component';
import { SupplierChecksService } from 'src/app/services/SupplierChecks/supplier-checks.service';

@Component({
  selector: 'app-disbursement-transaction-ui',
  templateUrl: './disbursement-transaction-ui.component.html',
  styleUrls: ['./disbursement-transaction-ui.component.css']
})
export class DisbursementTransactionUIComponent implements OnInit {
  btnText           : string = "Save";
  voucher     : any=[];
  dHeader     : any=[];
  employees          : any=[];
  action              : string;
  paymentTypes: any=[];
  paymentType :any;
  loading                   : boolean = false;
  cashAccounts:any=[];
  checks:any=[];
  checkbooklets:any=[];
  disbursmentTransForm                = new FormGroup({
        TransNo             : new FormControl(''),
        TransName           : new FormControl(''),
        TableName           : new FormControl(''),
        TransDate         : new FormControl(new Date()),
        InvNo               : new FormControl('-'),
        VoucherNo               : new FormControl(''),
        VoucherType               : new FormControl(''),
        PayToId             : new FormControl(''),
        PayToName           : new FormControl(''),
        PaymentType         : new FormControl(''),
        CheckId         : new FormControl(''),
        CheckDate2         : new FormControl(''),
        CheckDate         : new FormControl(''),
        CheckNo         : new FormControl(''),
        AmountPaid              : new FormControl('0'),
        CashAccount              : new FormControl(''),
        CashAccountType              : new FormControl(''),
        Description              : new FormControl(''),
        ReceivedBy              : new FormControl('NA'),
        ReceivedById              : new FormControl('NA'),
        CheckBookLet: new FormControl('NA'),
  });
  txtSourceTransNoDisabled: boolean = false;
  cboPaymentTypeDisabled: boolean = false;
  cboPayToNameDisabled: boolean = false;
  requiredCashAccount :boolean = false;
  requiredCheck : boolean = false;
  requiredBank :boolean = false;
  printReceipt: boolean = false;
  disablePrintReceipt: boolean = false;
  selectCheck: boolean = false;
  constructor(
    private dialog              : MatDialog,
    private dialogRef              : MatDialogRef<DisbursementTransactionUIComponent>,
    private disbursementTransactionService : DisbursementTransactionService,
    private employeesService    : EmployeesService,
    private notif               : NotificationService,
    private numbersService      : NumbersService,
    private checkBookletsService    : CheckBookletsService,
    private router      : Router,
    private printService : PrintService,
    private dateTimesService    : DateTimesService,
    private cashAccountsService : CashAccountsService,
    private authService : AuthService,
    private matTableService : MatTableService,
    private supplierChecksService : SupplierChecksService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  async ngOnInit(): Promise<void> {
    this.voucher = this.data[0];
    this.action = this.data[1];
    this.dHeader = this.data[2];
    
    this.getPaymentType('Cash');
    this.getEmployees();

    if(this.action == 'updatedisbursementfromrecords'){
      this.btnText = 'Update';
      this.setVoucher();
      this.GetdisbursmentTransFormData2();
    }
    if(this.action == 'generatedisbursement'){
      this.ToggleVoucher(true);
      this.disbursmentTransForm.controls['AmountPaid'].disable();
      this.GetdisbursmentTransFormData();
    }
  }
  async getPaymentType(customerId){
    this.paymentTypes = await firstValueFrom(this.cashAccountsService.setPaymentTypes(customerId, false));
  }
  async getEmployees(){
    this.employees = await firstValueFrom(this.employeesService.getEmployees());
    var a:any = {
      EmpId:'NA',
      EmpName:'NA',
    }
    this.employees.push(a);
  }

 async  GetdisbursmentTransFormData(){
    this.DisplayVoucherInfo();
    this.disbursmentTransForm.controls['TransDate'].setValue(new Date());
    this.disbursmentTransForm.controls['PayToName'].disable();
    this.disbursmentTransForm.controls['TransNo'].disable();
    await this.onChangePaymentType(this.voucher.PaymentType);
  }


  DisplayVoucherInfo(){
    this.disbursmentTransForm.controls['TransName'].setValue(this.voucher.TransName);
    this.disbursmentTransForm.controls['VoucherNo'].setValue(this.voucher.VoucherNo);
    this.disbursmentTransForm.controls['VoucherType'].setValue(this.voucher.VoucherType);
    this.disbursmentTransForm.controls['TransNo'].setValue(this.voucher.TransNo);
    this.disbursmentTransForm.controls['InvNo'].setValue(this.voucher.InvNo);
    this.disbursmentTransForm.controls['PayToId'].setValue(this.voucher.PayToId);
    this.disbursmentTransForm.controls['PayToName'].setValue(this.voucher.PayToName);
    this.disbursmentTransForm.controls['TableName'].setValue(this.voucher.TableName);
    this.disbursmentTransForm.controls['PaymentType'].setValue(this.voucher.PaymentType);
    this.disbursmentTransForm.controls['AmountPaid'].setValue(this.numbersService.Convert2Decimal(this.voucher.Amount));
  }

  setVoucher(){
    this.voucher = 
    {
        TransName  : this.dHeader.TransName,
        PayToId  : this.dHeader.PayToId,
        PayToName  : this.dHeader.PayToName,
        TableName  : this.dHeader.TableName,
        VoucherNo  : this.dHeader.VoucherNo,
        TransNo  : this.dHeader.TransNo,
        InvNo  : this.dHeader.InvNo,
        Amount  : this.dHeader.AmountPaid,
        PaymentType  : this.dHeader.PaymentType,
        VoucherType  : this.dHeader.VoucherType,
    };
  }
  async  GetdisbursmentTransFormData2(){
      this.DisplayVoucherInfo();
      this.disbursmentTransForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.dHeader.TransDate)));
      if(this.dHeader.CheckDate != 'NA'){
        this.disbursmentTransForm.controls['CheckDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.dHeader.CheckDate)));
      }
      this.disbursmentTransForm.controls['CheckId'].setValue(this.dHeader.CheckId);
      this.disbursmentTransForm.controls['CheckNo'].setValue(this.dHeader.CheckNo);
      this.disbursmentTransForm.controls['CheckDate'].setValue(this.dHeader.CheckDate);
      this.disbursmentTransForm.controls['CashAccount'].setValue(this.dHeader.CashAccount);
      this.disbursmentTransForm.controls['CashAccountType'].setValue(this.dHeader.CashAccountType);
      this.disbursmentTransForm.controls['Description'].setValue(this.dHeader.Description);
      this.disbursmentTransForm.controls['ReceivedBy'].setValue(this.dHeader.ReceivedBy);
      this.disbursmentTransForm.controls['ReceivedById'].setValue(this.dHeader.ReceivedById);
      this.disbursmentTransForm.controls['PaymentType'].setValue(this.dHeader.PaymentType);
      await this.onChangePaymentType(this.dHeader.PaymentType);

      if( this.dHeader.EditableVoucherNo.toLowerCase() == "yes"){
        this.disbursmentTransForm.controls['VoucherNo'].enable();
      }else{
        this.disbursmentTransForm.controls['VoucherNo'].disable();
      }

      if( this.dHeader.EditableTransNo.toLowerCase() == "yes"){
        this.disbursmentTransForm.controls['TransNo'].enable();
      }else{
        this.disbursmentTransForm.controls['TransNo'].disable();
      }
  }
 ToggleVoucher(value)
  {
    if(value){
      this.disbursmentTransForm.controls['PayToName'].disable();
      this.disbursmentTransForm.controls['VoucherNo'].disable();
      this.disbursmentTransForm.controls['TransNo'].disable();
    }
    else{
      this.disbursmentTransForm.controls['PayToName'].enable();
      this.disbursmentTransForm.controls['VoucherNo'].enable();
      this.disbursmentTransForm.controls['TransNo'].enable();
    }
  }

  async getcashAccounts(){
    this.cashAccounts = await firstValueFrom(this.cashAccountsService.loadCashAccounts(this.paymentType));
  }
  async getCheckbooklets(){
    this.checkbooklets = await firstValueFrom(this.checkBookletsService.getCheckBookletsByCashAccount(this.disbursmentTransForm.controls['CashAccount'].value, this.authService.Branch.BranchId));
    this.checkbooklets.forEach(x => {
      x.Detail = x.Prefix+x.StartNo+'-'+x.Prefix+x.EndNo
    });

    var a:any = {
      Detail :'NA',
      TransNo : 'NA'
    }

    this.checkbooklets.push(a);
    this.disbursmentTransForm.controls['CheckBookLet'].setValue('NA')

  }

  async onChangePaymentType(paymentType)
  {
      this.paymentType = paymentType.toLowerCase();
      await this.getcashAccounts();
      
      this.ToggleCheck(this.paymentType.toLowerCase() == "check");
  }

  ToggleCheck(value){
    if(value){
      this.disbursmentTransForm.controls['CheckNo'].enable();
      this.disbursmentTransForm.controls['CheckDate'].enable();
      this.disbursmentTransForm.controls['CheckBookLet'].enable();
      this.requiredCheck = true;
    }else{
      this.disbursmentTransForm.controls['CheckNo'].disable();
      this.disbursmentTransForm.controls['CheckDate'].disable();
      this.disbursmentTransForm.controls['CheckBookLet'].disable();
      this.requiredCheck = false;
    }
    this.selectCheck = value;
  }

  async onChangeCashAccount(){
    await this.getCheckbooklets();
  }


  onChangeCheckBookLet(data)
  {
    if (this.disbursmentTransForm.controls['CashAccount'].value.toLowerCase() != "" && this.disbursmentTransForm.controls['CashAccount'].value.toLowerCase() != "na")
      {
          if (this.checkbooklets != null)
          {
              if (this.checkbooklets.length > 1 && this.paymentType.toLowerCase() == "check"){
                if (data.Prefix.toUpperCase() != "NA"){
                  var txtCheckNo = data.Prefix + (+data.StartNo + +data.Issued);
                }
                else{
                  txtCheckNo = "";
                }
                this.disbursmentTransForm.controls['CheckNo'].setValue(txtCheckNo);

              }
          }
      }
  }

  onChangeReceivedById(data){
    this.disbursmentTransForm.controls['ReceivedBy'].setValue(data.EmpName);
  }

  onClickEmployees(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(EmployeesUIComponent,dialogConfig).beforeClosed().subscribe(x=>{
      this.getEmployees();
    })
  }
async onClickSelectCheck(){

  var supplierChecks:any = await firstValueFrom(this.supplierChecksService.getUnPaidSupplierChecks(this.disbursmentTransForm.controls['PayToId'].value ));
  var cC:any = supplierChecks.filter(x =>Number(x.Amount).toFixed(2) ==Number(this.disbursmentTransForm.controls['AmountPaid'].value).toFixed(2));
  if(!cC[0]){
    this.disbursmentTransForm.controls['PaymentType'].setValue('CASH');
    await this.onChangePaymentType('CASH');
    return this.notif.toastrWarning('No Check Amounting to ' +Number(this.disbursmentTransForm.controls['AmountPaid'].value).toFixed(2));
  }
  else{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = ([this.disbursmentTransForm.controls['PayToId'].value,'disbursementtransactionui']);
    this.dialog.open(UnpaidSupplierChecksUIComponent,dialogConfig).beforeClosed().subscribe(async supplierCheck => {
      if(supplierCheck){
        this.disbursmentTransForm.controls['CheckId'].setValue(supplierCheck.CheckId);
        this.disbursmentTransForm.controls['CheckNo'].setValue(supplierCheck.CheckNo);
        this.disbursmentTransForm.controls['CheckDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(supplierCheck.CheckDate)));
        this.disbursmentTransForm.controls['CashAccount'].setValue(supplierCheck.CashAccount);
        await this.getCheckbooklets();

      }

    });

  }

}
  onSubmit(){
   if(!this.matTableService.CommonTransaction()){
      return;
    }
    this.loading = true;
    var dates = ['TransDate', 'CheckDate'];

    dates.forEach(field => {
      const control = this.disbursmentTransForm.controls[field];
    
      if (control?.value) {
        const dateValue = new Date(control.value);
    
        if (!isNaN(dateValue.getTime())) {  
          control.setValue(this.dateTimesService.ConvertToDateFormat(dateValue));
        }
      }
    });
    

    var data:any = {
      'voucher' : this.voucher,
      'dHeader' : this.dHeader,
      'request' : this.disbursmentTransForm.getRawValue(),
    }
    this.disbursementTransactionService.saveEditDisbursementHeader(data, this.btnText).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.disbursementHeader);
          if(this.printReceipt){
            this.print(res.disbursementHeader);
          }
        this.loading = false;
      },
      error:(err)=>{
        this.notif.toastrError(err.error);
        this.loading = false;
      },
    })
  }

  print(disbursementHeader) {
    
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printdisbursementreceipt']));
    var title = 'DISBURSEMENT RECEIPT OF  - ' + disbursementHeader.VoucherNo ;
    
    this.printService.popupWindow(url, 'printdisbursementreceipt', window, 800, 800);
    localStorage.setItem('Disbursement', JSON.stringify(disbursementHeader));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', disbursementHeader.VoucherNo);
  }
  

  onClose(){
    this.dialogRef.close();
  }
  onChangePrintReceipt(value){
    this.printReceipt = value;
   }
   onClickSignatures(){
    if(this.btnText.toLowerCase() == 'update'){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([this.dHeader.DisburseNo, 'DisbursementHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([null, 'DisbursementHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }
  }

}
