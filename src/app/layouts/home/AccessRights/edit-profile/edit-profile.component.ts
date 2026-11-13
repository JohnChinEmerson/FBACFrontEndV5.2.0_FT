import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
import { UserAccountsService } from 'src/app/services/User/user-accounts.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  User          : any;
  btnText       : string = "Save";
  loading       : boolean = false;
  branches                : any;
  BranchId                : string = null;
  UserForm = new FormGroup({
        id                  : new FormControl(''),
        Username            : new FormControl(''),
        UserFullName           : new FormControl(''),
  });

  constructor(
    private dialog            : MatDialog,
    private dialogRef         : MatDialogRef<EditProfileComponent>,
    private user_service      : UserAccountsService,
    private notif             : NotificationService,
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
    this.UserForm.controls['Username'].setValue(this.User.Username);
    this.UserForm.controls['UserFullName'].setValue(this.User.UserFullName);
  }
  
  onSubmit(){
      this.loading = true;
      this.user_service.updateProfile(this.UserForm.getRawValue()).subscribe({
        next:(res)=>{
          this.notif.toastrSuccess(res.message);
          this.dialogRef.close();
          this.loading = false;
        },
        error:(err)=>{
          this.notif.toastrError(err.error.message);
          this.loading = false;
        },
      });
  }

}
