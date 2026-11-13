import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { CashDrawersService } from 'src/app/services/Cashiering/cash-drawers.service';
import { WithdrawalsService } from 'src/app/services/Cashiering/withdrawals.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';

@Component({
  selector: 'app-withdrawal-ui',
  templateUrl: './withdrawal-ui.component.html',
  styleUrls: ['./withdrawal-ui.component.css']
})
export class WithdrawalUIComponent implements OnInit {

  cashReadingsToDeposit:any=[];
  cashAccounts : any=[];
  cashDrawer : any=[];
  withdrawal : any=[];
  btnText: string = 'Save';
  readingNo :string;
  loading : boolean = false;
  withdrawalForm                = new FormGroup({
      ReadingNo   : new FormControl(''),
      TotalCash   : new FormControl(''),
      Amount      : new FormControl(''),
      Reason      : new FormControl(''),
      Destination : new FormControl(''),
      DestinationType: new FormControl(''),
      id          : new FormControl(''),
  });

  constructor(
    private withdrawalsService : WithdrawalsService,
    private cashAccountsService : CashAccountsService,
    private cashDrawersService : CashDrawersService,
    private numbersService : NumbersService,
    private notificationService : NotificationService,
    private authService : AuthService,
    private dialog : MatDialog,
    private dialogRef : MatDialogRef<WithdrawalUIComponent>,
    private router : Router,
    @Inject(MAT_DIALOG_DATA) public data: any, 

  ) { }

  async ngOnInit(): Promise<void> {
    this.withdrawal     = this.data[0];
    this.readingNo      = this.data[1];
    await this.getOpenCashDrawer();
    await this.displayTotalCash();
    await this.getCashAccounts();
    
    if(this.withdrawal){
      this.getWithdrawalFormData();
      this.btnText = 'Update';
    }
  }

  async  getOpenCashDrawer(){
    if(!this.readingNo){
      this.cashDrawer = await firstValueFrom(this.cashDrawersService.GetOpenCashDrawerByUserId(this.authService.LoginId));
      if (this.cashDrawer != null){
          this.readingNo = this.cashDrawer.ReadingNo;
      }
    }
  }

  async displayTotalCash(){
    this.cashDrawer = await firstValueFrom(this.cashDrawersService.getCashDrawerByReadingNo(this.readingNo ));
    if (this.cashDrawer != null){
      var totals:any = await firstValueFrom(this.cashDrawersService.getTotalByCashDrawer(this.cashDrawer ));
        this.withdrawalForm.controls['ReadingNo'].setValue(this.cashDrawer.ReadingNo);
        this.withdrawalForm.controls['TotalCash'].setValue(this.numbersService.Convert2Decimal(totals.TotalCash));
    }
    
  }

  async getCashAccounts(){
    this.cashAccounts = await firstValueFrom(this.cashAccountsService.loadCashAccounts('all'));
  }

  onChangeCashAccount(data){
    this.withdrawalForm.controls['DestinationType'].setValue(data.CashAccountType);

  }
  getWithdrawalFormData(){
    this.withdrawalForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(this.withdrawal.Amount));
    this.withdrawalForm.controls['Reason'].setValue(this.withdrawal.Reason);
    this.withdrawalForm.controls['Destination'].setValue(this.withdrawal.Destination);
    this.withdrawalForm.controls['DestinationType'].setValue(this.withdrawal.DestinationType);
    this.withdrawalForm.controls['id'].setValue(this.withdrawal.id);
  }

  onSubmit(){
    var totalCash:any =  this.withdrawalForm.controls['TotalCash'].value;
    var totalAmount:any =  this.withdrawalForm.controls['Amount'].value;
    if (+totalAmount > +totalCash)
    {
      return this.notificationService.toastrWarning("Withdraw Amount must not greater than TotalCash");
    }
            
    this.loading = true;
    this.withdrawalsService.saveEditWithdrawal(this.withdrawalForm.getRawValue()).subscribe({
      next:(res)=>{
        this.notificationService.toastrSuccess(res.message);
        this.dialogRef.close(res.withdrawal);
        this.loading = false;
      },
      error:(err)=>{
        this.notificationService.toastrError(err.error);
        this.loading = false;
      },
    })
  }


  onClose(){
    this.dialogRef.close();
  }

}
