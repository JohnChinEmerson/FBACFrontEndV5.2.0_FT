import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { DisbursementHeadersService } from 'src/app/services/Disbursements/disbursement-headers.service';
import { ExpenseConfigService } from 'src/app/services/Expenses/expense-config.service';
import { ExpenseDetailsService } from 'src/app/services/Expenses/expense-details.service';
import { ExpenseHeadersService } from 'src/app/services/Expenses/expense-headers.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PrintService } from 'src/app/services/print.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { TaxHelperService } from 'src/app/services/tax-helper.service';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';
import { fitHeaderDialogToPhone } from '../../../shared/transaction-header/transaction-header';

@Component({
  selector: 'app-expense-header-ui',
  templateUrl: './expense-header-ui.component.html',
  styleUrls: ['../../../shared/transaction-header/transaction-header.css']
})
export class ExpenseHeaderUIComponent implements OnInit {

  btnText : string = "Save";
  loading : boolean = false;
  expenseHeader: any=[];
  paymentTypes: any=[];
  paymentType: string;
  discountTypes: any=['percent', 'amount'];
  vatTypes: any=['No VAT', 'VAT Included', 'Add VAT'];
  fundSource:any=['Disbursement', 'CashDrawer', 'NA'];
  action:string;
  totalAmount:string;
  transCode:string;
  recordStatus:string;
  payee:any=[];
  expenseConfig:any=[];
  expenseHeaderForm = new FormGroup({
              id          : new FormControl(''),
              TransNo     : new FormControl(''),
              TransCode   : new FormControl(''),
              TransDate   : new FormControl(new Date()),
              InvNo            : new FormControl(''),
              PayeeId      : new FormControl(''),
              PayeeName      : new FormControl(''),
              VATableAmount       : new FormControl(this.numbersService.Convert2Decimal(0)),
              VATAmount   : new FormControl(this.numbersService.Convert2Decimal(0)),
              VATType     : new FormControl(''),
              TotalAmount     : new FormControl(''),
              DeliveryFee     : new FormControl(''),
              DiscountAmount     : new FormControl(this.numbersService.Convert2Decimal(0)),
              DiscountValue     : new FormControl(this.numbersService.Convert2Decimal(0)),
              DiscountType     : new FormControl(''),
              WHTaxAmount       : new FormControl(this.numbersService.Convert2Decimal(0)),
              WHTaxValue        : new FormControl(this.numbersService.Convert2Decimal(0)),
              WHTaxType     : new FormControl(''),
              TotalDue      : new FormControl(''),
              AmountPaid      : new FormControl(''),
              PaymentType     : new FormControl(''),
              TermDays      : new FormControl(''),
              Remarks       : new FormControl('-'),
              FundSource     : new FormControl(''),
              chkVoucherRequest : new FormControl(false),
  });
  printReceipt: boolean = false;
  disablePrintReceipt: boolean = false;
  PaymentTypeEnabled : boolean = true;
  VoucherRequestEnabled: boolean;
  VoucherRequestChecked: boolean;
  FundSourceEnabled: boolean;
  TermDaysReadOnly: boolean;
  constructor(
    private dialogRef         : MatDialogRef<ExpenseHeaderUIComponent>,
    private dialog                      : MatDialog,
    private expenseHeadersService  : ExpenseHeadersService,
    private notif             : NotificationService,
    private expenseConfigService    : ExpenseConfigService,
    private numbersService    : NumbersService,
    private taxHelperService    : TaxHelperService,
    private dateTimesService    : DateTimesService,
    private cashAccountsService : CashAccountsService,
    private printService    : PrintService,
    private router    : Router,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  // phones: the less used fields are folded until MORE DETAILS
  showMore: boolean = false;

  async ngOnInit(): Promise<void> {
    // phones: the dialog takes the whole screen
    fitHeaderDialogToPhone(this.dialogRef);
    if (this.data) {
      this.payee = this.data[0];
      this.expenseHeader = this.data[1];
      this.transCode = this.data[2];
      this.totalAmount = this.data[3];
      this.recordStatus = this.data[4];
      this.action = this.data[5];
      await this.getExpenseConfig();

      this.getexpenseHeaderFormDefault();

      if (this.action.toLowerCase() == 'saveexpensetransaction' ) {
        this.btnText = "Save";
        this.getexpenseHeaderForm1();
      }
      if (this.action.toLowerCase() == 'updateexpenseheader' ) {
        this.btnText = "Update";
        this.getexpenseHeaderForm2();
      }
    }
  }

  async getExpenseConfig(){
    this.expenseConfig = await firstValueFrom(this.expenseConfigService.getExpenseConfig());
    this.setUpFields();
  }

  setUpFields(){

    this.VoucherRequestEnabled = this.expenseConfig.AutoVoucher.toLowerCase() == "no";
    if (this.VoucherRequestEnabled)
        this.VoucherRequestChecked = this.expenseConfig.VoucherRequest.toLowerCase() == "yes";
    else
        this.VoucherRequestChecked= true;
    if (this.expenseConfig.AutoDisburse.toLowerCase() == "yes"){
      this.ToggleVoucherRequest(false);
    }
  }

ToggleVoucherRequest(value)
  {
    if (value)
    {
      this.VoucherRequestChecked = true;
      this.VoucherRequestEnabled = false;
    }
    else
    {
      this.VoucherRequestChecked = value;
      this.VoucherRequestEnabled = value;
    }
    this.expenseHeaderForm.controls['chkVoucherRequest'].setValue(value);
  }

  ToggleVoucherRequestByFundSourceByAutoDisburse(fundSource, autoDisburse)
  {
    if (fundSource.toLowerCase() == "cashdrawer"){
        this.VoucherRequestChecked = false;
        this.expenseHeaderForm.controls['chkVoucherRequest'].setValue(false);
        this.VoucherRequestEnabled = false;
    }
    else
    {
        if (fundSource.toLowerCase() != "na"){
          this.VoucherRequestChecked = autoDisburse.toLowerCase() == "no";
          this.expenseHeaderForm.controls['chkVoucherRequest'].setValue(autoDisburse.toLowerCase() == "no");
          this.VoucherRequestEnabled = autoDisburse.toLowerCase() == "no";
        }
    }
  }

  getexpenseHeaderFormDefault(){
    this.expenseHeaderForm.controls['DeliveryFee'].setValue(this.numbersService.Convert2Decimal(0));
    this.expenseHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert2Decimal(0));
  }

  async getexpenseHeaderForm1(){
    this.expenseHeaderForm.controls['TransCode'].setValue(this.transCode);
    this.expenseHeaderForm.controls['PayeeId'].setValue(this.payee.PayeeId);
    this.expenseHeaderForm.controls['PayeeName'].setValue(this.payee.PayeeName);
    this.expenseHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.totalAmount));

    this.expenseHeaderForm.controls['DiscountType'].setValue(this.discountTypes[0]);
    this.expenseHeaderForm.controls['WHTaxType'].setValue(this.discountTypes[0]);
    this.expenseHeaderForm.controls['VATType'].setValue(this.vatTypes[0]);
    this.expenseHeaderForm.controls['FundSource'].setValue(this.fundSource[0]);

    await this.getPaymentType(this.payee.payeeId);
    this.expenseHeaderForm.controls['PaymentType'].setValue(this.paymentTypes[0]);
    this.expenseHeaderForm.controls['VATType'].setValue(this.taxHelperService.VATType());

    
    this.computeTotalDue();
    this.onChangePaymentType(this.paymentTypes[0]);
  }
  
  async getPaymentType(payeeId){
    this.paymentTypes = await firstValueFrom(this.cashAccountsService.setPaymentTypes(payeeId, true));
  }


  async computeTotalDue(){
    var data:any = {
      TotalAmount     : this.numbersService.isNotNumeric(this.expenseHeaderForm.controls['TotalAmount'].value.toString())  ? 0 : +this.expenseHeaderForm.controls['TotalAmount'].value,
      DiscountValue   : this.numbersService.isNotNumeric(this.expenseHeaderForm.controls['DiscountValue'].value.toString())  ? 0 : +this.expenseHeaderForm.controls['DiscountValue'].value,
      DiscountType    : this.expenseHeaderForm.controls['DiscountType'].value.toLowerCase(),
      WHTaxValue      : this.numbersService.isNotNumeric(this.expenseHeaderForm.controls['WHTaxValue'].value.toString())  ? 0 : +this.expenseHeaderForm.controls['WHTaxValue'].value,
      WHTaxType       : this.expenseHeaderForm.controls['WHTaxType'].value.toLowerCase(),
      VATType         : this.expenseHeaderForm.controls['VATType'].value.toLowerCase(),
      DeliveryFee     : this.numbersService.isNotNumeric(this.expenseHeaderForm.controls['DeliveryFee'].value.toString())  ? 0 : +this.expenseHeaderForm.controls['DeliveryFee'].value,
    }


    var result:any = await firstValueFrom(this.expenseHeadersService.getExpenseHeaderComputedAmounts(data));
    this.expenseHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(result.DiscountAmount))
    this.expenseHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(result.VATableAmount))
    this.expenseHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(result.VATAmount))
    this.expenseHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(result.WHTaxAmount))
    this.expenseHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(result.TotalDue))
  }


  async getexpenseHeaderForm2(){
    
      await this.getPaymentType(this.expenseHeader.PayeeId);

      this.printReceipt = false;
      this.disablePrintReceipt = true;
      this.displayExpenseHeaderValues();

      this.computeTotalDue();
      // await this.onChangePaymentType(this.expenseHeader.PaymentType);
      this.ToggleVoucherRequest(this.expenseHeader.PaymentType.toLowerCase() != "charge");
      this.VoucherRequestChecked = this.expenseHeader.VoucherRequest.toLowerCase() != "na";
      this.VoucherRequestEnabled = this.expenseHeader.VoucherRequest.toLowerCase() != "approved" && this.expenseHeader.PaymentType.toLowerCase() != "charge";
      this.PaymentTypeEnabled = this.expenseHeader.AmountPaid == 0;
      this.onChangeFundSource(this.expenseHeader.FundSource);
  }

  displayExpenseHeaderValues(){
    this.expenseHeaderForm.controls['id'].setValue(this.expenseHeader.id);
    this.expenseHeaderForm.controls['TransNo'].setValue(this.expenseHeader.TransNo);
    this.expenseHeaderForm.controls['TransCode'].setValue(this.expenseHeader.TransCode);
    this.expenseHeaderForm.controls['PayeeId'].setValue(this.expenseHeader.PayeeId);
    this.expenseHeaderForm.controls['InvNo'].setValue(this.expenseHeader.InvNo);
    this.expenseHeaderForm.controls['PayeeName'].setValue(this.expenseHeader.PayeeName);
    this.expenseHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.expenseHeader.TotalAmount));
    this.expenseHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.expenseHeader.DiscountValue));
    this.expenseHeaderForm.controls['DiscountType'].setValue(this.expenseHeader.DiscountType);
    this.expenseHeaderForm.controls['WHTaxValue'].setValue(this.numbersService.Convert2Decimal(this.expenseHeader.WHTaxValue));
    this.expenseHeaderForm.controls['WHTaxType'].setValue(this.expenseHeader.WHTaxType);
    this.expenseHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(this.expenseHeader.WHTaxAmount));
    this.expenseHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(this.expenseHeader.VATAmount));
    this.expenseHeaderForm.controls['VATType'].setValue(this.expenseHeader.VATType);
    this.expenseHeaderForm.controls['DeliveryFee'].setValue(this.numbersService.Convert2Decimal(this.expenseHeader.DeliveryFee));
    this.expenseHeaderForm.controls['PaymentType'].setValue(this.expenseHeader.PaymentType);
    this.expenseHeaderForm.controls['Remarks'].setValue(this.expenseHeader.Remarks);
    this.expenseHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(this.expenseHeader.VATableAmount));
    this.expenseHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(this.expenseHeader.TermDays));
    this.expenseHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(this.expenseHeader.DiscountAmount));
    this.expenseHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.expenseHeader.DiscountValue));
    this.expenseHeaderForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.expenseHeader.TransDate));
    this.expenseHeaderForm.controls['DiscountType'].setValue(this.expenseHeader.DiscountType);
    this.expenseHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(this.expenseHeader.TotalDue));
    this.expenseHeaderForm.controls['FundSource'].setValue(this.expenseHeader.FundSource);
  }

  async onChangePaymentType(paymentType)
  {
      this.paymentType = paymentType.toLowerCase();
      this.getPaymentTypeFundSource(this.expenseConfig.AutoDisburse,this.paymentType,this.expenseHeaderForm.controls['TermDays'].value, this.payee.TermDays);
      this.onChangeFundSource(this.expenseHeaderForm.controls['FundSource'].value);
  }

  async onChangeFundSource(fundSource)
  {
    this.ToggleVoucherRequestByFundSourceByAutoDisburse(fundSource, this.expenseConfig.AutoDisburse);
  }

  async getPaymentTypeFundSource(autoDisburse, paymentType,txtTerms, days){
   
      if (autoDisburse.toLowerCase() == "no")
          this.ToggleVoucherRequest(paymentType.toLowerCase() != "charge");
      else
      this.ToggleVoucherRequest(false);

      if (txtTerms != null)
          this.ToggleTerms(txtTerms, days, paymentType.toLowerCase() == "charge");

      this.expenseHeaderForm.controls['FundSource'].enable();
      if (paymentType.toLowerCase() == "cash")
      {
        this.expenseHeaderForm.controls['FundSource'].setValue('CashDrawer');
      }
      else if (paymentType.toLowerCase() == "charge")
      {
        this.expenseHeaderForm.controls['FundSource'].setValue('NA');
        this.expenseHeaderForm.controls['FundSource'].disable();

      }
      else
      {
        this.expenseHeaderForm.controls['FundSource'].setValue('Disbursement');
          if (paymentType.toLowerCase() == "check" || paymentType.toLowerCase() == "bank deposit")
          this.expenseHeaderForm.controls['FundSource'].disable();
      }
  }

  ToggleTerms(txtTerms, days, value){
    this.TermDaysReadOnly = !value;
    if (value)
    {
      this.expenseHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(days));
    }
    else
    {
      this.expenseHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(0));
    }
  }

  validateForm(){

    if (this.expenseHeaderForm.controls['PayeeName'].value.toLowerCase() == "cash" && this.expenseHeaderForm.controls['PaymentType'].value.toLowerCase() == "charge")
    {
      return this.notif.toastrWarning("CASH payee cannot have a payment type of CHARGE.")
    }
    if (this.expenseHeaderForm.controls['PaymentType'].value.toLowerCase() != "cash" && this.expenseHeaderForm.controls['FundSource'].value.toLowerCase() == "cashdrawer")
    {
      return this.notif.toastrWarning("FundSource should not be CashDrawer.")
    }
    if (this.expenseHeaderForm.controls['PaymentType'].value.toLowerCase() != "charge" && this.expenseHeaderForm.controls['FundSource'].value.toLowerCase() == "na")
    {
      return this.notif.toastrWarning("FundSource should not be NA.")
    }
    return this.onSubmit();
  }
  onSubmit(){
    this.loading = true;

    var dates = ['TransDate'];
    dates.forEach(x => {
      if(this.expenseHeaderForm.controls[x].value != null)
        this.expenseHeaderForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.expenseHeaderForm.controls[x].value)));
    });

  

    this.expenseHeadersService.updateExpenseHeader(this.transCode, this.totalAmount,  this.recordStatus, this.action,this.expenseHeaderForm.getRawValue()).subscribe({
      next:(res)=>{
        var expenseHeader = res.expenseHeader;
        var expenseDetails = res.expenseDetails;

        this.notif.toastrSuccess(res.message);
        if(this.action == 'saveexpensetransaction'){
          if(this.printReceipt){
            this.print(expenseHeader, expenseDetails);
          }
        }
        this.dialogRef.close(res.expenseHeader);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  print(expenseHeader, expenseDetails) {
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printexpensedetails']));
    var title = 'EXPENSE RECEIPT OF  - ' + expenseHeader.TransNo ;
    
    this.printService.popupWindow(url, 'expenseDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(expenseHeader));
    localStorage.setItem('Details', JSON.stringify(expenseDetails));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo',expenseHeader.TransNo);
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
      dialogConfig.data         = ([this.expenseHeader.TransNo, 'ExpenseHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([null, 'ExpenseHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }
  }


}
