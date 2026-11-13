import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { DisbursementHeadersService } from 'src/app/services/Disbursements/disbursement-headers.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PrintService } from 'src/app/services/print.service';
import { SaleReturnConfigService } from 'src/app/services/SaleReturn/sale-return-config.service';
import { SaleReturnDetailsService } from 'src/app/services/SaleReturn/sale-return-details.service';
import { SaleReturnHeadersService } from 'src/app/services/SaleReturn/sale-return-headers.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { TaxHelperService } from 'src/app/services/tax-helper.service';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';
import { SalesConfigPerMachineService } from 'src/app/services/Sales/sales-config-per-machine.service';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { fitHeaderDialogToPhone } from '../../../shared/transaction-header/transaction-header';

@Component({
  selector: 'app-sale-return-header-ui',
  templateUrl: './sale-return-header-ui.component.html',
  styleUrls: ['../../../shared/transaction-header/transaction-header.css']
})
export class SaleReturnHeaderUIComponent implements OnInit {
  btnText : string = "Save";
  loading : boolean = false;
  saleReturnHeader: any=[];
  paymentTypes: any=[];
  paymentType: string;
  discountTypes: any=['percent', 'amount'];
  vatTypes: any=['No VAT', 'VAT Included', 'Add VAT'];
  fundSource:any=['Disbursement', 'NA'];
  action:string;
  totalAmount:string;
  refundable:string;
  transCode:string;
  recordStatus:string;
  customer:any=[];
  saleReturnConfig:any=[];
  saleReturnHeaderForm = new FormGroup({
              id          : new FormControl(''),
              TransNo     : new FormControl(''),
              TransCode   : new FormControl(''),
              TransDate   : new FormControl(new Date()),
              CustomerId      : new FormControl(''),
              CustomerName      : new FormControl(''),
              VATableAmount       : new FormControl(this.numbersService.Convert2Decimal(0)),
              VATAmount   : new FormControl(this.numbersService.Convert2Decimal(0)),
              VATType     : new FormControl(''),
              TotalAmount     : new FormControl(''),
              DiscountAmount     : new FormControl(this.numbersService.Convert2Decimal(0)),
              DiscountValue     : new FormControl(this.numbersService.Convert2Decimal(0)),
              DiscountType     : new FormControl(''),
              WHTaxAmount       : new FormControl(this.numbersService.Convert2Decimal(0)),
              WHTaxValue        : new FormControl(this.numbersService.Convert2Decimal(0)),
              Refundable: new FormControl(this.numbersService.Convert2Decimal(0)),
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
    private dialogRef         : MatDialogRef<SaleReturnHeaderUIComponent>,
    private dialog                      : MatDialog,
    private saleReturnHeadersService  : SaleReturnHeadersService,
    private saleReturnDetailsService  : SaleReturnDetailsService,
    private notif             : NotificationService,
    private saleReturnConfigService    : SaleReturnConfigService,
    private disbursementHeadersService    : DisbursementHeadersService,
    private numbersService    : NumbersService,
    private taxHelperService    : TaxHelperService,
    private dateTimesService    : DateTimesService,
    private stringHelperService    : StringHelperService,
    private cashAccountsService : CashAccountsService,
    private printService    : PrintService,
    private router    : Router,
    private salesConfigPerMachineService : SalesConfigPerMachineService,
    private saleConfigService : SaleConfigService,
    private authService : AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  // phones: the less used fields are folded until MORE DETAILS
  showMore: boolean = false;

  async ngOnInit(): Promise<void> {
    // phones: the dialog takes the whole screen
    fitHeaderDialogToPhone(this.dialogRef);
    if (this.data) {
      this.customer = this.data[0];
      this.saleReturnHeader = this.data[1];
      this.transCode = this.data[2];
      this.totalAmount = this.data[3];
      this.recordStatus = this.data[4];
      this.action = this.data[5];
      this.refundable = this.data[6];

      await this.getSaleReturnConfig();

      this.getsaleReturnHeaderFormDefault();

      if (this.action.toLowerCase() == 'savesalereturntransaction' ) {
        this.btnText = "Save";
        this.getsaleReturnHeaderForm1();
      }
      if (this.action.toLowerCase() == 'updatesalereturnheader' ) {
        this.btnText = "Update";
        this.getsaleReturnHeaderForm2();
      }
    }
  }

  async getSaleReturnConfig(){
    this.saleReturnConfig = await firstValueFrom(this.saleReturnConfigService.getSaleReturnConfig());
    this.setUpFields();
  }

  setUpFields(){
    this.printReceipt = this.saleReturnConfig.PrintReceipt.toLowerCase() == "yes";

    if(this.saleReturnConfig.DisableTransDate.toLowerCase() == 'yes'){
      this.saleReturnHeaderForm.controls['TransDate'].disable();
    }else{
      this.saleReturnHeaderForm.controls['TransDate'].enable();
    }

    this.VoucherRequestEnabled = this.saleReturnConfig.AutoVoucher.toLowerCase() == "no";
    if (this.VoucherRequestEnabled)
        this.VoucherRequestChecked = this.saleReturnConfig.VoucherRequest.toLowerCase() == "yes";
    else
        this.VoucherRequestChecked= true;
    if (this.saleReturnConfig.AutoDisburse.toLowerCase() == "yes"){
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
    this.saleReturnHeaderForm.controls['chkVoucherRequest'].setValue(value);
  }

  ToggleVoucherRequestByFundSourceByAutoDisburse(fundSource, autoDisburse)
  {
    if (fundSource.toLowerCase() == "cashdrawer"){
        this.VoucherRequestChecked = false;
        this.saleReturnHeaderForm.controls['chkVoucherRequest'].setValue(false);
        this.VoucherRequestEnabled = false;
    }
    else
    {
        if (fundSource.toLowerCase() != "na"){
          this.VoucherRequestChecked = autoDisburse.toLowerCase() == "no";
          this.saleReturnHeaderForm.controls['chkVoucherRequest'].setValue(autoDisburse.toLowerCase() == "no");
          this.VoucherRequestEnabled = autoDisburse.toLowerCase() == "no";
        }
    }
  }


  getsaleReturnHeaderFormDefault(){
    this.saleReturnHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert2Decimal(0));
  }

  async getsaleReturnHeaderForm1(){
    this.saleReturnHeaderForm.controls['TransCode'].setValue(this.transCode);
    this.saleReturnHeaderForm.controls['CustomerId'].setValue(this.customer.CustomerId);
    this.saleReturnHeaderForm.controls['CustomerName'].setValue(this.customer.CustomerName);
    this.saleReturnHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.totalAmount));
    this.saleReturnHeaderForm.controls['Refundable'].setValue(this.numbersService.Convert2Decimal(this.refundable));

    this.saleReturnHeaderForm.controls['DiscountType'].setValue(this.discountTypes[0]);
    this.saleReturnHeaderForm.controls['WHTaxType'].setValue(this.discountTypes[0]);
    this.saleReturnHeaderForm.controls['VATType'].setValue(this.vatTypes[0]);
    this.saleReturnHeaderForm.controls['FundSource'].setValue(this.fundSource[0]);

    await this.getPaymentType(this.customer.customerId);
    this.saleReturnHeaderForm.controls['PaymentType'].setValue(this.paymentTypes[0]);
    this.saleReturnHeaderForm.controls['VATType'].setValue(this.taxHelperService.VATType());

    
    this.computeTotalDue();
    this.onChangePaymentType(this.paymentTypes[0]);
  }
  
  async getPaymentType(customerId){
    this.paymentTypes = await firstValueFrom(this.cashAccountsService.setPaymentTypes(customerId, true));
  }


  async computeTotalDue(){
    var srt:any = await firstValueFrom(this.saleReturnDetailsService.getSaleReturnType(this.transCode));
    
    var data:any = {
      TotalAmount     : this.numbersService.isNotNumeric(this.saleReturnHeaderForm.controls['TotalAmount'].value.toString())  ? 0 : +this.saleReturnHeaderForm.controls['TotalAmount'].value,
      Refundable     : this.numbersService.isNotNumeric(this.saleReturnHeaderForm.controls['Refundable'].value.toString())  ? 0 : +this.saleReturnHeaderForm.controls['Refundable'].value,
      DiscountValue   : this.numbersService.isNotNumeric(this.saleReturnHeaderForm.controls['DiscountValue'].value.toString())  ? 0 : +this.saleReturnHeaderForm.controls['DiscountValue'].value,
      DiscountType    : this.saleReturnHeaderForm.controls['DiscountType'].value.toLowerCase(),
      WHTaxValue      : this.numbersService.isNotNumeric(this.saleReturnHeaderForm.controls['WHTaxValue'].value.toString())  ? 0 : +this.saleReturnHeaderForm.controls['WHTaxValue'].value,
      WHTaxType       : this.saleReturnHeaderForm.controls['WHTaxType'].value.toLowerCase(),
      VATType         : this.saleReturnHeaderForm.controls['VATType'].value.toLowerCase(),
      VATSales         : srt.VATSales,
      NonVATSales         : srt.NonVATSales,
      VATExemptSales         : srt.VATExemptSales,
      ZeroRatedSales         : srt.ZeroRatedSales,
    }


    var result:any = await firstValueFrom(this.saleReturnHeadersService.getSaleReturnHeaderComputedAmounts(data));
    this.saleReturnHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(result.DiscountAmount))
    this.saleReturnHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(result.VATableAmount))
    this.saleReturnHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(result.VATAmount))
    this.saleReturnHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(result.WHTaxAmount))
    this.saleReturnHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(result.TotalDue))
  }


  async getsaleReturnHeaderForm2(){
      await this.getPaymentType(this.saleReturnHeader.CustomerId);

      this.printReceipt = false;
      this.disablePrintReceipt = true;
      this.displaySaleReturnHeaderValues();

      this.computeTotalDue();
      // await this.onChangePaymentType(this.saleReturnHeader.PaymentType);
      this.ToggleVoucherRequest(this.saleReturnHeader.PaymentType.toLowerCase() != "charge");
      this.VoucherRequestChecked = this.saleReturnHeader.VoucherRequest.toLowerCase() != "na";
      this.VoucherRequestEnabled = this.saleReturnHeader.VoucherRequest.toLowerCase() != "approved" && this.saleReturnHeader.PaymentType.toLowerCase() != "charge";
      this.PaymentTypeEnabled = this.saleReturnHeader.AmountPaid == 0;
      this.onChangeFundSource(this.saleReturnHeader.FundSource);
  }

  displaySaleReturnHeaderValues(){
    this.saleReturnHeaderForm.controls['id'].setValue(this.saleReturnHeader.id);
    this.saleReturnHeaderForm.controls['TransNo'].setValue(this.saleReturnHeader.TransNo);
    this.saleReturnHeaderForm.controls['TransCode'].setValue(this.saleReturnHeader.TransCode);
    this.saleReturnHeaderForm.controls['CustomerId'].setValue(this.saleReturnHeader.CustomerId);
    this.saleReturnHeaderForm.controls['CustomerName'].setValue(this.saleReturnHeader.CustomerName);
    this.saleReturnHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.saleReturnHeader.TotalAmount));
    this.saleReturnHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(this.saleReturnHeader.TotalDue));
    this.saleReturnHeaderForm.controls['Refundable'].setValue(this.numbersService.Convert2Decimal(this.saleReturnHeader.Refundable));

    this.saleReturnHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.saleReturnHeader.DiscountValue));
    this.saleReturnHeaderForm.controls['DiscountType'].setValue(this.saleReturnHeader.DiscountType);
    this.saleReturnHeaderForm.controls['WHTaxValue'].setValue(this.numbersService.Convert2Decimal(this.saleReturnHeader.WHTaxValue));
    this.saleReturnHeaderForm.controls['WHTaxType'].setValue(this.saleReturnHeader.WHTaxType);
    this.saleReturnHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(this.saleReturnHeader.WHTaxAmount));
    this.saleReturnHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(this.saleReturnHeader.VATAmount));
    this.saleReturnHeaderForm.controls['VATType'].setValue(this.saleReturnHeader.VATType);
    this.saleReturnHeaderForm.controls['PaymentType'].setValue(this.saleReturnHeader.PaymentType);
    this.saleReturnHeaderForm.controls['Remarks'].setValue(this.saleReturnHeader.Remarks);
    this.saleReturnHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(this.saleReturnHeader.VATableAmount));
    this.saleReturnHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(this.saleReturnHeader.TermDays));
    this.saleReturnHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(this.saleReturnHeader.DiscountAmount));
    this.saleReturnHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.saleReturnHeader.DiscountValue));
    this.saleReturnHeaderForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.saleReturnHeader.TransDate));
    this.saleReturnHeaderForm.controls['DiscountType'].setValue(this.saleReturnHeader.DiscountType);
    this.saleReturnHeaderForm.controls['FundSource'].setValue(this.saleReturnHeader.FundSource);
  }

  async onChangePaymentType(paymentType)
  {
      this.paymentType = paymentType.toLowerCase();
      this.getPaymentTypeFundSource(this.saleReturnConfig.AutoDisburse,this.paymentType,this.saleReturnHeaderForm.controls['TermDays'].value, this.customer.TermDays);
      this.onChangeFundSource(this.saleReturnHeaderForm.controls['FundSource'].value);
  }
  
  async onChangeFundSource(fundSource)
  {
    this.ToggleVoucherRequestByFundSourceByAutoDisburse(fundSource, this.saleReturnConfig.AutoDisburse);
  }


  async getPaymentTypeFundSource(autoDisburse, paymentType,txtTerms, days){
   
      if (autoDisburse.toLowerCase() == "no")
          this.ToggleVoucherRequest(paymentType.toLowerCase() != "charge");
      else
      this.ToggleVoucherRequest(false);

      if (txtTerms != null)
          this.ToggleTerms(txtTerms, days, paymentType.toLowerCase() == "charge");

      this.saleReturnHeaderForm.controls['FundSource'].enable();
      if (paymentType.toLowerCase() == "cash")
      {
        this.saleReturnHeaderForm.controls['FundSource'].setValue('NA');
      }
      else if (paymentType.toLowerCase() == "charge")
      {
        this.saleReturnHeaderForm.controls['FundSource'].setValue('NA');
        this.saleReturnHeaderForm.controls['FundSource'].disable();

      }
      else
      {
        this.saleReturnHeaderForm.controls['FundSource'].setValue('Disbursement');
          if (paymentType.toLowerCase() == "check" || paymentType.toLowerCase() == "bank deposit")
          this.saleReturnHeaderForm.controls['FundSource'].disable();
      }
  }

  ToggleTerms(txtTerms, days, value){
    this.TermDaysReadOnly = !value;
    if (value)
    {
      this.saleReturnHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(days));
    }
    else
    {
      this.saleReturnHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(0));
    }
  }

  validateForm(){

    if (this.saleReturnHeaderForm.controls['CustomerName'].value.toLowerCase() == "cash" && this.saleReturnHeaderForm.controls['PaymentType'].value.toLowerCase() == "charge")
    {
      return this.notif.toastrWarning("CASH customer cannot have a payment type of CHARGE.")
    }
    return this.onSubmit();
  }
  onSubmit(){
    this.loading = true;

    var dates = ['TransDate'];
    dates.forEach(x => {
      if(this.saleReturnHeaderForm.controls[x].value != null)
        this.saleReturnHeaderForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.saleReturnHeaderForm.controls[x].value)));
    });

    this.saleReturnHeadersService.updateSaleReturnHeader(this.transCode, this.totalAmount,this.recordStatus, this.action,this.saleReturnHeaderForm.getRawValue()).subscribe({
      next:(res)=>{
        var saleReturnHeader = res.saleReturnHeader;
        var saleReturnDetails = res.saleReturnDetails;

        this.notif.toastrSuccess(res.message);
        if(this.action == 'savesalereturntransaction'){
          if(this.printReceipt){
            this.printReturnReceipt(res);
          }
        }
        this.dialogRef.close(res.saleReturnHeader);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  // Desktop SaleReturnHeaderUI.btnSave_Click: POS receipt (BIR when the machine is BIR registered) and/or the
  // ordinary receipt, as Sales Config per machine > Printer says
  async printReturnReceipt(res) {
    var perMachine:any = await firstValueFrom(this.salesConfigPerMachineService.getSaleConfigPerMachineByComputerName(this.authService.UserAccount.ComputerName));
    var saleConfig:any = await firstValueFrom(this.saleConfigService.getSaleConfig());
    var printer = (perMachine?.Printer || 'pos').toLowerCase();
    if (printer != 'ordinary') {
      var url = this.router.serializeUrl(this.router.createUrlTree([res.birRegistered ? 'print/printposbir' : 'print/printpos']));
      this.printService.openPOSReceipt(url, window, {
        'Header': res.saleReturnHeader, 'Details': res.saleReturnDetails, 'Discounts': [], 'Config': saleConfig,
        'machinePermit': res.machinePermit, 'vendorPermit': res.vendorPermit, 'ReceiptType': 'salereturn', 'Reprint': 'false',
      });
    }
    if (printer != 'pos') {
      if (printer == 'both') await new Promise(resolve => setTimeout(resolve, 1000));
      this.print(res.saleReturnHeader, res.saleReturnDetails);
    }
  }

  print(saleReturnHeader, saleReturnDetails) {
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalereturndetails']));
    var title = 'SALES RETURN RECEIPT OF  - ' + saleReturnHeader.TransNo ;
    
    this.printService.popupWindow(url, 'saleReturnDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(saleReturnHeader));
    localStorage.setItem('Details', JSON.stringify(saleReturnDetails));
    localStorage.setItem('SaleReturnConfig', JSON.stringify(this.saleReturnConfig));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', saleReturnHeader.TransNo);
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
      dialogConfig.data         = ([this.saleReturnHeader.TransNo, 'SaleReturnHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([null, 'SaleReturnHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }
  }


}
