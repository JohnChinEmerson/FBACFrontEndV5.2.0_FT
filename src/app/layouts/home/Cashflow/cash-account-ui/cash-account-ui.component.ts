import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-cash-account-ui',
  templateUrl: './cash-account-ui.component.html',
  styleUrls: ['./cash-account-ui.component.css']
})
export class CashAccountUIComponent implements OnInit {

  btnText               : string = "Save";
  cashAccountTypes      : any=['Cash In Bank', 'Cash On Hand'];
  cashAccount           : any=[];
  cashAccounts          : any=[];
  branchId               : any;
  loading               : boolean = false;
  cashAccountForm = new FormGroup({
      id                : new FormControl(''),
      CashAccount       : new FormControl(''),
      CashAccountType   : new FormControl(''),
  });

  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<CashAccountUIComponent>,
    private cashAccountsService                 : CashAccountsService,
    private notif                       : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.cashAccount = this.data[0];
      this.cashAccounts = this.data[1];
      this.branchId = this.data[2];
      if (this.cashAccount) {
        this.btnText = "Update";
        this.getItemFormData();
      }
    }
  }

  getItemFormData(){
    this.cashAccountForm.controls['id'].setValue(this.cashAccount.id);
    this.cashAccountForm.controls['CashAccount'].setValue(this.cashAccount.CashAccount);
    this.cashAccountForm.controls['CashAccountType'].setValue(this.cashAccount.CashAccountType);
  }

  onSubmit(){
    this.loading = true;
    this.cashAccountsService.saveEditCashAccounts(this.cashAccountForm.getRawValue(), this.branchId).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.cashAccounts = [ res.cashAccount,...this.cashAccounts]; 
        if(this.btnText == 'Save'){
          this.resetForm();
          this.loading = false;
        }
        else{
          this.dialogRef.close(res.cashAccount);
          this.loading = false;
        }
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
      },
    });
  }

  resetForm(){
    this.cashAccountForm.controls['id'].setValue('');
    this.cashAccountForm.controls['CashAccount'].setValue('');
  }

  onClose(){
    this.dialogRef.close(this.cashAccounts);
  }

}
