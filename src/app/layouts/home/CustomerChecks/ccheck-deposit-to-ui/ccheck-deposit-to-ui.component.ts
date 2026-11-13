import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { CustomerChecksService } from 'src/app/services/CustomerChecks/customer-checks.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';

@Component({
  selector: 'app-ccheck-deposit-to-ui',
  templateUrl: './ccheck-deposit-to-ui.component.html',
  styleUrls: ['./ccheck-deposit-to-ui.component.css']
})
export class CCheckDepositToUIComponent implements OnInit {

 customerChecksToDeposit:any=[];
   cashAccounts : any=[];
   cashAccount : string;
   componentFrom : string;
   depositStatus : string;
   btnText: string = 'Save';
   loading : boolean = false;
   constructor(
     private customerChecksService : CustomerChecksService,
     private cashAccountsService : CashAccountsService,
     private numbersService : NumbersService,
     private notificationService : NotificationService,
     private authService : AuthService,
     private dialog : MatDialog,
     private dialogRef : MatDialogRef<CCheckDepositToUIComponent>,
     private router : Router,
     @Inject(MAT_DIALOG_DATA) public data: any, 
 
   ) { }
 
   ngOnInit(): void {
     this.componentFrom = this.data[0];
     this.customerChecksToDeposit = this.data[1];
     this.depositStatus = this.data[2];
     this.getCashAccounts();
     
     if(this.componentFrom.toLowerCase() == 'customerchecks'){
     }
   }
 
   async getCashAccounts(){
     this.cashAccounts = await firstValueFrom(this.cashAccountsService.loadCashAccounts('all'));
   }
 
   onChangeCashAccount(data){
     this.cashAccount  = data.CashAccount;
   }
 
   onSubmit(){
     if(!this.cashAccount)
         return this.notificationService.toastrWarning('Please Select Account.');
 
     if(this.customerChecksToDeposit.length == 0)
       return this.notificationService.toastrWarning('No Select Records.');
 
     this.loading = true;
     this.customerChecksService.depositCustomerChecks(this.cashAccount,this.depositStatus,  this.customerChecksToDeposit).subscribe({
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
