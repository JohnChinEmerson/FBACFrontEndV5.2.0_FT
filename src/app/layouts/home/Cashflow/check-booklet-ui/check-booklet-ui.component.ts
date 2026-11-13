import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckBookletsService } from 'src/app/services/Cashflow/check-booklets.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-check-booklet-ui',
  templateUrl: './check-booklet-ui.component.html',
  styleUrls: ['./check-booklet-ui.component.css']
})
export class CheckBookletUIComponent implements OnInit {
  btnText               : string = "Save";
  checkBooklet           : any=[];
  checkBooklets          : any=[];
  bankAccount : any=[];
  loading               : boolean = false;
  branchId:any;
  checkBookletForm = new FormGroup({
      id                : new FormControl(''),
      Prefix       : new FormControl(''),
      StartNo       : new FormControl(''),
      EndNo       : new FormControl(''),
      Issued       : new FormControl('0'),
      CashAccount       : new FormControl(''),
      
  });

  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<CheckBookletUIComponent>,
    private checkBookletsService         : CheckBookletsService,
    private notif                       : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.checkBooklet = this.data[0];
      this.checkBooklets = this.data[1];
      this.bankAccount = this.data[2];
      this.branchId = this.data[3];
      this.checkBookletForm.controls['CashAccount'].setValue(this.bankAccount.CashAccount);
      if (this.checkBooklet) {
        this.btnText = "Update";
        this.getCheckBookletFormData();
      }
    }
  }

  getCheckBookletFormData(){
    this.checkBookletForm.controls['id'].setValue(this.checkBooklet.id);
    this.checkBookletForm.controls['Prefix'].setValue(this.checkBooklet.Prefix);
    this.checkBookletForm.controls['StartNo'].setValue(this.checkBooklet.StartNo);
    this.checkBookletForm.controls['EndNo'].setValue(this.checkBooklet.EndNo);
    this.checkBookletForm.controls['Issued'].setValue(this.checkBooklet.Issued);
    this.checkBookletForm.controls['CashAccount'].setValue(this.checkBooklet.CashAccount);
    
  }

  onSubmit(){
    this.loading = true;
    this.checkBookletsService.saveEditCheckBooklets(this.checkBookletForm.getRawValue(), this.branchId).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.checkBooklets = [ res.checkBooklet,...this.checkBooklets]; 
        if(this.btnText == 'Save'){
          this.resetForm();
          this.loading = false;
        }
        else{
          this.dialogRef.close(res.checkBooklet);
          this.loading = false;
        }
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
      },
    });
  }

  resetForm(){
    this.checkBookletForm.controls['id'].setValue('');
    this.checkBookletForm.controls['Prefix'].setValue('');
    this.checkBookletForm.controls['StartNo'].setValue('');
    this.checkBookletForm.controls['EndNo'].setValue('');
    this.checkBookletForm.controls['Issued'].setValue('');
  }

  onClose(){
    this.dialogRef.close(this.checkBooklets);
  }


}
