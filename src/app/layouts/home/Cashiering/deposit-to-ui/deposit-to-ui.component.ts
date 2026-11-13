import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { CashDrawersService } from 'src/app/services/Cashiering/cash-drawers.service';
import { CashReadingsService } from 'src/app/services/Cashiering/cash-readings.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';

@Component({
  selector: 'app-deposit-to-ui',
  templateUrl: './deposit-to-ui.component.html',
  styleUrls: ['./deposit-to-ui.component.css']
})
export class DepositToUIComponent implements OnInit {
  cashReadingsToDeposit:any=[];
  cashAccounts : any=[];
  cashAccount : string;
  componentFrom : string;
  depositStatus : string;
  btnText: string = 'Save';
  loading : boolean = false;
  constructor(
    private cashReadingsService : CashReadingsService,
    private cashAccountsService : CashAccountsService,
    private numbersService : NumbersService,
    private notificationService : NotificationService,
    private authService : AuthService,
    private dialog : MatDialog,
    private dialogRef : MatDialogRef<DepositToUIComponent>,
    private router : Router,
    @Inject(MAT_DIALOG_DATA) public data: any, 

  ) { }

  ngOnInit(): void {
    this.componentFrom = this.data[0];
    this.cashReadingsToDeposit = this.data[1];
    this.depositStatus = this.data[2];
    this.getCashAccounts();
    
    if(this.componentFrom.toLowerCase() == 'cashieringrecords'){
    }
  }

  async getCashAccounts(){
    this.cashAccounts = await firstValueFrom(this.cashAccountsService.loadCashAccounts('all'));
  }

  onChangeCashAccount(data){
    this.cashAccount  = data.CashAccount;
  }

  validateCashDrawer() {
    for (let c of this.cashReadingsToDeposit) {
      if (c.PhysicalCash == null || c.PhysicalCash === "") {
        this.notificationService.toastrWarning('PhysicalCount is empty for Reading ' + c.ReadingNo);
        return; // prevent submit
      }
      if (c.StartUpCash == null || c.StartUpCash === "") {
        this.notificationService.toastrWarning('StartUpCash is empty for Reading ' + c.ReadingNo);
        return; // prevent submit
      }
    }

    // All validations passed
    return this.onSubmit();
  }


  onSubmit(){
    if(!this.cashAccount)
        return this.notificationService.toastrWarning('Please Select Account.');

    if(this.cashReadingsToDeposit.length == 0)
      return this.notificationService.toastrWarning('No Select Records.');

    this.loading = true;
    this.cashReadingsService.depositCashReadings(this.cashAccount,this.depositStatus,  this.cashReadingsToDeposit).subscribe({
      next:(res)=>{
        this.notificationService.toastrSuccess(res.message);
        this.dialogRef.close();
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
