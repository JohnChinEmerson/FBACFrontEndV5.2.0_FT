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
import { ReturnToSupplierConfigService } from 'src/app/services/ReturnToSupplier/return-to-supplier-config.service';
import { ReturnToSupplierDetailsService } from 'src/app/services/ReturnToSupplier/return-to-supplier-details.service';
import { ReturnToSupplierHeadersService } from 'src/app/services/ReturnToSupplier/return-to-supplier-headers.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { TaxHelperService } from 'src/app/services/tax-helper.service';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';
import { BanksService } from 'src/app/services/Cashflow/banks.service';
import { fitHeaderDialogToPhone } from '../../../shared/transaction-header/transaction-header';

@Component({
  selector: 'app-return-to-supplier-header-ui',
  templateUrl: './return-to-supplier-header-ui.component.html',
  styleUrls: ['../../../shared/transaction-header/transaction-header.css']
})
export class ReturnToSupplierHeaderUIComponent implements OnInit {

  btnText : string = "Save";
   loading : boolean = false;
   returnToSupplierHeader: any=[];
   paymentTypes: any=[];
   paymentType: string;
   discountTypes: any=['percent', 'amount'];
   vatTypes: any=['No VAT', 'VAT Included', 'Add VAT'];
   action:string;
   totalAmount:string;
   refundable:string;
   transCode:string;
   recordStatus:string;
   supplier:any=[];
   returnToSupplierConfig:any=[];
   cashAccounts:any=[];
    checks:any=[];
    banks:any=[];
    requiredDepositTo :boolean = false;
    requiredCheck : boolean = false;
    requiredBank :boolean = false;
    displayBank = (value: string): string => value || '';
   returnToSupplierHeaderForm = new FormGroup({
               id          : new FormControl(''),
               TransNo     : new FormControl(''),
               TransCode   : new FormControl(''),
               TransDate   : new FormControl(new Date()),
               SupplierId      : new FormControl(''),
               SupplierName      : new FormControl(''),
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
               DepositTo: new FormControl(''),
               DepositToCashType: new FormControl(''),
               CheckId: new FormControl(''),
               CheckNo: new FormControl(''),
               CheckDate: new FormControl(''),
               CheckDate2: new FormControl(null),
               BankName: new FormControl(''),
              Change: new FormControl('0'),
   });
   printReceipt: boolean = false;
   disablePrintReceipt: boolean = false;
   TermDaysReadOnly: boolean;
   PaymentTypeEnabled : boolean = true;
   toggleType: string = 'change';
   selectCheck: boolean = false;
   constructor(
     private dialogRef         : MatDialogRef<ReturnToSupplierHeaderUIComponent>,
     private dialog                      : MatDialog,
    private returnToSupplierHeadersService  : ReturnToSupplierHeadersService,
    private returnToSupplierDetailsService  : ReturnToSupplierDetailsService,
    private banksService : BanksService,
    private notif             : NotificationService,
     private returnToSupplierConfigService    : ReturnToSupplierConfigService,
     private cashAccountsService : CashAccountsService,
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
       this.returnToSupplierHeader = this.data[1];
       this.transCode = this.data[2];
       this.totalAmount = this.data[3];
       this.recordStatus = this.data[4];
       this.action = this.data[5];
       this.refundable = this.data[6];
 
       await this.getReturnToSupplierConfig();
 
       this.getreturnToSupplierHeaderFormDefault();
 
       if (this.action.toLowerCase() == 'savereturntosuppliertransaction' ) {
         this.btnText = "Save";
         this.getreturnToSupplierHeaderForm1();
       }
       if (this.action.toLowerCase() == 'updatereturntosupplierheader' ) {
         this.btnText = "Update";
         this.getreturnToSupplierHeaderForm2();
       }
     }
   }
 
    async getBanks(){
    this.banks = await firstValueFrom(this.banksService.getBanks());
  }

   async getReturnToSupplierConfig(){
     this.returnToSupplierConfig = await firstValueFrom(this.returnToSupplierConfigService.getReturnToSupplierConfig());
     this.setUpFields();
   }
 
   setUpFields(){
     this.printReceipt = this.returnToSupplierConfig.PrintReceipt.toLowerCase() == "yes";

     if(this.returnToSupplierConfig.DisableTransDate.toLowerCase() == 'yes'){
      this.returnToSupplierHeaderForm.controls['TransDate'].disable();
    }else{
      this.returnToSupplierHeaderForm.controls['TransDate'].enable();
    }
   }
 
   getreturnToSupplierHeaderFormDefault(){
     this.returnToSupplierHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert2Decimal(0));
   }
 
   async getreturnToSupplierHeaderForm1(){
     this.returnToSupplierHeaderForm.controls['TransCode'].setValue(this.transCode);
     this.returnToSupplierHeaderForm.controls['SupplierId'].setValue(this.supplier.SupplierId);
     this.returnToSupplierHeaderForm.controls['SupplierName'].setValue(this.supplier.SupplierName);
     this.returnToSupplierHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.totalAmount));
     this.returnToSupplierHeaderForm.controls['Refundable'].setValue(this.numbersService.Convert2Decimal(this.refundable));
     this.returnToSupplierHeaderForm.controls['AmountPaid'].setValue(this.numbersService.Convert2Decimal(this.refundable));

     this.returnToSupplierHeaderForm.controls['DiscountType'].setValue(this.discountTypes[0]);
     this.returnToSupplierHeaderForm.controls['WHTaxType'].setValue(this.discountTypes[0]);
     this.returnToSupplierHeaderForm.controls['VATType'].setValue(this.vatTypes[0]);
 
     await this.getPaymentType(this.supplier.supplierId);
     this.returnToSupplierHeaderForm.controls['PaymentType'].setValue(this.paymentTypes[0]);
     this.returnToSupplierHeaderForm.controls['VATType'].setValue(this.taxHelperService.VATType());
 
     
     this.computeTotalDue();
     this.onChangePaymentType(this.paymentTypes[0]);
   }
   
   async getPaymentType(supplierId){
     this.paymentTypes = await firstValueFrom(this.cashAccountsService.setPaymentTypes(supplierId, true));
   }
 
 
   async computeTotalDue(){
     
     var data:any = {
       TotalAmount     : this.numbersService.isNotNumeric(this.returnToSupplierHeaderForm.controls['TotalAmount'].value.toString())  ? 0 : +this.returnToSupplierHeaderForm.controls['TotalAmount'].value,
       Refundable     : this.numbersService.isNotNumeric(this.returnToSupplierHeaderForm.controls['Refundable'].value.toString())  ? 0 : +this.returnToSupplierHeaderForm.controls['Refundable'].value,
       DiscountValue   : this.numbersService.isNotNumeric(this.returnToSupplierHeaderForm.controls['DiscountValue'].value.toString())  ? 0 : +this.returnToSupplierHeaderForm.controls['DiscountValue'].value,
       DiscountType    : this.returnToSupplierHeaderForm.controls['DiscountType'].value.toLowerCase(),
       WHTaxValue      : this.numbersService.isNotNumeric(this.returnToSupplierHeaderForm.controls['WHTaxValue'].value.toString())  ? 0 : +this.returnToSupplierHeaderForm.controls['WHTaxValue'].value,
       WHTaxType       : this.returnToSupplierHeaderForm.controls['WHTaxType'].value.toLowerCase(),
       VATType         : this.returnToSupplierHeaderForm.controls['VATType'].value.toLowerCase(),
     }
 
 
     var result:any = await firstValueFrom(this.returnToSupplierHeadersService.getReturnToSupplierHeaderComputedAmounts(data));
     this.returnToSupplierHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(result.DiscountAmount))
     this.returnToSupplierHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(result.VATableAmount))
     this.returnToSupplierHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(result.VATAmount))
     this.returnToSupplierHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(result.WHTaxAmount))
     this.returnToSupplierHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(result.TotalDue))

     var amountPaid:any = this.returnToSupplierHeaderForm.controls['AmountPaid'].value;
     if(amountPaid){
       var change:any = +amountPaid - +result.TotalDue;
       this.returnToSupplierHeaderForm.controls['Change'].setValue(this.numbersService.Convert2Decimal(change))
     }else{
       this.returnToSupplierHeaderForm.controls['Change'].setValue('');
     }
   }
 
 
   async getreturnToSupplierHeaderForm2(){
       await this.getPaymentType(this.returnToSupplierHeader.SupplierId);
 
       this.printReceipt = false;
       this.disablePrintReceipt = true;

       this.computeTotalDue();
       await this.onChangePaymentType(this.returnToSupplierHeader.PaymentType);
       this.displayReturnToSupplierHeaderValues();
   }
 
   displayReturnToSupplierHeaderValues(){
     this.returnToSupplierHeaderForm.controls['id'].setValue(this.returnToSupplierHeader.id);
     this.returnToSupplierHeaderForm.controls['TransNo'].setValue(this.returnToSupplierHeader.TransNo);
     this.returnToSupplierHeaderForm.controls['TransCode'].setValue(this.returnToSupplierHeader.TransCode);
     this.returnToSupplierHeaderForm.controls['SupplierId'].setValue(this.returnToSupplierHeader.SupplierId);
     this.returnToSupplierHeaderForm.controls['SupplierName'].setValue(this.returnToSupplierHeader.SupplierName);
     this.returnToSupplierHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierHeader.TotalAmount));
     this.returnToSupplierHeaderForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierHeader.TotalDue));
     this.returnToSupplierHeaderForm.controls['Refundable'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierHeader.Refundable));
 
     this.returnToSupplierHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierHeader.DiscountValue));
     this.returnToSupplierHeaderForm.controls['DiscountType'].setValue(this.returnToSupplierHeader.DiscountType);
     this.returnToSupplierHeaderForm.controls['WHTaxValue'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierHeader.WHTaxValue));
     this.returnToSupplierHeaderForm.controls['WHTaxType'].setValue(this.returnToSupplierHeader.WHTaxType);
     this.returnToSupplierHeaderForm.controls['WHTaxAmount'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierHeader.WHTaxAmount));
     this.returnToSupplierHeaderForm.controls['VATAmount'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierHeader.VATAmount));
     this.returnToSupplierHeaderForm.controls['VATType'].setValue(this.returnToSupplierHeader.VATType);
     this.returnToSupplierHeaderForm.controls['PaymentType'].setValue(this.returnToSupplierHeader.PaymentType);
     this.returnToSupplierHeaderForm.controls['Remarks'].setValue(this.returnToSupplierHeader.Remarks);
     this.returnToSupplierHeaderForm.controls['VATableAmount'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierHeader.VATableAmount));
     this.returnToSupplierHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(this.returnToSupplierHeader.TermDays));
     this.returnToSupplierHeaderForm.controls['DiscountAmount'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierHeader.DiscountAmount));
     this.returnToSupplierHeaderForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierHeader.DiscountValue));
     this.returnToSupplierHeaderForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.returnToSupplierHeader.TransDate));
     this.returnToSupplierHeaderForm.controls['DiscountType'].setValue(this.returnToSupplierHeader.DiscountType);
    this.returnToSupplierHeaderForm.controls['Change'].setValue(this.numbersService.Convert2Decimal(+this.returnToSupplierHeader.AmountPaid - +this.returnToSupplierHeader.TotalDue ));
    this.returnToSupplierHeaderForm.controls['CheckNo'].setValue(this.returnToSupplierHeader.CheckNo);
    this.returnToSupplierHeaderForm.controls['BankName'].setValue(this.returnToSupplierHeader.BankName);
    this.returnToSupplierHeaderForm.controls['CheckDate'].setValue(this.returnToSupplierHeader.CheckDate);
    this.returnToSupplierHeaderForm.controls['CheckDate2'].setValue(this.dateTimesService.ConvertToDateFormat(this.returnToSupplierHeader.CheckDate2));
    this.returnToSupplierHeaderForm.controls['DepositTo'].setValue(this.returnToSupplierHeader.DepositTo);
    this.returnToSupplierHeaderForm.controls['DepositToCashType'].setValue(this.returnToSupplierHeader.DepositToCashType);
    this.returnToSupplierHeaderForm.controls['AmountPaid'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierHeader.AmountPaid));
    this.returnToSupplierHeaderForm.controls['CheckId'].setValue(this.returnToSupplierHeader.CheckId);
    this.returnToSupplierHeaderForm.controls['CheckNo'].setValue(this.returnToSupplierHeader.CheckNo);
     this.PaymentTypeEnabled = this.returnToSupplierHeader.AmountPaid == 0;
   }
 
   async getcashAccounts(){
    this.cashAccounts = await firstValueFrom(this.cashAccountsService.loadCashAccounts(this.paymentType));
  }

  async onChangePaymentType(paymentType)
  {
      this.paymentType = paymentType.toLowerCase();
      await this.getcashAccounts();
      await this.getBanks();
      
      if(this.paymentType.toLowerCase() == "charge"){
        this.returnToSupplierHeaderForm.controls['DepositTo'].setValue('NA');
      }

      this.ToggleCheck(this.paymentType.toLowerCase() == "check");
      this.ToggleDepositTo(this.paymentType.toLowerCase() == "bank deposit");
      
      if (this.paymentType.toLowerCase() == "check" || this.paymentType.toLowerCase() == "bank deposit")
            this.returnToSupplierHeaderForm.controls['AmountPaid'].disable();
      else 
          this.returnToSupplierHeaderForm.controls['AmountPaid'].enable();

      this.returnToSupplierHeaderForm.controls['AmountPaid'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierHeaderForm.controls['Refundable'].value));

      this.ToggleTerms(this.paymentType.toLowerCase() == "charge");
      if (this.paymentType.toLowerCase() == "charge")
      {
          this.ToogleChange("Balance");
          this.returnToSupplierHeaderForm.controls['Change'].setValue(this.numbersService.Convert2Decimal(this.returnToSupplierHeaderForm.controls['Change'].value));
      }
      else 
      {
          this.ToogleChange("Change");
      }
  }



  ToggleCheck(value){
    if(value){
      this.returnToSupplierHeaderForm.controls['CheckNo'].enable();
      this.returnToSupplierHeaderForm.controls['CheckDate2'].enable();
      this.returnToSupplierHeaderForm.controls['BankName'].enable();
      this.requiredCheck = true;
    }else{
      this.returnToSupplierHeaderForm.controls['CheckNo'].disable();
      this.returnToSupplierHeaderForm.controls['CheckDate2'].disable();
      this.returnToSupplierHeaderForm.controls['BankName'].disable();
      this.requiredCheck = false;
    }
    this.selectCheck = value;
  }
  ToggleDepositTo(value){
    if(value){
      this.returnToSupplierHeaderForm.controls['DepositTo'].enable();
      this.requiredBank = true;
    }else{
      this.returnToSupplierHeaderForm.controls['DepositTo'].disable();
      this.requiredBank = false;

    }
  }
  ToggleTerms(value){
    if(value){
      this.returnToSupplierHeaderForm.controls['TermDays'].enable();
      this.returnToSupplierHeaderForm.controls['AmountPaid'].disable();
    }else{
      this.returnToSupplierHeaderForm.controls['TermDays'].disable();
      this.returnToSupplierHeaderForm.controls['AmountPaid'].enable();
    }

    if (value)
    {
        this.returnToSupplierHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(this.supplier.TermDays ?? 0));
        this.returnToSupplierHeaderForm.controls['AmountPaid'].setValue(this.numbersService.Convert2Decimal(0));
    }
    else
    {
        this.returnToSupplierHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(0));
    }
  }
  ToogleChange(value){
    this.toggleType = value.toLowerCase();
  }

    onClickSelectCheck(){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '600px';
      dialogConfig.data = ([this.supplier, 'returntosupplierheaderui']);
      // this.dialog.open(UnpaidSupplierChecksUIComponent,dialogConfig).beforeClosed().subscribe(supplierCheck => {
       
      // });
    }

   validateForm(){
 
    if(this.numbersService.isNotGreaterThanOrEqualToZero(this.returnToSupplierHeaderForm.controls['TotalDue'].value.toString())) {
      return this.notif.toastrWarning("TotalDue is Not Greater Than Or Equal To Zero.")
    };

    if (this.returnToSupplierHeaderForm.controls['SupplierName'].value.toLowerCase() == "cash" && this.returnToSupplierHeaderForm.controls['PaymentType'].value.toLowerCase() == "charge")
    {
      return this.notif.toastrWarning("CASH customer cannot have a payment type of CHARGE.")
    }
    if (this.returnToSupplierHeaderForm.controls['PaymentType'].value.toLowerCase() != "charge"){
      if(this.numbersService.AmountPaidIsLessThan(this.returnToSupplierHeaderForm.controls['AmountPaid'].value.toString(),this.returnToSupplierHeaderForm.controls['TotalDue'].value.toString())) {
        return this.notif.toastrWarning("AmountPaid Is LessThan TotalDue.")
      };
    }
     return this.onSubmit();
   }
   onSubmit(){
     this.loading = true;
 
     var dates = ['TransDate'];
     dates.forEach(x => {
       if(this.returnToSupplierHeaderForm.controls[x].value != null)
         this.returnToSupplierHeaderForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.returnToSupplierHeaderForm.controls[x].value)));
     });
 
     this.returnToSupplierHeadersService.updateReturnToSupplierHeader(this.transCode, this.totalAmount,this.recordStatus, this.action,this.returnToSupplierHeaderForm.getRawValue()).subscribe({
       next:(res)=>{
         var returnToSupplierHeader = res.returnToSupplierHeader;
         var returnToSupplierDetails = res.returnToSupplierDetails;
 
         this.notif.toastrSuccess(res.message);
         if(this.action == 'savereturntosuppliertransaction'){
           if(this.printReceipt){
             this.print(returnToSupplierHeader, returnToSupplierDetails);
           }
         }
         this.dialogRef.close(res.returnToSupplierHeader);
         this.loading = false;
       },
       error:(err)=> {
         this.notif.toastrError(err.error.message);
         this.loading = false;
       },
     });
   }
 
   print(returnToSupplierHeader, returnToSupplierDetails) {
     var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreturntosupplierdetails']));
     var title = 'RETURN TO SUPPLIER RECEIPT OF  - ' + returnToSupplierHeader.TransNo ;
     
     this.printService.popupWindow(url, 'returnToSupplierDetails', window, 800, 800);
     localStorage.setItem('Header', JSON.stringify(returnToSupplierHeader));
     localStorage.setItem('Details', JSON.stringify(returnToSupplierDetails));
     localStorage.setItem('ReturnToSupplierConfig', JSON.stringify(this.returnToSupplierConfig));
     localStorage.setItem('Title', title);
     localStorage.setItem('TransNo', returnToSupplierHeader.TransNo);
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
        dialogConfig.data         = ([this.returnToSupplierHeader.TransNo, 'ReturnToSupplierHeaders']);
        this.dialog.open(SignaturesUIComponent,dialogConfig);
      }else{
        const dialogConfig        = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus    = true;
        dialogConfig.width        = '1000px';
        dialogConfig.data         = ([null, 'ReturnToSupplierHeaders']);
        this.dialog.open(SignaturesUIComponent,dialogConfig);
      }
    }
  

}
