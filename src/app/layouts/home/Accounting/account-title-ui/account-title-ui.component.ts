import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { AccountTitlesService } from 'src/app/services/Accounting/account-titles.service';
import { AccountTypesService } from 'src/app/services/Accounting/account-types.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-account-title-ui',
  templateUrl: './account-title-ui.component.html',
  styleUrls: ['./account-title-ui.component.css']
})
export class AccountTitleUIComponent implements OnInit {
  btnText               : string = "Save";
  accountTypes          : any=[];
  accountTitle          : any=[];
  accountTitles: any=[];
  loading               : boolean = false;
  accountTitleForm      = new FormGroup({
      id                  : new FormControl(''),
      AccountType         : new FormControl(''),
      AccountTitle        : new FormControl(''),
  });
 
   constructor(
     private dialog                      : MatDialog,
     private dialogRef                   : MatDialogRef<AccountTitleUIComponent>,
     private accountTitlesService                 : AccountTitlesService,
     private accountTypesService        : AccountTypesService,
     private notif                       : NotificationService,
     @Inject(MAT_DIALOG_DATA) public data: any, 
   ) { }
 
   ngOnInit(): void {
     this.getAccountTypes();
     if (this.data) {
       this.accountTitle = this.data[0];
       this.accountTitles = this.data[1];
       
       
        if (this.accountTitle) {
          if (this.accountTitle.id) {
            this.btnText = "Update";
            this.getAccountTitleFormData();
          }else{
            this.btnText = "Save";
            this.getAccountTitleFormData();
          }
       }
     }
   }
 
   async getAccountTypes(){
    this.accountTypes = await firstValueFrom(this.accountTypesService.getCBOAccountTypes());
   }
  
   getAccountTitleFormData(){
     this.accountTitleForm.controls['id'].setValue(this.accountTitle.id);
     this.accountTitleForm.controls['AccountTitle'].setValue(this.accountTitle.AccountTitle);
     this.accountTitleForm.controls['AccountType'].setValue(this.accountTitle.AccountType);
    
   }
 
   onSubmit(){
     this.loading = true;
     this.accountTitlesService.saveEditAccountTitles(this.accountTitleForm.getRawValue()).subscribe({
       next:(res)=>{
         this.notif.toastrSuccess(res.message);
         if(this.btnText == 'Save'){
          this.accountTitles.push(res.accountTitle)
          this.resetForm();
         }
         else{
          this.dialogRef.close(res.accountTitle);
           this.loading = false;
         }
       },
       error:(err)=> {
         this.notif.toastrError(err.error.message);
         this.loading = false;
       },
     });
   }
 
   resetForm(){
     this.accountTitleForm.controls['id'].setValue('');
     this.accountTitleForm.controls['AccountType'].setValue('');
     this.accountTitleForm.controls['AccountTitle'].setValue('');
   }
 
   onClose(){
     this.dialogRef.close(this.accountTitles);

   }

}
