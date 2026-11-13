import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-password-ui',
  templateUrl: './password-ui.component.html',
  styleUrls: ['./password-ui.component.css']
})
export class PasswordUIComponent implements OnInit {
passwordFormUI = new FormGroup({
      PasswordEditRemovePending: new FormControl(''),
  });
  constructor(
    private dialogRef : MatDialogRef<PasswordUIComponent>,
    private notificationService : NotificationService,
      @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.data == this.passwordFormUI.controls['PasswordEditRemovePending'].value){
      this.dialogRef.close(true);
    }else{
      return this.notificationService.toastrWarning("Invalid Password");
    }
  }

  onClose(){
    this.dialogRef.close(false);
  }

}
