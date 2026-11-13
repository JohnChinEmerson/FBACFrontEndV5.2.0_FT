import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BanksService } from 'src/app/services/Cashflow/banks.service';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { OrderConfigService } from 'src/app/services/Orders/order-config.service';
import { OrderDetailsService } from 'src/app/services/Orders/order-details.service';
import { OrderHeadersService } from 'src/app/services/Orders/order-headers.service';
import { PrintService } from 'src/app/services/print.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { TaxHelperService } from 'src/app/services/tax-helper.service';
import { UnpaidCustomerChecksUIComponent } from '../../CustomerChecks/unpaid-customer-checks-ui/unpaid-customer-checks-ui.component';
import { DiscountPersonsUIComponent } from '../../Sales/discount-persons-ui/discount-persons-ui.component';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';
import { fitHeaderDialogToPhone } from '../../../shared/transaction-header/transaction-header';

@Component({
  selector: 'app-order-header-ui',
  templateUrl: './order-header-ui.component.html',
  styleUrls: ['../../../shared/transaction-header/transaction-header.css']
})
export class OrderHeaderUIComponent implements OnInit {
  @ViewChild('dpInput') dpInput!: ElementRef;
  btnText               : string = "Save";
  loading               : boolean = false;
  orderHeader: any=[];
  discountPersons: any=[];
  paymentTypes: any=[];
  paymentType: string;
  deliveryTypes: any=['pickup','deliver'];
  discountTypes: any=['percent', 'amount'];
  vatTypes: any=['No VAT', 'VAT Included', 'Add VAT'];
  cashAccounts:any=[];
  checks:any=[];
  banks:any=[];
  action:string;
  totalAmount:string;
  transCode:string;
  discountPersonTxt:string;
  oHeader:any;
  customer:any=[];
  orderConfig:any=[];
  requiredDepositTo :boolean = false;
  requiredCheck : boolean = false;
  requiredBank :boolean = false;
  displayBank = (value: string): string => value || '';
  orderHeaderForm = new FormGroup({
        id        : new FormControl(''),
        TransNo   : new FormControl(''),
        TransCode  : new FormControl(''),
        TransDate  : new FormControl(new Date()),
        CustomerId     : new FormControl(''),
        CustomerName     : new FormControl(''),
        DeliveryType     : new FormControl(''),
        DeliveryDate     : new FormControl(new Date()),
        TotalAmount     : new FormControl(''),
        DeliveryFee     : new FormControl(''),
        DiscountAmount     : new FormControl(this.numbersService.Convert2Decimal(0)),
        DiscountValue     : new FormControl(this.numbersService.Convert2Decimal(0)),
        DiscountType     : new FormControl(''),
        DiscountId     : new FormControl(''),
        DiscountPerson     : new FormControl('NA'),
        WHTaxAmount     : new FormControl(this.numbersService.Convert2Decimal(0)),
        WHTaxValue     : new FormControl(this.numbersService.Convert2Decimal(0)),
        WHTaxType     : new FormControl(''),
        TotalDue: new FormControl(''),
        DownPayment: new FormControl('0'),
        VATType: new FormControl(''),
        PaymentType: new FormControl(''),
        TermDays: new FormControl(''),
        DepositTo: new FormControl(''),
        DepositToCashType: new FormControl(''),
        ReferenceNo: new FormControl('-'),
        CheckId: new FormControl(''),
        CheckNo: new FormControl(''),
        CheckDate: new FormControl(''),
        CheckDate2: new FormControl(null),
        BankName: new FormControl(''),
        Remarks: new FormControl(''),
        VATSales: new FormControl(''),
        VATExemptSales: new FormControl(''),
        VATableAmount: new FormControl(''),
        NonVATSales: new FormControl(''),
        VATAmount: new FormControl(''),
        ZeroRatedSales: new FormControl(''),
        Balance: new FormControl('0'),
              
  });
  printReceipt: boolean = false;
  disablePrintReceipt: boolean = false;
  toggleType: string = 'balance';
  selectCheck: boolean = false;

  constructor(
    private dialogRef         : MatDialogRef<OrderHeaderUIComponent>,
    private dialog                      : MatDialog,
    private orderHeadersService  : OrderHeadersService,
    private orderDetailsService  : OrderDetailsService,
    private notif             : NotificationService,
    private orderConfigService    : OrderConfigService,
    private numbersService    : NumbersService,
    private cashAccountsService    : CashAccountsService,
    private banksService    : BanksService,
    private taxHelperService    : TaxHelperService,
    private dateTimesService    : DateTimesService,
    private stringHelperService    : StringHelperService,
    private printService    : PrintService,
    private router    : Router,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  // phones: the less used fields are folded until MORE DETAILS
  showMore: boolean = false;

  ngOnInit(): void {
    // phones: the dialog takes the whole screen
    fitHeaderDialogToPhone(this.dialogRef);
    if (this.data) {
      this.customer = this.data[0];
      this.orderHeader = this.data[1];
      this.transCode = this.data[2];
      this.totalAmount = this.data[3];
      this.action = this.data[4];

      this.getorderHeaderFormDefault();

      if (this.action.toLowerCase() == 'saveordertransaction' ) {
        this.btnText = "Save";
        this.getorderHeaderForm1();
      }
      if (this.action.toLowerCase() == 'updateorderheader' ) {
        this.btnText = "Update";
        this.getorderHeaderForm2();
      }
      this.getOrderConfig();
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dpInput.nativeElement.focus();  
      this.dpInput.nativeElement.select(); 
    }, 500);
  }



  async getOrderConfig(){
    this.orderConfig = await firstValueFrom(this.orderConfigService.getOrderConfig());
    this.setUpFields();
  }

  setUpFields(){

    if(this.orderConfig.DisableItemDiscount.toLowerCase() == 'yes'){
      this.orderHeaderForm.controls['DiscountValue'].disable();
      this.orderHeaderForm.controls['DiscountType'].disable();
      this.orderHeaderForm.controls['DiscountPerson'].disable();
    }else{
      this.orderHeaderForm.controls['DiscountValue'].enable();
      this.orderHeaderForm.controls['DiscountType'].enable();
      this.orderHeaderForm.controls['DiscountPerson'].enable();
    }

    if(this.orderConfig.DisableTransDate.toLowerCase() == 'yes'){
      this.orderHeaderForm.controls['TransDate'].disable();
    }else{
      this.orderHeaderForm.controls['TransDate'].enable();
    }

    if(this.orderConfig.PrintReceipt.toLowerCase() == 'yes'){
      this.printReceipt = true;
    }

    this.orderHeaderForm.controls['Remarks'].setValue(this.orderConfig.ReceiptNotes);

  }

  getorderHeaderFormDefault(){
    this.orderHeaderForm.controls['DeliveryFee'].setValue(this.numbersService.Convert2Decimal(0));
    this.discountPersonTxt = 'No Discount';
    this.orderHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert2Decimal(0));
  }

  async getorderHeaderForm1(){
    this.orderHeaderForm.controls['TransCode'].setValue(this.transCode);
    this.orderHeaderForm.controls['CustomerId'].setValue(this.customer.CustomerId);
    this.orderHeaderForm.controls['CustomerName'].setValue(this.customer.CustomerName);
    this.orderHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.totalAmount));

    this.orderHeaderForm.controls['DeliveryType'].setValue(this.deliveryTypes[0]);
    this.orderHeaderForm.controls['DiscountType'].setValue(this.discountTypes[0]);
    this.orderHeaderForm.controls['WHTaxType'].setValue(this.discountTypes[0]);
    this.orderHeaderForm.controls['VATType'].setValue(this.vatTypes[0]);

    await this.getPaymentType(this.customer.customerId);
    this.orderHeaderForm.controls['PaymentType'].setValue(this.paymentTypes[0]);
    this.orderHeaderForm.controls['VATType'].setValue(this.taxHelperService.VATType());

    await this.computeVATSales(this.transCode);
   
    this.computeTotalDue();
    this.onChangeDeliveryType(this.deliveryTypes[0]);
    this.onChangePaymentType(this.paymentTypes[0]);
  }

  async getPaymentType(customerId){
    this.paymentTypes = await firstValueFrom(this.cashAccountsService.setPaymentTypes(customerId, false));
  }

  async computeVATSales(transCode){
    var data:any  = await firstValueFrom(this.orderDetailsService.getOrderType(transCode));
    
    this.orderHeaderForm.controls['VATSales'].setValue(this.numbersService.Convert2Decimal(data.VATSales));
    this.orderHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(data.VATAmount));
    this.orderHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(data.VATableSales));
    this.orderHeaderForm.controls['VATExemptSales'].setValue(this.numbersService.Convert2Decimal(data.VATExemptSales));
    this.orderHeaderForm.controls['ZeroRatedSales'].setValue(this.numbersService.Convert2Decimal(data.ZeroRatedSales));
    this.orderHeaderForm.controls['NonVATSales'].setValue(this.numbersService.Convert2Decimal(data.NonVATSales));
  }

  async computeTotalDue(){
    var data:any = {
      DownPayment     : this.numbersService.isNotNumeric(this.orderHeaderForm.controls['DownPayment'].value.toString())  ? 0 : +this.orderHeaderForm.controls['DownPayment'].value,
      TotalAmount     : this.numbersService.isNotNumeric(this.orderHeaderForm.controls['TotalAmount'].value.toString())  ? 0 : +this.orderHeaderForm.controls['TotalAmount'].value,
      VATSales        : this.numbersService.isNotNumeric(this.orderHeaderForm.controls['VATSales'].value.toString())  ? 0 : +this.orderHeaderForm.controls['VATSales'].value,
      VATExemptSales  : this.numbersService.isNotNumeric(this.orderHeaderForm.controls['VATExemptSales'].value.toString())  ? 0 : +this.orderHeaderForm.controls['VATExemptSales'].value,
      ZeroRatedSales  : this.numbersService.isNotNumeric(this.orderHeaderForm.controls['ZeroRatedSales'].value.toString())  ? 0 : +this.orderHeaderForm.controls['ZeroRatedSales'].value,
      NonVATSales     : this.numbersService.isNotNumeric(this.orderHeaderForm.controls['NonVATSales'].value.toString())  ? 0 : +this.orderHeaderForm.controls['NonVATSales'].value,
      DiscountValue   : this.numbersService.isNotNumeric(this.orderHeaderForm.controls['DiscountValue'].value.toString())  ? 0 : +this.orderHeaderForm.controls['DiscountValue'].value,
      DiscountType    : this.orderHeaderForm.controls['DiscountType'].value.toLowerCase(),
      WHTaxValue      : this.numbersService.isNotNumeric(this.orderHeaderForm.controls['WHTaxValue'].value.toString())  ? 0 : +this.orderHeaderForm.controls['WHTaxValue'].value,
      WHTaxType       : this.orderHeaderForm.controls['WHTaxType'].value.toLowerCase(),
      VATType         : this.orderHeaderForm.controls['VATType'].value.toLowerCase(),
      DeliveryFee     : this.numbersService.isNotNumeric(this.orderHeaderForm.controls['DeliveryFee'].value.toString())  ? 0 : +this.orderHeaderForm.controls['DeliveryFee'].value,
      DiscountPerson  : this.discountPersonTxt.toLowerCase(),
    }


    var result:any = await firstValueFrom(this.orderHeadersService.getOrderHeaderComputedAmounts(data));
    this.orderHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(result.DiscountAmount))
    this.orderHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(result.VATableAmount))
    this.orderHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(result.VATAmount))
    this.orderHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(result.WHTaxAmount))
    this.orderHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(result.TotalDue))

    var downPayment:any = this.orderHeaderForm.controls['DownPayment'].value;
    if(downPayment){
      var balance:any = +downPayment - +result.TotalDue;
      this.orderHeaderForm.controls['Balance'].setValue(this.numbersService.Convert2Decimal(balance))
    }else{
      this.orderHeaderForm.controls['Balance'].setValue('');
    }

  }

  async getorderHeaderForm2(){
      await this.getPaymentType(this.orderHeader.CustomerId);

      this.printReceipt = false;
      this.disablePrintReceipt = true;

      this.computeVATSales(this.orderHeader.TransNo);
      this.computeTotalDue();
      this.onChangeDeliveryType(this.orderHeader.DeliveryType);
      await this.onChangePaymentType(this.orderHeader.PaymentType);
      this.displayOrderHeaderValues();
  }

  displayOrderHeaderValues(){
    this.orderHeaderForm.controls['id'].setValue(this.orderHeader.id);
    this.orderHeaderForm.controls['TransNo'].setValue(this.orderHeader.TransNo);
    this.orderHeaderForm.controls['TransCode'].setValue(this.orderHeader.TransCode);
    this.orderHeaderForm.controls['CustomerId'].setValue(this.orderHeader.CustomerId);
    this.orderHeaderForm.controls['CustomerName'].setValue(this.orderHeader.CustomerName);
    this.orderHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.TotalAmount));
    this.orderHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.DiscountValue));
    this.orderHeaderForm.controls['DiscountType'].setValue(this.orderHeader.DiscountType);
    this.orderHeaderForm.controls['WHTaxValue'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.WHTaxValue));
    this.orderHeaderForm.controls['WHTaxType'].setValue(this.orderHeader.WHTaxType);
    this.orderHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.WHTaxAmount));
    this.orderHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.VATAmount));
    this.orderHeaderForm.controls['VATType'].setValue(this.orderHeader.VATType);
    this.orderHeaderForm.controls['DeliveryFee'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.DeliveryFee));
    this.orderHeaderForm.controls['PaymentType'].setValue(this.orderHeader.PaymentType);
    this.orderHeaderForm.controls['Balance'].setValue(this.numbersService.Convert2Decimal(+this.orderHeader.DownPayment - +this.orderHeader.TotalDue ));
    this.orderHeaderForm.controls['CheckNo'].setValue(this.orderHeader.CheckNo);
    this.orderHeaderForm.controls['BankName'].setValue(this.orderHeader.BankName);
    this.orderHeaderForm.controls['CheckDate'].setValue(this.orderHeader.CheckDate);
    this.orderHeaderForm.controls['CheckDate2'].setValue(this.dateTimesService.ConvertToDateFormat(this.orderHeader.CheckDate2));
    this.orderHeaderForm.controls['Remarks'].setValue(this.orderHeader.Remarks);
    this.orderHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.VATableAmount));
    this.orderHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(this.orderHeader.TermDays));
    this.orderHeaderForm.controls['VATSales'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.VATSales));
    this.orderHeaderForm.controls['VATExemptSales'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.VATExemptSales));
    this.orderHeaderForm.controls['ZeroRatedSales'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.ZeroRatedSales));
    this.orderHeaderForm.controls['NonVATSales'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.NonVATSales));
    this.orderHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.DiscountAmount));
    this.orderHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.DiscountValue));
    this.orderHeaderForm.controls['DeliveryDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.orderHeader.DeliveryDate));
    this.orderHeaderForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.orderHeader.TransDate));
    this.orderHeaderForm.controls['DeliveryType'].setValue(this.orderHeader.DeliveryType);
    this.orderHeaderForm.controls['DiscountType'].setValue(this.orderHeader.DiscountType);
    this.orderHeaderForm.controls['DiscountId'].setValue(this.orderHeader.DiscountId);
    this.orderHeaderForm.controls['DiscountPerson'].setValue(this.orderHeader.DiscountPerson);
    this.orderHeaderForm.controls['DepositTo'].setValue(this.orderHeader.DepositTo);
    this.orderHeaderForm.controls['DepositToCashType'].setValue(this.orderHeader.DepositToCashType);
    this.orderHeaderForm.controls['DownPayment'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.DownPayment));
    this.orderHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(this.orderHeader.TotalDue));
    this.orderHeaderForm.controls['CheckId'].setValue(this.orderHeader.CheckId);
    this.orderHeaderForm.controls['CheckNo'].setValue(this.orderHeader.CheckNo);
    this.orderHeaderForm.controls['ReferenceNo'].setValue(this.orderHeader.ReferenceNo);
  }

  onChangeDeliveryType(data)
  {
    if(data.toLowerCase() == 'pickup'){
      this.orderHeaderForm.controls['DeliveryFee'].disable();
      this.orderHeaderForm.controls['DeliveryDate'].disable();
    }
    if(data.toLowerCase() == 'deliver'){
      this.orderHeaderForm.controls['DeliveryDate'].enable();
      this.orderHeaderForm.controls['DeliveryFee'].enable();
    }
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
  }


  ToggleCheck(value){
    if(value){
      this.orderHeaderForm.controls['CheckNo'].enable();
      this.orderHeaderForm.controls['CheckDate'].enable();
      this.orderHeaderForm.controls['BankName'].enable();
      this.requiredCheck = true;
    }else{
      this.orderHeaderForm.controls['CheckNo'].disable();
      this.orderHeaderForm.controls['CheckDate'].disable();
      this.orderHeaderForm.controls['BankName'].disable();
      this.requiredCheck = false;
    }
    this.selectCheck = value;
  }
  ToggleDepositTo(value){
    if(value){
      this.orderHeaderForm.controls['DepositTo'].enable();
      this.requiredBank = true;
    }else{
      this.orderHeaderForm.controls['DepositTo'].disable();
      this.requiredBank = false;

    }
  }
  ToggleTerms(value){
    if(value){
      this.orderHeaderForm.controls['TermDays'].enable();
      this.orderHeaderForm.controls['DownPayment'].disable();
    }else{
      this.orderHeaderForm.controls['TermDays'].disable();
      this.orderHeaderForm.controls['DownPayment'].enable();
    }

    if (value)
    {
      this.orderHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(this.customer.TermDays ?? 0));
      this.orderHeaderForm.controls['DownPayment'].setValue(this.numbersService.Convert2Decimal(0));
    }
    else
    {
      this.orderHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(0));
      this.orderHeaderForm.controls['DownPayment'].setValue('');
    }
  }

  onClickSelectCheck(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([this.customer, 'orderheaderui']);
    this.dialog.open(UnpaidCustomerChecksUIComponent,dialogConfig).beforeClosed().subscribe(customerCheck => {
      if(customerCheck){
        this.orderHeaderForm.controls['CheckId'].setValue(customerCheck.CheckId);
        this.orderHeaderForm.controls['CheckNo'].setValue(customerCheck.CheckNo);
        this.orderHeaderForm.controls['CheckDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(customerCheck.CheckDate)));
        this.orderHeaderForm.controls['CheckDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(customerCheck.CheckDate2)));
        this.orderHeaderForm.controls['BankName'].setValue(customerCheck.BankName);
      }
    });
  }

  onClickDiscountPerson(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    this.dialog.open(DiscountPersonsUIComponent,dialogConfig).beforeClosed().subscribe(discountPerson => {
      if(discountPerson){
        this.orderHeaderForm.controls['DiscountPerson'].setValue(discountPerson.DiscountPerson);
        this.orderHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert0Decimal(discountPerson.DiscountPercent));
        this.orderHeaderForm.controls['DiscountId'].setValue(this.customer.DiscountId);
        this.discountPersonTxt = discountPerson.DiscountPerson;
        this.computeTotalDue();
      }
    });
  }

  validateForm(){
    return this.onSubmit();
  }
  onSubmit(){
    this.loading = true;

    var dates = ['TransDate','CheckDate2', 'DeliveryDate'];
    dates.forEach(x => {
      if(this.orderHeaderForm.controls[x].value != null)
        this.orderHeaderForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.orderHeaderForm.controls[x].value)));
    });

    this.orderHeadersService.updateOrderHeader(this.transCode, this.totalAmount, this.btnText,this.orderHeaderForm.getRawValue()).subscribe({
      next:(res)=>{
        var orderHeader = res.orderHeader;
        var orderDetails = res.orderDetails;

        this.notif.toastrSuccess(res.message);
        if(this.btnText.toLowerCase() == 'save'){
          if(this.printReceipt){
            this.print(orderHeader, orderDetails);
          }
        }
        this.dialogRef.close(res.orderHeader);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  print(orderHeader, orderDetails) {
    var url = this.router.serializeUrl(
      this.router.createUrlTree(['print/printorderdetails'])
    );

    this.printService.popupWindow(url, 'printorderdetails', window, 1000, 700);
    localStorage.setItem('Header', JSON.stringify(orderHeader));
    localStorage.setItem('Details', JSON.stringify(orderDetails));
    localStorage.setItem('OrderConfig', JSON.stringify(this.orderConfig));
    localStorage.setItem('Reprint', 'false');
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
      dialogConfig.data         = ([this.orderHeader.TransNo, 'OrderHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([null, 'OrderHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }
  }

  onEnterDownPayment(){
    this.computeTotalDue();
    this.validateForm();
  }
}
