import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PrintService } from 'src/app/services/print.service';
import { ReceivingDetailsService } from 'src/app/services/Receiving/receiving-details.service';
import { ReceivingHeadersService } from 'src/app/services/Receiving/receiving-headers.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { TaxHelperService } from 'src/app/services/tax-helper.service';
import { ChangeUIComponent } from '../../Sales/change-ui/change-ui.component';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { ReceivingConfigService } from 'src/app/services/Receiving/receiving-config.service';
import { DisbursementHeadersService } from 'src/app/services/Disbursements/disbursement-headers.service';
import { POHeadersService } from 'src/app/services/Purchasing/poheaders.service';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';
import { fitHeaderDialogToPhone } from '../../../shared/transaction-header/transaction-header';

@Component({
  selector: 'app-receiving-header-ui',
  templateUrl: './receiving-header-ui.component.html',
  styleUrls: ['../../../shared/transaction-header/transaction-header.css']
})
export class ReceivingHeaderUIComponent implements OnInit {
  btnText : string = "Save";
  loading : boolean = false;
  receivingHeader: any=[];
  paymentTypes: any=[];
  paymentType: string;
  discountTypes: any=['percent', 'amount'];
  vatTypes: any=['No VAT', 'VAT Included', 'Add VAT'];
  fundSource:any=['Disbursement', 'CashDrawer', 'NA'];
  action:string;
  totalAmount:string;
  transCode:string;
  recordStatus:string;
  poHeader:any;
  supplier:any=[];
  receivingConfig:any=[];
  receivingHeaderForm = new FormGroup({
              id          : new FormControl(''),
              TransNo     : new FormControl(''),
              TransCode   : new FormControl(''),
              TransDate   : new FormControl(new Date()),
              PONo          : new FormControl(''),
              DRNo            : new FormControl(''),
              SupplierId      : new FormControl(''),
              SupplierName      : new FormControl(''),
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
              POPayment     : new FormControl(''),
              TotalDue      : new FormControl(''),
              AmountPaid      : new FormControl(''),
              PaymentType     : new FormControl(''),
              TermDays      : new FormControl(''),
              Remarks       : new FormControl('-'),
              FundSource     : new FormControl(''),
              chkVoucherRequest : new FormControl(false),
              VATSales: new FormControl(''),
              VATExemptSales: new FormControl(''),
              NonVATSales: new FormControl(''),
              ZeroRatedSales: new FormControl(''),
  });
  printReceipt: boolean = false;
  disablePrintReceipt: boolean = false;
  PaymentTypeEnabled : boolean = true;
  VoucherRequestEnabled: boolean;
  VoucherRequestChecked: boolean;
  FundSourceEnabled: boolean;
  TermDaysReadOnly: boolean;
  constructor(
    private dialogRef         : MatDialogRef<ReceivingHeaderUIComponent>,
    private dialog                      : MatDialog,
    private receivingHeadersService  : ReceivingHeadersService,
    private pOHeadersService  : POHeadersService,
    private receivingDetailsService  : ReceivingDetailsService,
    private notif             : NotificationService,
    private receivingConfigService    : ReceivingConfigService,
    private disbursementHeadersService    : DisbursementHeadersService,
    private numbersService    : NumbersService,
    private taxHelperService    : TaxHelperService,
    private dateTimesService    : DateTimesService,
    private stringHelperService    : StringHelperService,
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
      this.supplier = this.data[0];
      this.receivingHeader = this.data[1];
      this.transCode = this.data[2];
      this.totalAmount = this.data[3];
      this.poHeader = this.data[4];
      this.recordStatus = this.data[5];
      this.action = this.data[6];
      await this.getReceivingConfig();

      this.getreceivingHeaderFormDefault();

      if (this.action.toLowerCase() == 'savereceivingtransaction' ) {
        this.btnText = "Save";
        this.getreceivingHeaderForm1();
      }
      if (this.action.toLowerCase() == 'updatereceivingheader' ) {
        this.btnText = "Update";
        this.getreceivingHeaderForm2();
      }
    }
  }

  async getReceivingConfig(){
    this.receivingConfig = await firstValueFrom(this.receivingConfigService.getReceivingConfig());
    this.setUpFields();
  }

  setUpFields(){

    this.printReceipt = this.receivingConfig.PrintReceipt.toLowerCase() == "yes";
    this.VoucherRequestEnabled = this.receivingConfig.AutoVoucher.toLowerCase() == "no";
    if (this.VoucherRequestEnabled)
        this.VoucherRequestChecked = this.receivingConfig.VoucherRequest.toLowerCase() == "yes";
    else
        this.VoucherRequestChecked= true;
    if (this.receivingConfig.AutoDisburse.toLowerCase() == "yes"){
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
    this.receivingHeaderForm.controls['chkVoucherRequest'].setValue(value);
  }

  ToggleVoucherRequestByFundSourceByAutoDisburse(fundSource, autoDisburse)
  {
    if (fundSource.toLowerCase() == "cashdrawer"){
        this.VoucherRequestChecked = false;
        this.receivingHeaderForm.controls['chkVoucherRequest'].setValue(false);
        this.VoucherRequestEnabled = false;
    }
    else
    {
        if (fundSource.toLowerCase() != "na"){
          this.VoucherRequestChecked = autoDisburse.toLowerCase() == "no";
          this.receivingHeaderForm.controls['chkVoucherRequest'].setValue(autoDisburse.toLowerCase() == "no");
          this.VoucherRequestEnabled = autoDisburse.toLowerCase() == "no";
        }
    }
  }
  
  getreceivingHeaderFormDefault(){
    this.receivingHeaderForm.controls['DeliveryFee'].setValue(this.numbersService.Convert2Decimal(0));
    this.receivingHeaderForm.controls['POPayment'].setValue(this.numbersService.Convert2Decimal(0));
    this.receivingHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert2Decimal(0));
  }

  async getreceivingHeaderForm1(){
    this.receivingHeaderForm.controls['TransCode'].setValue(this.transCode);
    this.receivingHeaderForm.controls['SupplierId'].setValue(this.supplier.SupplierId);
    this.receivingHeaderForm.controls['SupplierName'].setValue(this.supplier.SupplierName);
    this.receivingHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.totalAmount));

    this.receivingHeaderForm.controls['DiscountType'].setValue(this.discountTypes[0]);
    this.receivingHeaderForm.controls['WHTaxType'].setValue(this.discountTypes[0]);
    this.receivingHeaderForm.controls['VATType'].setValue(this.vatTypes[0]);
    this.receivingHeaderForm.controls['FundSource'].setValue(this.fundSource[0]);

    await this.getPaymentType(this.supplier.supplierId);
    this.receivingHeaderForm.controls['PaymentType'].setValue(this.paymentTypes[0]);
    this.receivingHeaderForm.controls['VATType'].setValue(this.taxHelperService.VATType());

    await this.computeVATSales(this.transCode);

    if (this.poHeader != null)
    {
      this.displayPONo(); 
      var poPayment:any = await firstValueFrom(this.pOHeadersService.getPOUnAddedDownPayment(this.poHeader.TransNo));
      this.receivingHeaderForm.controls['POPayment'].setValue(this.numbersService.Convert2Decimal(poPayment));
    }
    this.computeTotalDue();
    this.onChangePaymentType(this.paymentTypes[0]);
  }


  async computeVATSales(transCode){
    var data:any  = await firstValueFrom(this.receivingDetailsService.getReceivingSalesType(transCode));
    
    this.receivingHeaderForm.controls['VATSales'].setValue(this.numbersService.Convert2Decimal(data.VATSales));
    this.receivingHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(data.VATAmount));
    this.receivingHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(data.VATableSales));
    this.receivingHeaderForm.controls['VATExemptSales'].setValue(this.numbersService.Convert2Decimal(data.VATExemptSales));
    this.receivingHeaderForm.controls['ZeroRatedSales'].setValue(this.numbersService.Convert2Decimal(data.ZeroRatedSales));
    this.receivingHeaderForm.controls['NonVATSales'].setValue(this.numbersService.Convert2Decimal(data.NonVATSales));
  }
  
  async getPaymentType(supplierId){
    this.paymentTypes = await firstValueFrom(this.cashAccountsService.setPaymentTypes(supplierId, true));
  }


  async computeTotalDue(){
    var data:any = {
      TotalAmount     : this.numbersService.isNotNumeric(this.receivingHeaderForm.controls['TotalAmount'].value.toString())  ? 0 : +this.receivingHeaderForm.controls['TotalAmount'].value,
      VATSales        : this.numbersService.isNotNumeric(this.receivingHeaderForm.controls['VATSales'].value.toString())  ? 0 : +this.receivingHeaderForm.controls['VATSales'].value,
      VATExemptSales  : this.numbersService.isNotNumeric(this.receivingHeaderForm.controls['VATExemptSales'].value.toString())  ? 0 : +this.receivingHeaderForm.controls['VATExemptSales'].value,
      ZeroRatedSales  : this.numbersService.isNotNumeric(this.receivingHeaderForm.controls['ZeroRatedSales'].value.toString())  ? 0 : +this.receivingHeaderForm.controls['ZeroRatedSales'].value,
      NonVATSales     : this.numbersService.isNotNumeric(this.receivingHeaderForm.controls['NonVATSales'].value.toString())  ? 0 : +this.receivingHeaderForm.controls['NonVATSales'].value,
      DiscountValue   : this.numbersService.isNotNumeric(this.receivingHeaderForm.controls['DiscountValue'].value.toString())  ? 0 : +this.receivingHeaderForm.controls['DiscountValue'].value,
      DiscountType    : this.receivingHeaderForm.controls['DiscountType'].value.toLowerCase(),
      WHTaxValue      : this.numbersService.isNotNumeric(this.receivingHeaderForm.controls['WHTaxValue'].value.toString())  ? 0 : +this.receivingHeaderForm.controls['WHTaxValue'].value,
      WHTaxType       : this.receivingHeaderForm.controls['WHTaxType'].value.toLowerCase(),
      VATType         : this.receivingHeaderForm.controls['VATType'].value.toLowerCase(),
      DeliveryFee     : this.numbersService.isNotNumeric(this.receivingHeaderForm.controls['DeliveryFee'].value.toString())  ? 0 : +this.receivingHeaderForm.controls['DeliveryFee'].value,
      POPayment       : this.numbersService.isNotNumeric(this.receivingHeaderForm.controls['POPayment'].value.toString())  ? 0 : +this.receivingHeaderForm.controls['POPayment'].value,
    }


    var result:any = await firstValueFrom(this.receivingHeadersService.getReceivingHeaderComputedAmounts(data));
    this.receivingHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(result.DiscountAmount))
    this.receivingHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(result.VATableAmount))
    this.receivingHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(result.VATAmount))
    this.receivingHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(result.WHTaxAmount))
    this.receivingHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(result.TotalDue))
  }

  displayPONo(){
    this.receivingHeaderForm.controls['PONo'].setValue(this.poHeader.TransNo);
    this.receivingHeaderForm.controls['PONo'].disable();
    this.receivingHeaderForm.controls['DeliveryFee'].setValue(this.numbersService.Convert2Decimal(this.poHeader.DeliveryFee));
    this.receivingHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.poHeader.DiscountValue));
    this.receivingHeaderForm.controls['DiscountType'].setValue(this.poHeader.DiscountType);
    this.receivingHeaderForm.controls['WHTaxValue'].setValue(this.numbersService.Convert2Decimal(this.poHeader.WHTaxValue));
    this.receivingHeaderForm.controls['WHTaxType'].setValue(this.poHeader.WHTaxType);
    this.receivingHeaderForm.controls['VATType'].setValue(this.poHeader.VATType);
    this.receivingHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(this.poHeader.TermDays));
    this.receivingHeaderForm.controls['Remarks'].setValue(this.poHeader.Remarks);
  }

  async getreceivingHeaderForm2(){
      if (this.poHeader != null)
      {
        this.displayPONo();
      }
      await this.getPaymentType(this.receivingHeader.SupplierId);

      this.printReceipt = false;
      this.disablePrintReceipt = true;
      this.displayReceivingHeaderValues();
      this.computeVATSales(this.receivingHeader.TransNo);
      this.computeTotalDue();
      this.ToggleVoucherRequest(this.receivingHeader.PaymentType.toLowerCase() != "charge");
      this.VoucherRequestChecked = this.receivingHeader.VoucherRequest.toLowerCase() != "na";
      this.VoucherRequestEnabled = this.receivingHeader.VoucherRequest.toLowerCase() != "approved" && this.receivingHeader.PaymentType.toLowerCase() != "charge";
      this.PaymentTypeEnabled = this.receivingHeader.AmountPaid == 0;
      this.onChangeFundSource(this.receivingHeader.FundSource);
  }

  displayReceivingHeaderValues(){
    this.receivingHeaderForm.controls['id'].setValue(this.receivingHeader.id);
    this.receivingHeaderForm.controls['TransNo'].setValue(this.receivingHeader.TransNo);
    this.receivingHeaderForm.controls['TransCode'].setValue(this.receivingHeader.TransCode);
    this.receivingHeaderForm.controls['SupplierId'].setValue(this.receivingHeader.SupplierId);
    this.receivingHeaderForm.controls['PONo'].setValue(this.receivingHeader.PONo);
    this.receivingHeaderForm.controls['DRNo'].setValue(this.receivingHeader.DRNo);
    this.receivingHeaderForm.controls['SupplierName'].setValue(this.receivingHeader.SupplierName);
    this.receivingHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.TotalAmount));
    this.receivingHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.DiscountValue));
    this.receivingHeaderForm.controls['DiscountType'].setValue(this.receivingHeader.DiscountType);
    this.receivingHeaderForm.controls['WHTaxValue'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.WHTaxValue));
    this.receivingHeaderForm.controls['WHTaxType'].setValue(this.receivingHeader.WHTaxType);
    this.receivingHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.WHTaxAmount));
    this.receivingHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.VATAmount));
    this.receivingHeaderForm.controls['VATType'].setValue(this.receivingHeader.VATType);
    this.receivingHeaderForm.controls['DeliveryFee'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.DeliveryFee));
    this.receivingHeaderForm.controls['PaymentType'].setValue(this.receivingHeader.PaymentType);
    this.receivingHeaderForm.controls['POPayment'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.POPayment));
    this.receivingHeaderForm.controls['Remarks'].setValue(this.receivingHeader.Remarks);
    this.receivingHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.VATableAmount));
    this.receivingHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(this.receivingHeader.TermDays));
    this.receivingHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.DiscountAmount));
    this.receivingHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.DiscountValue));
    this.receivingHeaderForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.receivingHeader.TransDate));
    this.receivingHeaderForm.controls['DiscountType'].setValue(this.receivingHeader.DiscountType);
    this.receivingHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.TotalDue));
    this.receivingHeaderForm.controls['FundSource'].setValue(this.receivingHeader.FundSource);
    this.receivingHeaderForm.controls['VATSales'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.VATSales));
    this.receivingHeaderForm.controls['VATExemptSales'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.VATExemptSales));
    this.receivingHeaderForm.controls['ZeroRatedSales'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.ZeroRatedSales));
    this.receivingHeaderForm.controls['NonVATSales'].setValue(this.numbersService.Convert2Decimal(this.receivingHeader.NonVATSales));
  }

  async onChangePaymentType(paymentType)
  {
      this.paymentType = paymentType.toLowerCase();
      this.getPaymentTypeFundSource(this.receivingConfig.AutoDisburse,this.paymentType,this.receivingHeaderForm.controls['TermDays'].value, this.supplier.TermDays);
      this.onChangeFundSource(this.receivingHeaderForm.controls['FundSource'].value);
  }

  async onChangeFundSource(fundSource)
  {
    this.ToggleVoucherRequestByFundSourceByAutoDisburse(fundSource, this.receivingConfig.AutoDisburse);
  }

  async getPaymentTypeFundSource(autoDisburse, paymentType,txtTerms, days){
   
      if (autoDisburse.toLowerCase() == "no")
          this.ToggleVoucherRequest(paymentType.toLowerCase() != "charge");
      else
      this.ToggleVoucherRequest(false);

      if (txtTerms != null)
          this.ToggleTerms(txtTerms, days, paymentType.toLowerCase() == "charge");

      this.receivingHeaderForm.controls['FundSource'].enable();
      if (paymentType.toLowerCase() == "cash")
      {
        this.receivingHeaderForm.controls['FundSource'].setValue('CashDrawer');
      }
      else if (paymentType.toLowerCase() == "charge")
      {
        this.receivingHeaderForm.controls['FundSource'].setValue('NA');
        this.receivingHeaderForm.controls['FundSource'].disable();

      }
      else
      {
        this.receivingHeaderForm.controls['FundSource'].setValue('Disbursement');
          if (paymentType.toLowerCase() == "check" || paymentType.toLowerCase() == "bank deposit")
          this.receivingHeaderForm.controls['FundSource'].disable();
      }
  }

  ToggleTerms(txtTerms, days, value){
    this.TermDaysReadOnly = !value;
    if (value)
    {
      this.receivingHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(days));
    }
    else
    {
      this.receivingHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(0));
    }
  }

  validateForm(){

    if (this.receivingHeaderForm.controls['SupplierName'].value.toLowerCase() == "cash" && this.receivingHeaderForm.controls['PaymentType'].value.toLowerCase() == "charge")
    {
      return this.notif.toastrWarning("CASH supplier cannot have a payment type of CHARGE.")
    }
    return this.onSubmit();
  }
  onSubmit(){
    this.loading = true;

    var dates = ['TransDate'];
    dates.forEach(x => {
      if(this.receivingHeaderForm.controls[x].value != null)
        this.receivingHeaderForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.receivingHeaderForm.controls[x].value)));
    });

  

    this.receivingHeadersService.updateReceivingHeader(this.transCode, this.totalAmount, this.poHeader, this.recordStatus, this.action,this.receivingHeaderForm.getRawValue()).subscribe({
      next:(res)=>{
        var receivingHeader = res.receivingHeader;
        var receivingDetails = res.receivingDetails;

        this.notif.toastrSuccess(res.message);
        if(this.action == 'savereceivingtransaction'){
          if(this.printReceipt){
            this.print(receivingHeader, receivingDetails);
          }
        }
        this.dialogRef.close(res.receivingHeader);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  print(receivingHeader, receivingDetails) {
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivingdetails']));
    var title = 'RECEIVING RECEIPT OF  - ' + receivingHeader.TransNo ;
    
    this.printService.popupWindow(url, 'receivingDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(receivingHeader));
    localStorage.setItem('Details', JSON.stringify(receivingDetails));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', receivingHeader.TransNo);
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
      dialogConfig.data         = ([this.receivingHeader.TransNo, 'ReceivingHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([null, 'ReceivingHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }
  }


}
