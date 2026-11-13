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
import { POConfigService } from 'src/app/services/Purchasing/poconfig.service';
import { PODetailsService } from 'src/app/services/Purchasing/podetails.service';
import { POHeadersService } from 'src/app/services/Purchasing/poheaders.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { TaxHelperService } from 'src/app/services/tax-helper.service';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';
import { fitHeaderDialogToPhone } from '../../../shared/transaction-header/transaction-header';

@Component({
  selector: 'app-poheader-ui',
  templateUrl: './poheader-ui.component.html',
  styleUrls: ['../../../shared/transaction-header/transaction-header.css']
})
export class POHeaderUIComponent implements OnInit {
  btnText : string = "Save";
  loading : boolean = false;
  poHeader: any=[];
  paymentTypes: any=[];
  paymentType: string;
  discountTypes: any=['percent', 'amount'];
  vatTypes: any=['No VAT', 'VAT Included', 'Add VAT'];
  fundSource:any=['Disbursement', 'CashDrawer', 'NA'];
  action:string;
  totalAmount:string;
  transCode:string;
  recordStatus:string;
  supplier:any=[];
  poConfig:any=[];
  poHeaderForm = new FormGroup({
        id          : new FormControl(''),
        TransNo     : new FormControl(''),
        TransCode   : new FormControl(''),
        TransDate   : new FormControl(new Date()),
        PONo          : new FormControl(''),
        ReqNo            : new FormControl(''),
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
        TotalDue      : new FormControl(''),
        PaymentType     : new FormControl(''),
        Remarks       : new FormControl('-'),
        chkVoucherRequest : new FormControl(false),
        VATSales: new FormControl(''),
        VATExemptSales: new FormControl(''),
        NonVATSales: new FormControl(''),
        ZeroRatedSales: new FormControl(''),
  });
  printReceipt: boolean = false;
  disablePrintReceipt: boolean = false;
  VoucherRequestEnabled: boolean;
  VoucherRequestChecked: boolean;
  constructor(
    private dialogRef         : MatDialogRef<POHeaderUIComponent>,
    private dialog                      : MatDialog,
    private poHeadersService  : POHeadersService,
    private poDetailsService : PODetailsService, 
    private cashAccountsService  : CashAccountsService,
    private notif             : NotificationService,
    private poConfigService    : POConfigService,
    private numbersService    : NumbersService,
    private taxHelperService    : TaxHelperService,
    private dateTimesService    : DateTimesService,
    private stringHelperService    : StringHelperService,
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
      this.poHeader = this.data[1];
      this.transCode = this.data[2];
      this.totalAmount = this.data[3];
      this.action = this.data[4];
      await this.getPOConfig();

      this.getpoHeaderFormDefault();

      if (this.action.toLowerCase() == 'savepotransaction' ) {
        this.btnText = "Save";
        this.getpoHeaderForm1();
      }
      if (this.action.toLowerCase() == 'updatepoheader' ) {
        this.btnText = "Update";
        this.getpoHeaderForm2();
        // this.VoucherRequestEnabled = true;
        // this.poHeaderForm.controls['chkVoucherRequest'].setValue(false);
      }
    }
  }

  async getPOConfig(){
    this.poConfig = await firstValueFrom(this.poConfigService.getPOConfig());
    this.setUpFields();
  }

  setUpFields(){
    if(this.poConfig.AutoVoucher.toLowerCase() == "yes"){
      this.VoucherRequestEnabled = true;
      this.ToggleVoucherRequest(true);
    }else{
      this.VoucherRequestEnabled = false;
      this.ToggleVoucherRequest(this.poConfig.VoucherRequest.toLowerCase() == "yes");
    }
    if(this.btnText == 'Update')
    {
      this.VoucherRequestEnabled = true;
      this.poHeaderForm.controls['chkVoucherRequest'].setValue(false);
    }
  }

 ToggleVoucherRequest(value)
  {
    this.VoucherRequestChecked = value;
    this.poHeaderForm.controls['chkVoucherRequest'].setValue(value);
    // if(this.btnText == 'Update')
    // {
    //   this.VoucherRequestEnabled = true;
    //   this.poHeaderForm.controls['chkVoucherRequest'].setValue(false);
    // }
  }

  getpoHeaderFormDefault(){
    this.poHeaderForm.controls['DeliveryFee'].setValue(this.numbersService.Convert2Decimal(0));
  }

  async getpoHeaderForm1(){
    this.poHeaderForm.controls['TransCode'].setValue(this.transCode);
    this.poHeaderForm.controls['SupplierId'].setValue(this.supplier.SupplierId);
    this.poHeaderForm.controls['SupplierName'].setValue(this.supplier.SupplierName);
    this.poHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.totalAmount));

    this.poHeaderForm.controls['DiscountType'].setValue(this.discountTypes[0]);
    this.poHeaderForm.controls['WHTaxType'].setValue(this.discountTypes[0]);
    this.poHeaderForm.controls['VATType'].setValue(this.vatTypes[0]);

    await this.getPaymentType(this.supplier.supplierId);
    await this.computeVATSales(this.transCode);

    this.poHeaderForm.controls['PaymentType'].setValue(this.paymentTypes[0]);
    this.poHeaderForm.controls['VATType'].setValue(this.taxHelperService.VATType());
    this.computeTotalDue();
    this.onChangePaymentType(this.paymentTypes[0]);
  }


  async computeVATSales(transCode){
    var data:any  = await firstValueFrom(this.poDetailsService.getPOSalesType(transCode));
    
    this.poHeaderForm.controls['VATSales'].setValue(this.numbersService.Convert2Decimal(data.VATSales));
    this.poHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(data.VATAmount));
    this.poHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(data.VATableSales));
    this.poHeaderForm.controls['VATExemptSales'].setValue(this.numbersService.Convert2Decimal(data.VATExemptSales));
    this.poHeaderForm.controls['ZeroRatedSales'].setValue(this.numbersService.Convert2Decimal(data.ZeroRatedSales));
    this.poHeaderForm.controls['NonVATSales'].setValue(this.numbersService.Convert2Decimal(data.NonVATSales));
  }

  
  async getPaymentType(supplierId){
    this.paymentTypes = await firstValueFrom(this.cashAccountsService.setPaymentTypes(supplierId, true));
  }

  async computeTotalDue(){
    var data:any = {
      TotalAmount     : this.numbersService.isNotNumeric(this.poHeaderForm.controls['TotalAmount'].value.toString())  ? 0 : +this.poHeaderForm.controls['TotalAmount'].value,
      VATSales        : this.numbersService.isNotNumeric(this.poHeaderForm.controls['VATSales'].value.toString())  ? 0 : +this.poHeaderForm.controls['VATSales'].value,
      VATExemptSales  : this.numbersService.isNotNumeric(this.poHeaderForm.controls['VATExemptSales'].value.toString())  ? 0 : +this.poHeaderForm.controls['VATExemptSales'].value,
      ZeroRatedSales  : this.numbersService.isNotNumeric(this.poHeaderForm.controls['ZeroRatedSales'].value.toString())  ? 0 : +this.poHeaderForm.controls['ZeroRatedSales'].value,
      NonVATSales     : this.numbersService.isNotNumeric(this.poHeaderForm.controls['NonVATSales'].value.toString())  ? 0 : +this.poHeaderForm.controls['NonVATSales'].value,
      DiscountValue   : this.numbersService.isNotNumeric(this.poHeaderForm.controls['DiscountValue'].value.toString())  ? 0 : +this.poHeaderForm.controls['DiscountValue'].value,
      DiscountType    : this.poHeaderForm.controls['DiscountType'].value.toLowerCase(),
      WHTaxValue      : this.numbersService.isNotNumeric(this.poHeaderForm.controls['WHTaxValue'].value.toString())  ? 0 : +this.poHeaderForm.controls['WHTaxValue'].value,
      WHTaxType       : this.poHeaderForm.controls['WHTaxType'].value.toLowerCase(),
      VATType         : this.poHeaderForm.controls['VATType'].value.toLowerCase(),
      DeliveryFee     : this.numbersService.isNotNumeric(this.poHeaderForm.controls['DeliveryFee'].value.toString())  ? 0 : +this.poHeaderForm.controls['DeliveryFee'].value,
    }


    var result:any = await firstValueFrom(this.poHeadersService.getPOHeaderComputedAmounts(data));
    this.poHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(result.DiscountAmount))
    this.poHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(result.VATableAmount))
    this.poHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(result.VATAmount))
    this.poHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(result.WHTaxAmount))
    this.poHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(result.TotalDue))
  }

  async getpoHeaderForm2(){
    await this.getPaymentType(this.poHeader.SupplierId);

    this.printReceipt = false;
    this.disablePrintReceipt = true;
    this.displayPOHeaderValues();
    this.computeVATSales(this.poHeader.TransNo);
    this.computeTotalDue();
    await this.onChangePaymentType(this.poHeader.PaymentType);

    this.VoucherRequestChecked = this.poHeader.VoucherRequest.toLowerCase() != "na";
    // this.poHeaderForm.controls['chkVoucherRequest'].setValue(this.poHeader.VoucherRequest.toLowerCase() != "na");
    this.VoucherRequestEnabled = this.poHeader.VoucherRequest.toLowerCase() == "approved";
}

  displayPOHeaderValues(){
    this.poHeaderForm.controls['id'].setValue(this.poHeader.id);
    this.poHeaderForm.controls['TransNo'].setValue(this.poHeader.TransNo);
    this.poHeaderForm.controls['TransCode'].setValue(this.poHeader.TransCode);
    this.poHeaderForm.controls['SupplierId'].setValue(this.poHeader.SupplierId);
    this.poHeaderForm.controls['ReqNo'].setValue(this.poHeader.ReqNo);
    this.poHeaderForm.controls['SupplierName'].setValue(this.poHeader.SupplierName);
    this.poHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.poHeader.TotalAmount));
    this.poHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.poHeader.DiscountValue));
    this.poHeaderForm.controls['DiscountType'].setValue(this.poHeader.DiscountType);
    this.poHeaderForm.controls['WHTaxValue'].setValue(this.numbersService.Convert2Decimal(this.poHeader.WHTaxValue));
    this.poHeaderForm.controls['WHTaxType'].setValue(this.poHeader.WHTaxType);
    this.poHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(this.poHeader.WHTaxAmount));
    this.poHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(this.poHeader.VATAmount));
    this.poHeaderForm.controls['VATType'].setValue(this.poHeader.VATType);
    this.poHeaderForm.controls['DeliveryFee'].setValue(this.numbersService.Convert2Decimal(this.poHeader.DeliveryFee));
    this.poHeaderForm.controls['PaymentType'].setValue(this.poHeader.PaymentType);
    this.poHeaderForm.controls['Remarks'].setValue(this.poHeader.Remarks);
    this.poHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(this.poHeader.VATableAmount));
    this.poHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(this.poHeader.DiscountAmount));
    this.poHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.poHeader.DiscountValue));
    this.poHeaderForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.poHeader.TransDate));
    this.poHeaderForm.controls['DiscountType'].setValue(this.poHeader.DiscountType);
    this.poHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(this.poHeader.TotalDue));
    this.poHeaderForm.controls['VATSales'].setValue(this.numbersService.Convert2Decimal(this.poHeader.VATSales));
    this.poHeaderForm.controls['VATExemptSales'].setValue(this.numbersService.Convert2Decimal(this.poHeader.VATExemptSales));
    this.poHeaderForm.controls['ZeroRatedSales'].setValue(this.numbersService.Convert2Decimal(this.poHeader.ZeroRatedSales));
    this.poHeaderForm.controls['NonVATSales'].setValue(this.numbersService.Convert2Decimal(this.poHeader.NonVATSales));
  }

  async onChangePaymentType(paymentType)
  {
      this.paymentType = paymentType.toLowerCase();
  }

 
  validateForm(){

    if (this.poHeaderForm.controls['SupplierName'].value.toLowerCase() == "cash" && this.poHeaderForm.controls['PaymentType'].value.toLowerCase() == "charge")
    {
      return this.notif.toastrWarning("CASH supplier cannot have a payment type of CHARGE.")
    }
    return this.onSubmit();
  }
  onSubmit(){
    this.loading = true;

    var dates = ['TransDate'];
    dates.forEach(x => {
      if(this.poHeaderForm.controls[x].value != null)
        this.poHeaderForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.poHeaderForm.controls[x].value)));
    });

    this.poHeadersService.updatePOHeader(this.transCode, this.totalAmount,  this.action,this.poHeaderForm.getRawValue()).subscribe({
      next:(res)=>{
        var poHeader = res.poHeader;
        var poDetails = res.poDetails;

        this.notif.toastrSuccess(res.message);
        if(this.action == 'savepotransaction'){
          if(this.printReceipt){
            this.print(poHeader, poDetails);
          }
        }
        this.dialogRef.close(res.poHeader);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  print(poHeader, poDetails) {
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpodetails']));
    var title = 'PO RECEIPT OF  - ' + poHeader.TransNo ;
    
    this.printService.popupWindow(url, 'poDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(poHeader));
    localStorage.setItem('Details', JSON.stringify(poDetails));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', poHeader.TransNo);
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
      dialogConfig.data         = ([this.poHeader.TransNo, 'POHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([null, 'POHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }
  }

}
