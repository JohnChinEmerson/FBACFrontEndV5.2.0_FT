import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BanksService } from 'src/app/services/Cashflow/banks.service';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { CustomerChecksService } from 'src/app/services/CustomerChecks/customer-checks.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { DeliveryConfigService } from 'src/app/services/Delivery/delivery-config.service';
import { DeliveryDetailsService } from 'src/app/services/Delivery/delivery-details.service';
import { DeliveryHeadersService } from 'src/app/services/Delivery/delivery-headers.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PrintService } from 'src/app/services/print.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { TaxHelperService } from 'src/app/services/tax-helper.service';
import { UnpaidCustomerChecksUIComponent } from '../../CustomerChecks/unpaid-customer-checks-ui/unpaid-customer-checks-ui.component';
import { DiscountPersonsUIComponent } from '../../Sales/discount-persons-ui/discount-persons-ui.component';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';
import { fitHeaderDialogToPhone } from '../../../shared/transaction-header/transaction-header';

@Component({
  selector: 'app-delivery-header-ui',
  templateUrl: './delivery-header-ui.component.html',
  styleUrls: ['../../../shared/transaction-header/transaction-header.css']
})
export class DeliveryHeaderUIComponent implements OnInit {
  btnText               : string = "Save";
  loading               : boolean = false;
  deliveryHeader: any=[];
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
  customer:any=[];
  deliveryConfig:any=[];
  requiredDepositTo :boolean = false;
  requiredCheck : boolean = false;
  requiredBank :boolean = false;
  useRebate : boolean = false;
  saleHeader:any;
  displayBank = (value: string): string => value || '';
  deliveryHeaderForm = new FormGroup({
      id        : new FormControl(''),
      TransNo   : new FormControl(''),
      TransCode  : new FormControl(''),
      SaleNo  : new FormControl(''),
      ReferenceNo  : new FormControl('-'),
      TransDate  : new FormControl(new Date()),
      CustomerId     : new FormControl(''),
      CustomerName     : new FormControl(''),
      DeliveryDate     : new FormControl(new Date()),
      TotalAmount     : new FormControl(''),
      DeliveryFee     : new FormControl(''),
      DiscountAmount     : new FormControl(this.numbersService.Convert2Decimal(0)),
      DiscountValue     : new FormControl(this.numbersService.Convert2Decimal(0)),
      DiscountType     : new FormControl(''),
      DiscountId     : new FormControl(''),
      DiscountPerson     : new FormControl(''),
      WHTaxAmount     : new FormControl(this.numbersService.Convert2Decimal(0)),
      WHTaxValue     : new FormControl(this.numbersService.Convert2Decimal(0)),
      WHTaxType     : new FormControl(''),
      TotalDue: new FormControl(''),
      VATType: new FormControl(''),
      PaymentType: new FormControl(''),
      TermDays: new FormControl(''),
      DepositTo: new FormControl(''),
      DepositToCashType: new FormControl(''),
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
  });
  printReceipt: boolean = false;
  disablePrintReceipt: boolean = false;
  toggleType: string = 'change';
  selectCheck: boolean = false;

  constructor(
    private dialogRef         : MatDialogRef<DeliveryHeaderUIComponent>,
    private dialog                      : MatDialog,
    private deliveryHeadersService  : DeliveryHeadersService,
    private deliveryDetailsService  : DeliveryDetailsService,
    private notif             : NotificationService,
    private deliveryConfigService    : DeliveryConfigService,
    private numbersService    : NumbersService,
    private cashAccountsService    : CashAccountsService,
    private banksService    : BanksService,
    private taxHelperService    : TaxHelperService,
    private dateTimesService    : DateTimesService,
    private stringHelperService    : StringHelperService,
    private customerChecksService    : CustomerChecksService,
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
      this.deliveryHeader = this.data[0];
      this.saleHeader = this.data[1];
      this.customer = this.data[2];
      this.transCode = this.data[3];
      this.totalAmount = this.data[4];
      this.action = this.data[5];

      this.getdeliveryHeaderFormDefault();

      if (this.action.toLowerCase() == 'savedeliverytransaction' ) {
        this.btnText = "Save";
        this.getdeliveryHeaderForm1();
      }
      if (this.action.toLowerCase() == 'updatedeliveryheader' ) {
        this.btnText = "Update";
        this.getdeliveryHeaderForm2();
      }
      this.getDeliveryConfig();
    }
  }

  async getDeliveryConfig(){
    this.deliveryConfig = await firstValueFrom(this.deliveryConfigService.getDeliveryConfig());
    this.setUpFields();
  }

  setUpFields(){
    if(this.deliveryConfig.DisableTransDate.toLowerCase() == 'yes'){
      this.deliveryHeaderForm.controls['TransDate'].disable();
    }else{
      this.deliveryHeaderForm.controls['TransDate'].enable();
    }

    if(this.deliveryConfig.PrintReceipt.toLowerCase() == 'yes'){
      this.printReceipt = true;
    }


  }

  getdeliveryHeaderFormDefault(){
    this.deliveryHeaderForm.controls['DeliveryFee'].setValue(this.numbersService.Convert2Decimal(this.saleHeader.DeliveryFee));
    this.deliveryHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert2Decimal(this.saleHeader.TermDays));
    this.deliveryHeaderForm.controls['SaleNo'].setValue(this.saleHeader.TransNo);
    this.deliveryHeaderForm.controls['CustomerId'].setValue(this.saleHeader.CustomerId);
    this.deliveryHeaderForm.controls['CustomerName'].setValue(this.saleHeader.CustomerName);
    this.deliveryHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(this.saleHeader.DiscountAmount));
    this.deliveryHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.saleHeader.DiscountValue));
    this.deliveryHeaderForm.controls['DiscountType'].setValue(this.saleHeader.DiscountType);
    this.deliveryHeaderForm.controls['DiscountId'].setValue(this.saleHeader.DiscountId);
    this.deliveryHeaderForm.controls['DiscountPerson'].setValue(this.saleHeader.DiscountPerson);
    this.deliveryHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(this.saleHeader.WHTaxAmount));
    this.deliveryHeaderForm.controls['WHTaxValue'].setValue(this.numbersService.Convert2Decimal(this.saleHeader.WHTaxValue));
    this.deliveryHeaderForm.controls['WHTaxType'].setValue(this.saleHeader.WHTaxType);
    this.deliveryHeaderForm.controls['VATType'].setValue(this.saleHeader.VATType);
    this.deliveryHeaderForm.controls['PaymentType'].setValue(this.saleHeader.PaymentType);
    this.deliveryHeaderForm.controls['DepositTo'].setValue(this.saleHeader.DepositTo);
    this.deliveryHeaderForm.controls['DepositToCashType'].setValue(this.saleHeader.DepositToCashType);
    this.deliveryHeaderForm.controls['CheckId'].setValue(this.saleHeader.CheckId);
    this.deliveryHeaderForm.controls['CheckNo'].setValue(this.saleHeader.CheckNo);
    if(this.saleHeader.CheckDate != 'NA'){
      this.deliveryHeaderForm.controls['CheckDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.saleHeader.CheckDate)) );
    }
    if(this.saleHeader.CheckDate2 != null){
      this.deliveryHeaderForm.controls['CheckDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.saleHeader.CheckDate2)) );
    }
    this.deliveryHeaderForm.controls['BankName'].setValue(this.saleHeader.BankName);
    this.deliveryHeaderForm.controls['Remarks'].setValue(this.saleHeader.Remarks);
    this.discountPersonTxt = 'No Discount';
  }

  async getdeliveryHeaderForm1(){
    this.deliveryHeaderForm.controls['TransCode'].setValue(this.transCode);
    this.deliveryHeaderForm.controls['CustomerId'].setValue(this.customer.CustomerId);
    this.deliveryHeaderForm.controls['CustomerName'].setValue(this.customer.CustomerName);
    this.deliveryHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.totalAmount));

    this.deliveryHeaderForm.controls['DiscountType'].setValue(this.discountTypes[0]);
    this.deliveryHeaderForm.controls['WHTaxType'].setValue(this.discountTypes[0]);
    this.deliveryHeaderForm.controls['VATType'].setValue(this.vatTypes[0]);

    await this.getPaymentType(this.customer.customerId);
    this.deliveryHeaderForm.controls['PaymentType'].setValue(this.paymentTypes[0]);
    this.deliveryHeaderForm.controls['VATType'].setValue(this.taxHelperService.VATType());

    await this.computeVATSales(this.transCode);
    this.computeTotalDue();
    this.onChangePaymentType(this.paymentTypes[0]);
  }
  
  async getPaymentType(customerId){
    this.paymentTypes = await firstValueFrom(this.cashAccountsService.setPaymentTypes(customerId, true));
  }

  async computeVATSales(transCode){
    var data:any  = await firstValueFrom(this.deliveryDetailsService.getDeliveryType(transCode));
    
    this.deliveryHeaderForm.controls['VATSales'].setValue(this.numbersService.Convert2Decimal(data.VATSales));
    this.deliveryHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(data.VATAmount));
    this.deliveryHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(data.VATableSales));
    this.deliveryHeaderForm.controls['VATExemptSales'].setValue(this.numbersService.Convert2Decimal(data.VATExemptSales));
    this.deliveryHeaderForm.controls['ZeroRatedSales'].setValue(this.numbersService.Convert2Decimal(data.ZeroRatedSales));
    this.deliveryHeaderForm.controls['NonVATSales'].setValue(this.numbersService.Convert2Decimal(data.NonVATSales));
  }

  async computeTotalDue(){
    var data:any = {
      TotalAmount     : this.numbersService.isNotNumeric(this.deliveryHeaderForm.controls['TotalAmount'].value.toString())  ? 0 : +this.deliveryHeaderForm.controls['TotalAmount'].value,
      VATSales        : this.numbersService.isNotNumeric(this.deliveryHeaderForm.controls['VATSales'].value.toString())  ? 0 : +this.deliveryHeaderForm.controls['VATSales'].value,
      VATExemptSales  : this.numbersService.isNotNumeric(this.deliveryHeaderForm.controls['VATExemptSales'].value.toString())  ? 0 : +this.deliveryHeaderForm.controls['VATExemptSales'].value,
      ZeroRatedSales  : this.numbersService.isNotNumeric(this.deliveryHeaderForm.controls['ZeroRatedSales'].value.toString())  ? 0 : +this.deliveryHeaderForm.controls['ZeroRatedSales'].value,
      NonVATSales     : this.numbersService.isNotNumeric(this.deliveryHeaderForm.controls['NonVATSales'].value.toString())  ? 0 : +this.deliveryHeaderForm.controls['NonVATSales'].value,
      DiscountValue   : this.numbersService.isNotNumeric(this.deliveryHeaderForm.controls['DiscountValue'].value.toString())  ? 0 : +this.deliveryHeaderForm.controls['DiscountValue'].value,
      DiscountType    : this.deliveryHeaderForm.controls['DiscountType'].value.toLowerCase(),
      WHTaxValue      : this.numbersService.isNotNumeric(this.deliveryHeaderForm.controls['WHTaxValue'].value.toString())  ? 0 : +this.deliveryHeaderForm.controls['WHTaxValue'].value,
      WHTaxType       : this.deliveryHeaderForm.controls['WHTaxType'].value.toLowerCase(),
      VATType         : this.deliveryHeaderForm.controls['VATType'].value.toLowerCase(),
      DeliveryFee     : this.numbersService.isNotNumeric(this.deliveryHeaderForm.controls['DeliveryFee'].value.toString())  ? 0 : +this.deliveryHeaderForm.controls['DeliveryFee'].value,
      DiscountPerson  : this.discountPersonTxt.toLowerCase(),
    }


    var result:any = await firstValueFrom(this.deliveryHeadersService.getDeliveryHeaderComputedAmounts(data));
    this.deliveryHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(result.DiscountAmount))
    this.deliveryHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(result.VATableAmount))
    this.deliveryHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(result.VATAmount))
    this.deliveryHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(result.WHTaxAmount))
    this.deliveryHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(result.TotalDue))
  }

  
  async getdeliveryHeaderForm2(){
      
      await this.getPaymentType(this.deliveryHeader.CustomerId);

      this.printReceipt = false;
      this.disablePrintReceipt = true;

      this.computeVATSales(this.deliveryHeader.TransNo);
      this.computeTotalDue();
      await this.onChangePaymentType(this.deliveryHeader.PaymentType);
      this.displayDeliveryHeaderValues();
  }

  displayDeliveryHeaderValues(){
    this.deliveryHeaderForm.controls['id'].setValue(this.deliveryHeader.id);
    this.deliveryHeaderForm.controls['TransNo'].setValue(this.deliveryHeader.TransNo);
    this.deliveryHeaderForm.controls['SaleNo'].setValue(this.deliveryHeader.SaleNo);
    this.deliveryHeaderForm.controls['ReferenceNo'].setValue(this.deliveryHeader.ReferenceNo);
    this.deliveryHeaderForm.controls['TransCode'].setValue(this.deliveryHeader.TransCode);
    this.deliveryHeaderForm.controls['CustomerId'].setValue(this.deliveryHeader.CustomerId);
    this.deliveryHeaderForm.controls['CustomerName'].setValue(this.deliveryHeader.CustomerName);
    this.deliveryHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.deliveryHeader.TotalAmount));
    this.deliveryHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.deliveryHeader.DiscountValue));
    this.deliveryHeaderForm.controls['DiscountType'].setValue(this.deliveryHeader.DiscountType);
    this.deliveryHeaderForm.controls['WHTaxValue'].setValue(this.numbersService.Convert2Decimal(this.deliveryHeader.WHTaxValue));
    this.deliveryHeaderForm.controls['WHTaxType'].setValue(this.deliveryHeader.WHTaxType);
    this.deliveryHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(this.deliveryHeader.WHTaxAmount));
    this.deliveryHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(this.deliveryHeader.VATAmount));
    this.deliveryHeaderForm.controls['VATType'].setValue(this.deliveryHeader.VATType);
    this.deliveryHeaderForm.controls['DeliveryFee'].setValue(this.numbersService.Convert2Decimal(this.deliveryHeader.DeliveryFee));
    this.deliveryHeaderForm.controls['PaymentType'].setValue(this.deliveryHeader.PaymentType);
    this.deliveryHeaderForm.controls['CheckNo'].setValue(this.deliveryHeader.CheckNo);
    this.deliveryHeaderForm.controls['BankName'].setValue(this.deliveryHeader.BankName);
    if(this.deliveryHeader.CheckDate != 'NA'){
      this.deliveryHeaderForm.controls['CheckDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.deliveryHeader.CheckDate)) );
    }
    if(this.deliveryHeader.CheckDate2 != null){
      this.deliveryHeaderForm.controls['CheckDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.deliveryHeader.CheckDate2)) );
    }
    this.deliveryHeaderForm.controls['Remarks'].setValue(this.deliveryHeader.Remarks);
    this.deliveryHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(this.deliveryHeader.VATableAmount));
    this.deliveryHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(this.deliveryHeader.TermDays));
    this.deliveryHeaderForm.controls['VATSales'].setValue(this.numbersService.Convert2Decimal(this.deliveryHeader.VATSales));
    this.deliveryHeaderForm.controls['VATExemptSales'].setValue(this.numbersService.Convert2Decimal(this.deliveryHeader.VATExemptSales));
    this.deliveryHeaderForm.controls['ZeroRatedSales'].setValue(this.numbersService.Convert2Decimal(this.deliveryHeader.ZeroRatedSales));
    this.deliveryHeaderForm.controls['NonVATSales'].setValue(this.numbersService.Convert2Decimal(this.deliveryHeader.NonVATSales));
    this.deliveryHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(this.deliveryHeader.DiscountAmount));
    this.deliveryHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.deliveryHeader.DiscountValue));
    if(this.deliveryHeader.DeliveryDate != null){
      this.deliveryHeaderForm.controls['DeliveryDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.deliveryHeader.DeliveryDate)) );
    }
    this.deliveryHeaderForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.deliveryHeader.TransDate));
    this.deliveryHeaderForm.controls['DiscountType'].setValue(this.deliveryHeader.DiscountType);
    this.deliveryHeaderForm.controls['DiscountId'].setValue(this.deliveryHeader.DiscountId);
    this.deliveryHeaderForm.controls['DiscountPerson'].setValue(this.deliveryHeader.DiscountPerson);
    this.deliveryHeaderForm.controls['DepositTo'].setValue(this.deliveryHeader.DepositTo);
    this.deliveryHeaderForm.controls['DepositToCashType'].setValue(this.deliveryHeader.DepositToCashType);
    this.deliveryHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(this.deliveryHeader.TotalDue));
    this.deliveryHeaderForm.controls['CheckId'].setValue(this.deliveryHeader.CheckId);
    this.deliveryHeaderForm.controls['CheckNo'].setValue(this.deliveryHeader.CheckNo);
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
    
    if(this.paymentType.toLowerCase() == "charge"){
      this.deliveryHeaderForm.controls['DepositTo'].setValue('NA');
    }

    this.ToggleCheck(this.paymentType.toLowerCase() == "check");
    this.ToggleDepositTo(this.paymentType.toLowerCase() == "bank deposit");
    this.ToggleTerms(this.paymentType.toLowerCase() == "charge");
  }

  ToggleCheck(value){
    if(value){
      this.deliveryHeaderForm.controls['CheckNo'].enable();
      this.deliveryHeaderForm.controls['CheckDate'].enable();
      this.deliveryHeaderForm.controls['BankName'].enable();
      this.requiredCheck = true;
    }else{
      this.deliveryHeaderForm.controls['CheckNo'].disable();
      this.deliveryHeaderForm.controls['CheckDate'].disable();
      this.deliveryHeaderForm.controls['BankName'].disable();
      this.requiredCheck = false;
    }
    this.selectCheck = value;
  }
  ToggleDepositTo(value){
    if(value){
      this.deliveryHeaderForm.controls['DepositTo'].enable();
      this.requiredBank = true;
    }else{
      this.deliveryHeaderForm.controls['DepositTo'].disable();
      this.requiredBank = false;

    }
  }
  ToggleTerms(value){
    if(value){
      this.deliveryHeaderForm.controls['TermDays'].enable();
    }else{
      this.deliveryHeaderForm.controls['TermDays'].disable();
    }

    if (value)
    {
        this.deliveryHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(this.customer.TermDays ?? 0));
    }
    else
    {
        this.deliveryHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(0));
    }
  }


  async onClickSelectCheck(){
    var customerChecks:any = await firstValueFrom(this.customerChecksService.getUnPaidCustomerChecks(this.customer.CustomerId));

    var cC:any = customerChecks.filter(x => Number(x.Amount).toFixed(2) == Number(this.deliveryHeaderForm.controls['TotalDue'].value).toFixed(2));
    if(!cC[0]){
      this.deliveryHeaderForm.controls['PaymentType'].setValue('CASH');
      this.onChangePaymentType('CASH');
      return this.notif.toastrWarning('No Check Amounting to '+Number(this.deliveryHeaderForm.controls['TotalDue'].value).toFixed(2));
    }
    else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '600px';
      dialogConfig.data = ([this.customer, 'deliveryheaderui']);
      this.dialog.open(UnpaidCustomerChecksUIComponent,dialogConfig).beforeClosed().subscribe(customerCheck => {
        if(customerCheck){
          this.deliveryHeaderForm.controls['CheckId'].setValue(customerCheck.CheckId);
          this.deliveryHeaderForm.controls['CheckNo'].setValue(customerCheck.CheckNo);
          this.deliveryHeaderForm.controls['CheckDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(customerCheck.CheckDate)));
          this.deliveryHeaderForm.controls['CheckDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(customerCheck.CheckDate2)));
          this.deliveryHeaderForm.controls['BankName'].setValue(customerCheck.BankName);
        }
      });
    }
    
  }

  onClickDiscountPerson(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    this.dialog.open(DiscountPersonsUIComponent,dialogConfig).beforeClosed().subscribe(discountPerson => {
      if(discountPerson){
        this.deliveryHeaderForm.controls['DiscountPerson'].setValue(discountPerson.DiscountPerson);
        this.deliveryHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert0Decimal(discountPerson.DiscountPercent));
        this.deliveryHeaderForm.controls['DiscountId'].setValue(this.customer.DiscountId);
        this.discountPersonTxt = discountPerson.DiscountPerson;
        this.computeTotalDue();
      }
    });
  }

  validateForm(){
    if(this.numbersService.isNotGreaterThanOrEqualToZero(this.deliveryHeaderForm.controls['TotalDue'].value.toString())) {
      return this.notif.toastrWarning("TotalDue is Not Greater Than Or Equal To Zero.")
    };

    if (this.deliveryHeaderForm.controls['CustomerName'].value.toLowerCase() == "cash" && this.deliveryHeaderForm.controls['PaymentType'].value.toLowerCase() == "charge")
    {
      return this.notif.toastrWarning("CASH customer cannot have a payment type of CHARGE.")
    }
    return this.onSubmit();
  }
  onSubmit(){
    this.loading = true;

    var dates = ['TransDate','CheckDate2'];
    dates.forEach(x => {
      if(this.deliveryHeaderForm.controls[x].value != null)
        this.deliveryHeaderForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.deliveryHeaderForm.controls[x].value)));
    });

    this.deliveryHeadersService.updateDeliveryHeader(this.transCode, this.totalAmount,  this.btnText,this.deliveryHeaderForm.getRawValue()).subscribe({
      next:(res)=>{
        var deliveryHeader = res.deliveryHeader;
        var deliveryDetails = res.deliveryDetails;

        this.notif.toastrSuccess(res.message);
        if(this.action == 'savedeliverytransaction'){
          if(this.printReceipt){
            this.print(deliveryHeader, deliveryDetails);
          }
        }
        this.dialogRef.close(res.deliveryHeader);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  async print(deliveryHeader, deliveryDetails) {

    var url = this.router.serializeUrl(
      this.router.createUrlTree(['print/printdeliverydetails'])
    );
   
    var title = 'DELIVERY RECEIPT OF  - ' + deliveryHeader.TransNo ;

    this.printService.popupWindow(url, 'printdeliverydetails', window, 1000, 700);
    localStorage.setItem('Header', JSON.stringify(deliveryHeader));
    localStorage.setItem('Details', JSON.stringify(deliveryDetails));
    localStorage.setItem('DeliveryConfig', JSON.stringify(this.deliveryConfig));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo',  deliveryHeader.TransNo);
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
      dialogConfig.data         = ([this.deliveryHeader.TransNo, 'DeliveryHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([null, 'DeliveryHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }
  }

}
