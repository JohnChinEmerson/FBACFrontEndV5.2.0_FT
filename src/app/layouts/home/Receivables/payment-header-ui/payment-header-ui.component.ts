import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PrintService } from 'src/app/services/print.service';
import { PaymentDetailsService } from 'src/app/services/Receivables/payment-details.service';
import { PaymentHeadersService } from 'src/app/services/Receivables/payment-headers.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { TaxHelperService } from 'src/app/services/tax-helper.service';
import { UnpaidCustomerChecksUIComponent } from '../../CustomerChecks/unpaid-customer-checks-ui/unpaid-customer-checks-ui.component';
import { BanksService } from 'src/app/services/Cashflow/banks.service';
import { SharedMultiplePaymentHeadersService } from 'src/app/services/MultiplePayments/shared-multiple-payment-headers.service';
import { MultiplePaymentUIComponent } from '../../MultiplePayments/multiple-payment-ui/multiple-payment-ui.component';
import { MultiplePaymentHeadersService } from 'src/app/services/MultiplePayments/multiple-payment-headers.service';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';
import { fitHeaderDialogToPhone } from '../../../shared/transaction-header/transaction-header';

@Component({
  selector: 'app-payment-header-ui',
  templateUrl: './payment-header-ui.component.html',
  styleUrls: ['../../../shared/transaction-header/transaction-header.css']
})
export class PaymentHeaderUIComponent implements OnInit {

  btnText               : string = "Save";
  loading               : boolean = false;
  paymentHeader: any=[];
  paymentTypes: any=[];
  paymentType: string;
  discountTypes: any=['percent', 'amount'];
  vatTypes: any=['No VAT', 'VAT Included', 'Add VAT'];
  cashAccounts:any=[];
  checks:any=[];
  banks:any=[];
  action:string;
  totalAmount:string;
  transCode:string;
  customer:any=[];
  requiredDepositTo :boolean = false;
  requiredCheck : boolean = false;
  requiredBank :boolean = false;
  displayBank = (value: string): string => value || '';
  paymentHeaderForm = new FormGroup({
        id        : new FormControl(''),
        TransNo   : new FormControl(''),
        TransCode  : new FormControl(''),
        TransDate  : new FormControl(new Date()),
        InvNo: new FormControl(''),
        CustomerId     : new FormControl(''),
        CustomerName     : new FormControl(''),
        TotalAmount     : new FormControl(''),
        DiscountType     : new FormControl(''),
        DiscountAmount     : new FormControl(this.numbersService.Convert2Decimal(0)),
        DiscountValue     : new FormControl(this.numbersService.Convert2Decimal(0)),
        WHTaxAmount     : new FormControl(this.numbersService.Convert2Decimal(0)),
        WHTaxValue     : new FormControl(this.numbersService.Convert2Decimal(0)),
        WHTaxType     : new FormControl(''),
        TotalDue: new FormControl(''),
        AmountPaid: new FormControl(''),
        Change: new FormControl('0'),
        VATType: new FormControl(''),
        VATableAmount: new FormControl(''),
        VATAmount: new FormControl(''),
        PaymentType: new FormControl(''),
        DepositTo: new FormControl(''),
        DepositToCashType: new FormControl(''),
        CheckId: new FormControl(''),
        CheckNo: new FormControl(''),
        CheckDate: new FormControl(''),
        CheckDate2: new FormControl(null),
        BankName: new FormControl(''),
        Remarks: new FormControl('-'),
              
  });
  printReceipt: boolean = false;
  disablePrintReceipt: boolean = false;
  selectCheck: boolean = false;
  constructor(
    private dialogRef         : MatDialogRef<PaymentHeaderUIComponent>,
    private dialog                      : MatDialog,
    private paymentHeadersService  : PaymentHeadersService,
    private paymentDetailsService  : PaymentDetailsService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    private cashAccountsService    : CashAccountsService,
    private taxHelperService    : TaxHelperService,
    private dateTimesService    : DateTimesService,
    private banksService    : BanksService,
    private printService    : PrintService,
    private sharedMultiplePaymentHeadersService : SharedMultiplePaymentHeadersService,
    private multiplePaymentHeadersService : MultiplePaymentHeadersService,
    private router    : Router,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  // phones: the less used fields are folded until MORE DETAILS
  showMore: boolean = false;

  ngOnInit(): void {
    // phones: the dialog takes the whole screen
    fitHeaderDialogToPhone(this.dialogRef);
    if (this.data) {
      this.paymentHeader = this.data[0];
      this.transCode = this.data[1];
      this.totalAmount = this.data[2];
      this.action = this.data[3];
      this.customer = this.data[4];

      if (this.action.toLowerCase() == 'savepaymenttransaction' ) {
        this.btnText = "Save";
        this.getpaymentHeaderForm1();
      }
      if (this.action.toLowerCase() == 'updatepaymentheader' ) {
        this.btnText = "Update";
        this.getpaymentHeaderForm2();
      }
    }
  }

  async getpaymentHeaderForm1(){
    this.paymentHeaderForm.controls['TransCode'].setValue(this.transCode);
    this.paymentHeaderForm.controls['CustomerId'].setValue(this.paymentHeader.CustomerId);
    this.paymentHeaderForm.controls['CustomerName'].setValue(this.paymentHeader.CustomerName);
    this.paymentHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.totalAmount));

    this.paymentHeaderForm.controls['DiscountType'].setValue(this.discountTypes[0]);
    this.paymentHeaderForm.controls['WHTaxType'].setValue(this.discountTypes[0]);
    this.paymentHeaderForm.controls['VATType'].setValue(this.vatTypes[0]);

    await this.getPaymentType(this.paymentHeader.customerId);
    this.paymentHeaderForm.controls['PaymentType'].setValue(this.paymentTypes[0]);
    this.paymentHeaderForm.controls['VATType'].setValue(this.taxHelperService.VATType());

    await this.computeTotalDue();
    this.onChangePaymentType(this.paymentTypes[0]);
  }
  
  async getPaymentType(customerId){
    this.paymentTypes = await firstValueFrom(this.cashAccountsService.setPaymentTypes(customerId, false));
    this.paymentTypes.push('MULTIPLE');
  }
 
  async computeTotalDue(){
    var data:any = {
      TotalAmount     : this.numbersService.isNotNumeric(this.paymentHeaderForm.controls['TotalAmount'].value.toString())  ? 0 : +this.paymentHeaderForm.controls['TotalAmount'].value,
      DiscountValue   : this.numbersService.isNotNumeric(this.paymentHeaderForm.controls['DiscountValue'].value.toString())  ? 0 : +this.paymentHeaderForm.controls['DiscountValue'].value,
      DiscountType    : this.paymentHeaderForm.controls['DiscountType'].value.toLowerCase(),
      WHTaxValue      : this.numbersService.isNotNumeric(this.paymentHeaderForm.controls['WHTaxValue'].value.toString())  ? 0 : +this.paymentHeaderForm.controls['WHTaxValue'].value,
      WHTaxType       : this.paymentHeaderForm.controls['WHTaxType'].value.toLowerCase(),
      VATType         : this.paymentHeaderForm.controls['VATType'].value.toLowerCase(),
    }


    var result:any = await firstValueFrom(this.paymentHeadersService.getPaymentHeaderComputedAmounts(data));
    this.paymentHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(result.DiscountAmount))
    this.paymentHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(result.VATableAmount))
    this.paymentHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(result.VATAmount))
    this.paymentHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(result.WHTaxAmount))
    this.paymentHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(result.TotalDue))

    this.computeChange(result.TotalDue);
   
  }

  computeChange(TotalDue){
    var amountPaid:any = this.paymentHeaderForm.controls['AmountPaid'].value;
    if(amountPaid){
      var change:any = +amountPaid - +TotalDue;
      this.paymentHeaderForm.controls['Change'].setValue(this.numbersService.Convert2Decimal(change))
    }else{
      this.paymentHeaderForm.controls['Change'].setValue('');
    }
  }


  async getpaymentHeaderForm2(){
      await this.getPaymentType(this.paymentHeader.CustomerId);
      this.printReceipt = false;
      this.disablePrintReceipt = true;

      await this.computeTotalDue();
      // await this.onChangePaymentType(this.paymentHeader.PaymentType);
      this.displayPaymentHeaderValues();

  }

  displayPaymentHeaderValues(){
    this.paymentHeaderForm.controls['id'].setValue(this.paymentHeader.id);
    this.paymentHeaderForm.controls['TransNo'].setValue(this.paymentHeader.TransNo);
    this.paymentHeaderForm.controls['TransCode'].setValue(this.paymentHeader.TransCode);
    this.paymentHeaderForm.controls['CustomerId'].setValue(this.paymentHeader.CustomerId);
    this.paymentHeaderForm.controls['CustomerName'].setValue(this.paymentHeader.CustomerName);
    this.paymentHeaderForm.controls['InvNo'].setValue(this.paymentHeader.InvNo);
    this.paymentHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.paymentHeader.TotalAmount));
    this.paymentHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.paymentHeader.DiscountValue));
    this.paymentHeaderForm.controls['DiscountType'].setValue(this.paymentHeader.DiscountType);
    this.paymentHeaderForm.controls['WHTaxValue'].setValue(this.numbersService.Convert2Decimal(this.paymentHeader.WHTaxValue));
    this.paymentHeaderForm.controls['WHTaxType'].setValue(this.paymentHeader.WHTaxType);
    this.paymentHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(this.paymentHeader.WHTaxAmount));
    this.paymentHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(this.paymentHeader.VATAmount));
    this.paymentHeaderForm.controls['VATType'].setValue(this.paymentHeader.VATType);
    this.paymentHeaderForm.controls['PaymentType'].setValue(this.paymentHeader.PaymentType);
    this.paymentHeaderForm.controls['Change'].setValue(this.numbersService.Convert2Decimal(+this.paymentHeader.AmountPaid - +this.paymentHeader.TotalDue ));
    this.paymentHeaderForm.controls['CheckNo'].setValue(this.paymentHeader.CheckNo);
    this.paymentHeaderForm.controls['BankName'].setValue(this.paymentHeader.BankName);
    this.paymentHeaderForm.controls['CheckDate'].setValue(this.paymentHeader.CheckDate);
    this.paymentHeaderForm.controls['CheckDate2'].setValue(this.dateTimesService.ConvertToDateFormat(this.paymentHeader.CheckDate2));
    this.paymentHeaderForm.controls['Remarks'].setValue(this.paymentHeader.Remarks);
    this.paymentHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(this.paymentHeader.VATableAmount));
    this.paymentHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(this.paymentHeader.DiscountAmount));
    this.paymentHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.paymentHeader.DiscountValue));
    this.paymentHeaderForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.paymentHeader.TransDate));
    this.paymentHeaderForm.controls['DiscountType'].setValue(this.paymentHeader.DiscountType);
    this.paymentHeaderForm.controls['DepositTo'].setValue(this.paymentHeader.DepositTo);
    this.paymentHeaderForm.controls['DepositToCashType'].setValue(this.paymentHeader.DepositToCashType);
    this.paymentHeaderForm.controls['AmountPaid'].setValue(this.numbersService.Convert2Decimal(this.paymentHeader.AmountPaid));
    this.paymentHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(this.paymentHeader.TotalDue));
    this.paymentHeaderForm.controls['CheckId'].setValue(this.paymentHeader.CheckId);
    this.paymentHeaderForm.controls['CheckNo'].setValue(this.paymentHeader.CheckNo);
  }

  async getcashAccounts(){
    this.cashAccounts = await firstValueFrom(this.cashAccountsService.loadCashAccounts(this.paymentType));
  }

  async getBanks(){
    this.banks = await firstValueFrom(this.banksService.getBanks());
  }
  

  async onChangePaymentType(paymentType)
  {
      this.paymentType = paymentType.toLowerCase();
      await this.getcashAccounts();
      await this.getBanks();

      this.ToggleCheck(this.paymentType.toLowerCase() == "check");
      this.ToggleDepositTo(this.paymentType.toLowerCase() == "bank deposit");
      
      if (this.paymentType.toLowerCase() == "check" || this.paymentType.toLowerCase() == "bank deposit")
            this.paymentHeaderForm.controls['AmountPaid'].disable();
      else 
          this.paymentHeaderForm.controls['AmountPaid'].enable();

      this.paymentHeaderForm.controls['AmountPaid'].setValue(this.numbersService.Convert2Decimal(this.paymentHeaderForm.controls['TotalDue'].value));
      this.computeChange(this.paymentHeaderForm.controls['TotalDue'].value);

      if (this.paymentType.toLowerCase() == "multiple")
      {
        this.paymentHeaderForm.controls['AmountPaid'].disable();
        this.paymentHeaderForm.controls['AmountPaid'].setValue(this.numbersService.Convert2Decimal(0));
        var data:any = await firstValueFrom(this.sharedMultiplePaymentHeadersService.getSharedMultiplePaymentHeadersData(this.transCode, this.totalAmount, null, null, this.action,this.paymentHeaderForm.getRawValue()));
        data.SourceTransName = 'Customer Payments';
        data.TransDate = this.dateTimesService.ConvertToDateFormat(new Date( data.TransDate));
        const dialogConfig        = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus    = true;
        dialogConfig.width        = '600px';
        dialogConfig.data = ([data, 'paymentheaderui', 'Save', null, this.btnText]);
        this.dialog.open(MultiplePaymentUIComponent,dialogConfig).beforeClosed().subscribe(x => {
          if(x){
            this.paymentHeaderForm.controls['AmountPaid'].setValue(this.numbersService.Convert2Decimal(x));
            this.computeTotalDue();
          }
        });

          // new MultiplePayments.UI.MultiplePaymentUI(MultiplePayments.Data.SharedHeaders.GeData(GetData()), this, btnSave.Text).ShowDialog();
    }
  }

  ToggleCheck(value){
    if(value){
      this.paymentHeaderForm.controls['CheckNo'].enable();
      this.paymentHeaderForm.controls['CheckDate'].enable();
      this.paymentHeaderForm.controls['BankName'].enable();
      this.requiredCheck = true;
    }else{
      this.paymentHeaderForm.controls['CheckNo'].disable();
      this.paymentHeaderForm.controls['CheckDate'].disable();
      this.paymentHeaderForm.controls['BankName'].disable();
      this.requiredCheck = false;
      this.paymentHeaderForm.controls['AmountPaid'].setValue('');
    }
    this.selectCheck = value;
  }

  ToggleDepositTo(value){
    if(value){
      this.paymentHeaderForm.controls['DepositTo'].enable();
      this.requiredBank = true;
    }else{
      this.paymentHeaderForm.controls['DepositTo'].disable();
      this.requiredBank = false;
      this.paymentHeaderForm.controls['AmountPaid'].setValue('');
    }
  }

  onClickSelectCheck(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([this.customer, 'paymentheaderui']);
    this.dialog.open(UnpaidCustomerChecksUIComponent,dialogConfig).beforeClosed().subscribe(customerCheck => {
      if(customerCheck){
        this.paymentHeaderForm.controls['CheckId'].setValue(customerCheck.CheckId);
        this.paymentHeaderForm.controls['CheckNo'].setValue(customerCheck.CheckNo);
        this.paymentHeaderForm.controls['CheckDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(customerCheck.CheckDate)));
        this.paymentHeaderForm.controls['CheckDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(customerCheck.CheckDate2)));
        this.paymentHeaderForm.controls['BankName'].setValue(customerCheck.BankName);
      }
    });
  }


  validateForm(){
    if(this.numbersService.isNotGreaterThanOrEqualToZero(this.paymentHeaderForm.controls['TotalDue'].value.toString())) {
      return this.notif.toastrWarning("TotalDue is Not Greater Than Or Equal To Zero.")
    };
   
    if (this.paymentHeaderForm.controls['PaymentType'].value.toLowerCase() != "charge"){
      if(this.numbersService.AmountPaidIsLessThan(this.paymentHeaderForm.controls['AmountPaid'].value.toString(),this.paymentHeaderForm.controls['TotalDue'].value.toString())) {
        return this.notif.toastrWarning("AmountPaid Is LessThan TotalDue.")
      };
    }
    
    return this.onSubmit();
  }
  onSubmit(){
    this.loading = true;

    var dates = ['TransDate','CheckDate2'];
    dates.forEach(x => {
      if(this.paymentHeaderForm.controls[x].value != null)
        this.paymentHeaderForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.paymentHeaderForm.controls[x].value)));
    });

    this.paymentHeadersService.updatePaymentHeader(this.transCode, this.totalAmount, this.action,this.paymentHeaderForm.getRawValue()).subscribe({
      next:(res)=>{
        var paymentHeader = res.paymentHeader;
        var paymentDetails = res.paymentDetails;

        this.notif.toastrSuccess(res.message);
        if(this.action == 'savepaymenttransaction'){
          if(this.printReceipt){
            this.print(paymentHeader, paymentDetails);
          }
        }
        this.dialogRef.close(res.paymentHeader);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  async print(paymentHeader, paymentDetails) {

    if(paymentHeader.PaymentType.toLowerCase() == 'multiple')
      var mpHeaders= await firstValueFrom(this.multiplePaymentHeadersService.getMultiplePaymentsBySourceTransCode(paymentHeader.TransCode));
    else
      mpHeaders = null;

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpaymentdetails']));
    var title = 'PAYMENT RECEIPT OF  - ' + paymentHeader.TransNo ;
    
    this.printService.popupWindow(url, 'paymentDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(paymentHeader));
    localStorage.setItem('MPHeader', JSON.stringify(mpHeaders));
    localStorage.setItem('Details', JSON.stringify(paymentDetails));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', paymentHeader.TransNo);
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
      dialogConfig.data         = ([this.paymentHeader.TransNo, 'PaymentHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([null, 'PaymentHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }
  }

}
