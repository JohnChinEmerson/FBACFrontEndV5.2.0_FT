import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserAccountsService } from 'src/app/services/User/user-accounts.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-change-password-ui',
  templateUrl: './change-password-ui.component.html',
  styleUrls: ['./change-password-ui.component.css']
})
export class ChangePasswordUIComponent implements OnInit {

  User          : any;
  btnText       : string = "Save";
  loading       : boolean = false;
  branches                : any;
  BranchId                : string = "";
  UserForm = new FormGroup({
        id                    : new FormControl(''),
        OldPassword           : new FormControl(''),
        Password              : new FormControl(''),
        ConfirmPassword       : new FormControl(''),
  });

  constructor(
    private dialog              : MatDialog,
    private dialogRef           : MatDialogRef<ChangePasswordUIComponent>,
    private user_service        : UserAccountsService,
    private notif               : NotificationService,
    public router               : Router,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  async ngOnInit(): Promise<void> {
    this.BranchId = this.data[1];
    if (this.data[0]) {
      this.User = this.data[0];
      this.btnText = "Update";
      this.GetUserFormData();
    }
  }
  
  GetUserFormData(){
    this.UserForm.controls['id'].setValue(this.User.id);
  }
  
  validateForm(){
    var Password = this.UserForm.controls['Password'].value;
    var ConfirmPassword = this.UserForm.controls['ConfirmPassword'].value;

    if(Password != ConfirmPassword){
      return this.notif.toastrWarning('New Passwords dont match!');
    }
    this.onSubmit();
  }

  onSubmit(){
      this.loading = true;
      this.user_service.changePassword(this.UserForm.getRawValue(), this.BranchId).subscribe({
        next:(res)=>{
          this.notif.toastrSuccess(res.message);
          this.dialogRef.close();
        },
        error:(err)=>{
          this.notif.toastrError(err.error.message);
          this.loading = false;
        },
      });
  }

}
