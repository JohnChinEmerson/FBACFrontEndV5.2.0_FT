import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupService } from 'ag-grid-community';
import { NotificationService } from 'src/app/services/notification.service';
import { PopupsService } from 'src/app/services/Support/popups.service';

@Component({
  selector: 'app-popup-config-ui',
  templateUrl: './popup-config-ui.component.html',
  styleUrls: ['./popup-config-ui.component.css']
})
export class PopupConfigUIComponent implements OnInit {
  btnText               : string = "Save";
  popup                  : any=[];
  popups                 : any=[];
  loading               : boolean = false;
  popupForm = new FormGroup({
      id            : new FormControl(''),
      PopUp      : new FormControl(''),
      OnOrBeforeDays            : new FormControl(''),
  });

  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<PopupConfigUIComponent>,
    private popupService                 : PopupsService,
    private notif                       : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.popup = this.data[0];
      this.popups = this.data[1];
      if (this.popup) {
        this.btnText = "Update";
        this.getPopUpFormData();
      }
    }
  }

  getPopUpFormData(){
    this.popupForm.controls['id'].setValue(this.popup.id);
    this.popupForm.controls['PopUp'].setValue(this.popup.PopUp);
    this.popupForm.controls['OnOrBeforeDays'].setValue(this.popup.OnOrBeforeDays);
  }

  onSubmit(){
    this.loading = true;
    this.popupService.saveEditPopUps(this.popupForm.getRawValue(), this.btnText).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.popup);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }
  onClose(){
      this.dialogRef.close();
  }

}
