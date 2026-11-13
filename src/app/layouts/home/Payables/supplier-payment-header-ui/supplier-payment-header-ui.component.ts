import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BanksService } from 'src/app/services/Cashflow/banks.service';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PayableConfigService } from 'src/app/services/Payables/payable-config.service';
import { SupplierPaymentHeadersService } from 'src/app/services/Payables/supplier-payment-headers.service';
import { PrintService } from 'src/app/services/print.service';
import { TaxHelperService } from 'src/app/services/tax-helper.service';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';
import { fitHeaderDialogToPhone } from '../../../shared/transaction-header/transaction-header';

@Component({
  selector: 'app-supplier-payment-header-ui',
  templateUrl: './supplier-payment-header-ui.component.html',
  styleUrls: ['../../../shared/transaction-header/transaction-header.css']
})
export class SupplierPaymentHeaderUIComponent implements OnInit {
  btnText               : string = "Save";
  loading               : boolean = false;
  payableConfig:any=[];
  supplierPaymentHeader: any=[];
  paymentTypes: any=[];
  paymentType: string;
  discountTypes: any=['percent', 'amount'];
  vatTypes: any=['No VAT', 'VAT Included', 'Add VAT'];
  fundSource:any=['Disbursement', 'CashDrawer', 'NA'];
  action:string;
  totalAmount:string;
  transCode:string;
  supplierPaymentHeaderForm = new FormGroup({
        id        : new FormControl(''),
        TransNo   : new FormControl(''),
        TransCode  : new FormControl(''),
        TransDate  : new FormControl(new Date()),
        InvNo: new FormControl(''),
        SupplierId     : new FormControl(''),
        SupplierName     : new FormControl(''),
        TotalAmount     : new FormControl(''),
        DiscountType     : new FormControl(''),
        DiscountAmount     : new FormControl(this.numbersService.Convert2Decimal(0)),
        DiscountValue     : new FormControl(this.numbersService.Convert2Decimal(0)),
        WHTaxAmount     : new FormControl(this.numbersService.Convert2Decimal(0)),
        WHTaxValue     : new FormControl(this.numbersService.Convert2Decimal(0)),
        WHTaxType     : new FormControl(''),
        TotalDue: new FormControl(''),
        VATType: new FormControl(''),
        VATableAmount: new FormControl(''),
        VATAmount: new FormControl(''),
        PaymentType: new FormControl(''),
        Remarks: new FormControl('-'),
        FundSource     : new FormControl(''),
        chkVoucherRequest : new FormControl(false),
  });
  printReceipt: boolean = false;
  disablePrintReceipt: boolean = false;
  PaymentTypeEnabled : boolean = true;
  VoucherRequestEnabled: boolean;
  VoucherRequestChecked: boolean;
  FundSourceEnabled: boolean;
  constructor(
    private dialog : MatDialog,
    private dialogRef         : MatDialogRef<SupplierPaymentHeaderUIComponent>,
    private payableConfigService                      : PayableConfigService,
    private supplierPaymentHeadersService  : SupplierPaymentHeadersService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    private cashAccountsService    : CashAccountsService,
    private taxHelperService    : TaxHelperService,
    private dateTimesService    : DateTimesService,
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
      this.supplierPaymentHeader = this.data[0];
      this.transCode = this.data[1];
      this.totalAmount = this.data[2];
      this.action = this.data[3];
      await this.getPayableConfig();
      if (this.action.toLowerCase() == 'savesupplierpaymenttransaction' ) {
        this.btnText = "Save";
        this.getsupplierPaymentHeaderForm1();
      }
      if (this.action.toLowerCase() == 'updatesupplierpaymentheader' ) {
        this.btnText = "Update";
        this.getsupplierPaymentHeaderForm2();
      }
    }
  }

  async getPayableConfig(){
    this.payableConfig = await firstValueFrom(this.payableConfigService.getPayableConfig());
    this.setUpFields();
  }

  setUpFields(){
    this.VoucherRequestEnabled = this.payableConfig.AutoVoucher.toLowerCase() == "no";
    if (this.VoucherRequestEnabled)
        this.VoucherRequestChecked = this.payableConfig.VoucherRequest.toLowerCase() == "yes";
    else
        this.VoucherRequestChecked= true;
    if (this.payableConfig.AutoDisburse.toLowerCase() == "yes"){
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
    this.supplierPaymentHeaderForm.controls['chkVoucherRequest'].setValue(value);
  }

  ToggleVoucherRequestByFundSourceByAutoDisburse(fundSource, autoDisburse)
  {
    if (fundSource.toLowerCase() == "cashdrawer"){
        this.VoucherRequestChecked = false;
        this.supplierPaymentHeaderForm.controls['chkVoucherRequest'].setValue(false);
        this.VoucherRequestEnabled = false;
    }
    else
    {
        if (fundSource.toLowerCase() != "na"){
          this.VoucherRequestChecked = autoDisburse.toLowerCase() == "no";
          this.supplierPaymentHeaderForm.controls['chkVoucherRequest'].setValue(autoDisburse.toLowerCase() == "no");
          this.VoucherRequestEnabled = autoDisburse.toLowerCase() == "no";
        }
    }
  }

  async getsupplierPaymentHeaderForm1(){
    this.supplierPaymentHeaderForm.controls['TransCode'].setValue(this.transCode);
    this.supplierPaymentHeaderForm.controls['SupplierId'].setValue(this.supplierPaymentHeader.SupplierId);
    this.supplierPaymentHeaderForm.controls['SupplierName'].setValue(this.supplierPaymentHeader.SupplierName);
    this.supplierPaymentHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.totalAmount));

    this.supplierPaymentHeaderForm.controls['DiscountType'].setValue(this.discountTypes[0]);
    this.supplierPaymentHeaderForm.controls['WHTaxType'].setValue(this.discountTypes[0]);
    this.supplierPaymentHeaderForm.controls['VATType'].setValue(this.vatTypes[0]);

    await this.getPaymentType(this.supplierPaymentHeader.supplierId);
    this.supplierPaymentHeaderForm.controls['PaymentType'].setValue(this.paymentTypes[0]);
    this.supplierPaymentHeaderForm.controls['VATType'].setValue(this.taxHelperService.VATType());

    await this.computeTotalDue();
    this.onChangePaymentType(this.paymentTypes[0]);

  }
  
  async getPaymentType(supplierId){
    this.paymentTypes = await firstValueFrom(this.cashAccountsService.setPaymentTypes(supplierId, false));
  }
 
  async computeTotalDue(){
    var data:any = {
      TotalAmount     : this.numbersService.isNotNumeric(this.supplierPaymentHeaderForm.controls['TotalAmount'].value.toString())  ? 0 : +this.supplierPaymentHeaderForm.controls['TotalAmount'].value,
      DiscountValue   : this.numbersService.isNotNumeric(this.supplierPaymentHeaderForm.controls['DiscountValue'].value.toString())  ? 0 : +this.supplierPaymentHeaderForm.controls['DiscountValue'].value,
      DiscountType    : this.supplierPaymentHeaderForm.controls['DiscountType'].value.toLowerCase(),
      WHTaxValue      : this.numbersService.isNotNumeric(this.supplierPaymentHeaderForm.controls['WHTaxValue'].value.toString())  ? 0 : +this.supplierPaymentHeaderForm.controls['WHTaxValue'].value,
      WHTaxType       : this.supplierPaymentHeaderForm.controls['WHTaxType'].value.toLowerCase(),
      VATType         : this.supplierPaymentHeaderForm.controls['VATType'].value.toLowerCase(),
    }


    var result:any = await firstValueFrom(this.supplierPaymentHeadersService.getSupplierPaymentHeaderComputedAmounts(data));
    this.supplierPaymentHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(result.DiscountAmount))
    this.supplierPaymentHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(result.VATableAmount))
    this.supplierPaymentHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(result.VATAmount))
    this.supplierPaymentHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(result.WHTaxAmount))
    this.supplierPaymentHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(result.TotalDue))
   
  }

  async getsupplierPaymentHeaderForm2(){
      await this.getPaymentType(this.supplierPaymentHeader.SupplierId);
      this.printReceipt = false;
      this.disablePrintReceipt = true;

      await this.computeTotalDue();
      this.displayPaymentHeaderValues();
      // this.onChangePaymentType(this.supplierPaymentHeader.PaymentType);

      this.ToggleVoucherRequest(this.supplierPaymentHeader.PaymentType.toLowerCase() != "charge");
      this.VoucherRequestChecked = this.supplierPaymentHeader.VoucherRequest.toLowerCase() != "na";
      this.VoucherRequestEnabled = this.supplierPaymentHeader.VoucherRequest.toLowerCase() != "approved" && this.supplierPaymentHeader.PaymentType.toLowerCase() != "charge";
      this.PaymentTypeEnabled = this.supplierPaymentHeader.AmountPaid == 0;
      this.onChangeFundSource(this.supplierPaymentHeader.FundSource);
  }

  displayPaymentHeaderValues(){
    this.supplierPaymentHeaderForm.controls['id'].setValue(this.supplierPaymentHeader.id);
    this.supplierPaymentHeaderForm.controls['TransNo'].setValue(this.supplierPaymentHeader.TransNo);
    this.supplierPaymentHeaderForm.controls['TransCode'].setValue(this.supplierPaymentHeader.TransCode);
    this.supplierPaymentHeaderForm.controls['SupplierId'].setValue(this.supplierPaymentHeader.SupplierId);
    this.supplierPaymentHeaderForm.controls['SupplierName'].setValue(this.supplierPaymentHeader.SupplierName);
    this.supplierPaymentHeaderForm.controls['InvNo'].setValue(this.supplierPaymentHeader.InvNo);
    this.supplierPaymentHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.supplierPaymentHeader.TotalAmount));
    this.supplierPaymentHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.supplierPaymentHeader.DiscountValue));
    this.supplierPaymentHeaderForm.controls['DiscountType'].setValue(this.supplierPaymentHeader.DiscountType);
    this.supplierPaymentHeaderForm.controls['WHTaxValue'].setValue(this.numbersService.Convert2Decimal(this.supplierPaymentHeader.WHTaxValue));
    this.supplierPaymentHeaderForm.controls['WHTaxType'].setValue(this.supplierPaymentHeader.WHTaxType);
    this.supplierPaymentHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(this.supplierPaymentHeader.WHTaxAmount));
    this.supplierPaymentHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(this.supplierPaymentHeader.VATAmount));
    this.supplierPaymentHeaderForm.controls['VATType'].setValue(this.supplierPaymentHeader.VATType);
    this.supplierPaymentHeaderForm.controls['PaymentType'].setValue(this.supplierPaymentHeader.PaymentType);
    this.supplierPaymentHeaderForm.controls['FundSource'].setValue(this.supplierPaymentHeader.FundSource);
    this.supplierPaymentHeaderForm.controls['Remarks'].setValue(this.supplierPaymentHeader.Remarks);
    this.supplierPaymentHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(this.supplierPaymentHeader.VATableAmount));
    this.supplierPaymentHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(this.supplierPaymentHeader.DiscountAmount));
    this.supplierPaymentHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.supplierPaymentHeader.DiscountValue));
    this.supplierPaymentHeaderForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.supplierPaymentHeader.TransDate));
    this.supplierPaymentHeaderForm.controls['DiscountType'].setValue(this.supplierPaymentHeader.DiscountType);
    this.supplierPaymentHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(this.supplierPaymentHeader.TotalDue));
  }


  async onChangePaymentType(paymentType)
  {
      this.paymentType = paymentType.toLowerCase();
      this.getPaymentTypeFundSource(this.payableConfig.AutoDisburse,this.paymentType);
      this.onChangeFundSource(this.supplierPaymentHeaderForm.controls['FundSource'].value);
  }

  async onChangeFundSource(fundSource)
  {
    this.ToggleVoucherRequestByFundSourceByAutoDisburse(fundSource, this.payableConfig.AutoDisburse);
  }

  async getPaymentTypeFundSource(autoDisburse, paymentType){
   
      if (autoDisburse.toLowerCase() == "no")
          this.ToggleVoucherRequest(paymentType.toLowerCase() != "charge");
      else
      this.ToggleVoucherRequest(false);


      this.supplierPaymentHeaderForm.controls['FundSource'].enable();
      if (paymentType.toLowerCase() == "cash")
      {
        this.supplierPaymentHeaderForm.controls['FundSource'].setValue('CashDrawer');
      }
      else if (paymentType.toLowerCase() == "charge")
      {
        this.supplierPaymentHeaderForm.controls['FundSource'].setValue('NA');
        this.supplierPaymentHeaderForm.controls['FundSource'].disable();

      }
      else
      {
        this.supplierPaymentHeaderForm.controls['FundSource'].setValue('Disbursement');
          if (paymentType.toLowerCase() == "check" || paymentType.toLowerCase() == "bank deposit")
          this.supplierPaymentHeaderForm.controls['FundSource'].disable();
      }
  }
  validateForm(){
    if(this.numbersService.isNotGreaterThanOrEqualToZero(this.supplierPaymentHeaderForm.controls['TotalDue'].value.toString())) {
      return this.notif.toastrWarning("TotalDue is Not Greater Than Or Equal To Zero.")
    };
    
    return this.onSubmit();
  }
  onSubmit(){
    this.loading = true;

    var dates = ['TransDate'];
    dates.forEach(x => {
      if(this.supplierPaymentHeaderForm.controls[x].value != null)
        this.supplierPaymentHeaderForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.supplierPaymentHeaderForm.controls[x].value)));
    });

    this.supplierPaymentHeadersService.updateSupplierPaymentHeader(this.transCode, this.totalAmount, this.btnText,this.supplierPaymentHeaderForm.getRawValue()).subscribe({
      next:(res)=>{
        var supplierPaymentHeader = res.supplierPaymentHeader;
        var supplierPaymentDetails = res.supplierPaymentDetails;

        this.notif.toastrSuccess(res.message);
        if(this.action == 'savesupplierpaymenttransaction'){
          if(this.printReceipt){
            this.print(supplierPaymentHeader, supplierPaymentDetails);
          }
        }
        this.dialogRef.close(res.supplierPaymentHeader);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  print(supplierPaymentHeader, supplierPaymentDetails) {
      var url = this.router.serializeUrl(
        this.router.createUrlTree(['print/printsupplierpaymentdetails'])
      );
      var title = 'SUPPLIER PAYMENT RECEIPT OF  - ' + supplierPaymentHeader.TransNo ;

    this.printService.popupWindow(url, 'printsupplierpaymentdetails', window, 1000, 700);

    localStorage.setItem('Header', JSON.stringify(supplierPaymentHeader));
    localStorage.setItem('Voucher', null);
    localStorage.setItem('Details', JSON.stringify(supplierPaymentDetails));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', supplierPaymentHeader.TransNo);


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
      dialogConfig.data         = ([this.supplierPaymentHeader.TransNo, 'SupplierPaymentHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([null, 'SupplierPaymentHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }
  }

}
