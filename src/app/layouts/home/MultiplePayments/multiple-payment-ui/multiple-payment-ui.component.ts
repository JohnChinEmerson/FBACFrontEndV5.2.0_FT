import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NumbersService } from '../../../../services/numbers.service';
import { MultiplePaymentHeadersService } from '../../../../services/MultiplePayments/multiple-payment-headers.service';
import { firstValueFrom } from 'rxjs';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { BanksService } from 'src/app/services/Cashflow/banks.service';
import { NotificationService } from '../../../../services/notification.service';
import { MultiplePaymentDetailsUIComponent } from '../multiple-payment-details-ui/multiple-payment-details-ui.component';
import { DateTimesService } from '../../../../services/date-times.service';

@Component({
  selector: 'app-multiple-payment-ui',
  templateUrl: './multiple-payment-ui.component.html',
  styleUrls: ['./multiple-payment-ui.component.css']
})
export class MultiplePaymentUIComponent implements OnInit {
mulitplePaymentForm = new FormGroup({
      TotalDue   : new FormControl(''),
      TotalPaid   : new FormControl(''),
      AmountPaid   : new FormControl(''),
      Remaining   : new FormControl(''),
      PaymentType   : new FormControl(''),
      DepositTo   : new FormControl(''),
      ReferenceNo   : new FormControl(''),
      CheckNo   : new FormControl(''),
      CheckDate   : new FormControl(''),
      CheckDate2   : new FormControl(''),
      BankName   : new FormControl(''),
  });
  ui : string;
  btnText : string;
  btnText2 : string;
  sHeader : any=[];
  mPHeader: any=[];
  tPaid : number = 0;
  loading : boolean;
  paymentTypes :any=[];
  cashAccounts : any=[];
  banks :any=[];
  paymentType : string;
  requiredDepositTo :boolean = false;
  requiredCheck : boolean = false;
  requiredBank :boolean = false;
  lblRemaining :string  = "Remaining";
  displayBank = (value: string): string => value || '';
  constructor(
      private dialogRef : MatDialogRef<MultiplePaymentUIComponent>,
      private dialog : MatDialog,
      private numbersService : NumbersService,
      private cashAccountsService : CashAccountsService,
      private multiplePaymentHeadersService : MultiplePaymentHeadersService,
      private banksService : BanksService,
      private notificationService : NotificationService,
      private dateTimesService : DateTimesService,
      private cdRef: ChangeDetectorRef,
      @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  async ngOnInit(): Promise<void> {
    if(this.data){
      this.sHeader  = this.data[0];
      this.ui       = this.data[1];
      this.btnText  = this.data[2];
      this.mPHeader  = this.data[3];
      this.btnText2  = this.data[4];
      
      
    }
    this.getmulitplePaymentFormData();
    this.paymentTypes = await firstValueFrom(this.cashAccountsService.setPaymentTypes(this.sHeader.CustomerId, false));

    if(this.mPHeader){
     this.getmulitplePaymentFormData2();
    }
  }

  async getmulitplePaymentFormData(){
    this.mulitplePaymentForm.controls['TotalDue'].setValue(this.numbersService.Convert2Decimal(this.sHeader.TotalDue));
    await this.displayTotalPaid();
    // this.mulitplePaymentForm.controls['Remaining'].setValue(this.numbersService.Convert2Decimal(+this.sHeader.TotalDue - +this.sHeader.AmountPaid));
  }

  async displayTotalPaid(){
    this.tPaid = await firstValueFrom(this.multiplePaymentHeadersService.computeMultiplePaymentsByTransCodeByColumnFilter(this.sHeader.TransCode, 'all')); // then i got 1000
    this.mulitplePaymentForm.controls['TotalPaid'].setValue(this.numbersService.Convert2Decimal(this.tPaid)); // then i set value TotalPaid into 1000, which was previously 1500 
    this.cdRef.detectChanges(); 
    this.onChangeTotalPaid();
  }

  async getcashAccounts(){
    this.cashAccounts = await firstValueFrom(this.cashAccountsService.loadCashAccounts(this.paymentType));
  }
  async getBanks(){
    this.banks = await firstValueFrom(this.banksService.getBanks());
  }

  async getmulitplePaymentFormData2()
  {
      await this.displayTotalPaid();
      await this.onChangePaymentType(this.mPHeader.PaymentType);
      this.btnText = "Update";

      var payment = +this.tPaid - +this.mPHeader.AmountPaid;
      this.mulitplePaymentForm.controls['TotalPaid'].setValue(this.numbersService.Convert2Decimal(payment));
      this.mulitplePaymentForm.controls['AmountPaid'].setValue(this.numbersService.Convert2Decimal(this.mPHeader.AmountPaid));
      this.mulitplePaymentForm.controls['PaymentType'].setValue(this.mPHeader.PaymentType);
      this.mulitplePaymentForm.controls['DepositTo'].setValue(this.mPHeader.DepositTo);
      this.mulitplePaymentForm.controls['ReferenceNo'].setValue(this.mPHeader.ReferenceNo);
      this.mulitplePaymentForm.controls['CheckNo'].setValue(this.mPHeader.CheckNo);
      this.mulitplePaymentForm.controls['BankName'].setValue(this.mPHeader.BankName);

      if (this.mPHeader.CheckDate.toLowerCase() != "na"){
        this.mulitplePaymentForm.controls['CheckDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new  Date(this.mPHeader.CheckDate2)));
      }
  }
  

  async onChangePaymentType(paymentType)
  {
    this.paymentType = paymentType.toLowerCase();
    await this.getcashAccounts();
    await this.getBanks();

    this.ToggleCheck(this.paymentType.toLowerCase() == "check");
    this.ToggleDepositTo(this.paymentType.toLowerCase() == "bank deposit");
  }
  ToggleCheck(value)
  {
    if(value){
      this.mulitplePaymentForm.controls['CheckNo'].enable();
      this.mulitplePaymentForm.controls['CheckDate'].enable();
      this.mulitplePaymentForm.controls['CheckDate2'].enable();
      this.mulitplePaymentForm.controls['BankName'].enable();
      this.requiredCheck = true;
    }else{
      this.mulitplePaymentForm.controls['CheckNo'].disable();
      this.mulitplePaymentForm.controls['CheckDate'].disable();
      this.mulitplePaymentForm.controls['CheckDate2'].disable();
      this.mulitplePaymentForm.controls['BankName'].disable();
      this.mulitplePaymentForm.controls['CheckNo'].setValue('NA');
      this.mulitplePaymentForm.controls['CheckDate'].setValue('NA');
      this.mulitplePaymentForm.controls['CheckDate2'].setValue(null);
      this.mulitplePaymentForm.controls['BankName'].setValue('NA');

      this.requiredCheck = false;
    }
  }
  ToggleDepositTo(value)
  {
    if(value){
      this.mulitplePaymentForm.controls['DepositTo'].enable();
      this.requiredBank = true;
    }else{
      this.mulitplePaymentForm.controls['DepositTo'].disable();
      this.mulitplePaymentForm.controls['DepositTo'].setValue('');
      this.requiredBank = false;
    }
  }
        
  onChangeAmountPaid()
  {
      this.computeRemaining();
  }

  onChangeTotalPaid(){
    this.computeRemaining();

  }

  computeRemaining(){
    var totalDue =  this.numbersService.isNotNumeric(this.mulitplePaymentForm.controls['TotalDue'].value.toString())  ? 0 : +this.mulitplePaymentForm.controls['TotalDue'].value;
    var totalPaid =  this.numbersService.isNotNumeric(this.mulitplePaymentForm.controls['TotalPaid'].value.toString())  ? 0 : +this.mulitplePaymentForm.controls['TotalPaid'].value;
    var amountPaid =  this.numbersService.isNotNumeric(this.mulitplePaymentForm.controls['AmountPaid'].value.toString())  ? 0 : +this.mulitplePaymentForm.controls['AmountPaid'].value;
    var remaining = totalDue - (totalPaid + amountPaid);
    this.mulitplePaymentForm.controls['Remaining'].setValue(this.numbersService.Convert2Decimal(remaining));
    if (remaining <= 0)
        this.lblRemaining = "Change";
    else
        this.lblRemaining = "Remaining";
  }

  async onClose(){
    await this.displayTotalPaid();
    if(this.btnText2.toLowerCase() == 'update'){
      var totalDue =  this.mulitplePaymentForm.controls['TotalDue'].value;
      var totalPaid =  this.mulitplePaymentForm.controls['TotalPaid'].value;
      var remaining = totalDue - totalPaid;
      if (remaining > 0)
      {
          // return this.notificationService.toastrWarning("TotalPaid should Greater than or Equal to TotalDue.");

          if(totalPaid <= 0){
            this.dialogRef.close(false);
          }else{
            return this.notificationService.toastrWarning("TotalPaid should Greater than or Equal to TotalDue.");

            // this.notificationService.popupWarning("Cancel Multiple Payments","TotalPaid should Greater than or Equal to TotalDue. Cancel and Delete MultiplePayments?").then(async (result) => {
            //   if (result.value) {
            //     this.multiplePaymentHeadersService.deleteMultiplePaymentsBySourceTransCode(this.sHeader.TransCode).subscribe({
            //       next:(res)=>{
            //         this.notificationService.toastrSuccess(res.message);
            //         this.dialogRef.close(false);
            //       },
            //       error:(err)=>{
            //         this.notificationService.toastrError(err.error);
            //       },
            //     });
            //   }
            // });
          }
      }else{
        this.dialogRef.close(this.tPaid);
      }
    }else{
      this.dialogRef.close(this.tPaid);
    }
  }

  validateForm(){
    var totalDue = +this.mulitplePaymentForm.controls['TotalDue'].value;
    var totalPaid = +this.mulitplePaymentForm.controls['TotalPaid'].value;
    if (totalPaid >= totalDue)
    {
      return this.notificationService.toastrWarning("Cannot Save. Fully Paid Already.");
    }
    return this.onSubmit();
  }

  onSubmit(){
    var dates = ['CheckDate2'];
    dates.forEach(x => {
      if(this.mulitplePaymentForm.controls[x].value != null)
        this.mulitplePaymentForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.mulitplePaymentForm.controls[x].value)));
    });

    var data:any ={
      sHeader : this.sHeader,
      request : this.mulitplePaymentForm.getRawValue(),
      cashAccounts : this.cashAccounts,
      mPHeader : this.mPHeader,
    };

    this.multiplePaymentHeadersService.saveMultiplePaymentHeader(this.btnText,data).subscribe({
      next:(res)=>{
        this.notificationService.toastrSuccess(res.message);
        if(this.btnText == 'Save'){
          this.displayTotalPaid();
          this.resetForm();
        }else{
          this.dialogRef.close(res.multiplePaymentHeader);

          const dialogConfig        = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus    = true;
          dialogConfig.width        = '800px';
          dialogConfig.data         = this.sHeader;
          this.dialog.open(MultiplePaymentDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
              if(x){
                // this.saleHeaderForm.controls['AmountPaid'].setValue(this.numbersService.Convert2Decimal(x.TotalPaid));
                this.displayTotalPaid();
              }
              this.displayTotalPaid();
          });
        }
        this.loading = false;
      },
      error:(err)=> {
        this.notificationService.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  onClickViewDetails(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '800px';
    dialogConfig.data         = this.sHeader;
    this.dialog.open(MultiplePaymentDetailsUIComponent,dialogConfig).afterClosed().subscribe(async x => {
        await this.displayTotalPaid();
    });
  }

  resetForm(){
    this.mulitplePaymentForm.controls['AmountPaid'].setValue('');
    this.mulitplePaymentForm.controls['CheckNo'].setValue('');
    this.mulitplePaymentForm.controls['CheckDate'].setValue('');
    this.mulitplePaymentForm.controls['CheckDate2'].setValue('');
    this.mulitplePaymentForm.controls['BankName'].setValue('');
    this.mulitplePaymentForm.controls['ReferenceNo'].setValue('');
    this.mulitplePaymentForm.controls['PaymentType'].setValue('');
    this.mulitplePaymentForm.controls['DepositTo'].setValue('');
    this.btnText = 'Save';
  }

}
