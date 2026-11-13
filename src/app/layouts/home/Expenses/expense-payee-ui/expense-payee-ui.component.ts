import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ExpensePayeesService } from 'src/app/services/Expenses/expense-payees.service';
import { BusinessStylesService } from 'src/app/services/Files/business-styles.service';
import { NotificationService } from 'src/app/services/notification.service';
import { BusinessStylesUIComponent } from '../../Files/business-styles-ui/business-styles-ui.component';

@Component({
  selector: 'app-expense-payee-ui',
  templateUrl: './expense-payee-ui.component.html',
  styleUrls: ['./expense-payee-ui.component.css']
})
export class ExpensePayeeUIComponent implements OnInit {

  btnText           : string = "Save";
  loading           : boolean = false;
  businessStyles : any=[];
  payee: any=[];
  type:string;
  payeeForm = new FormGroup({
      id            : new FormControl(''),
      PayeeId    : new FormControl('generated'),
      PayeeName  : new FormControl(''),
      ContactPerson : new FormControl('-'),
      ContactNo     : new FormControl('-'),
      Address       : new FormControl('-'),
      PayeeTIN   : new FormControl('-'),
      BusinessStyle   : new FormControl('-'),
      TermDays    : new FormControl(0),
  });

  constructor(
    private dialogRef         : MatDialogRef<ExpensePayeeUIComponent>,
    private dialog                      : MatDialog,
    private payeesService  : ExpensePayeesService,
    private businessStylesService  : BusinessStylesService,
    private notif             : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    this.getBusinessStyles();
    this.businessStylesService.requiredRefresh.subscribe(()=>{
      this.getBusinessStyles();
    });
    if (this.data) {
      this.payee = this.data[0];
      this.type     = this.data[1];
      if (this.payee) {
        this.btnText = "Update";
        this.getpayeeFormData();
      }

    }
  }

  async getBusinessStyles(){
    this.businessStyles = await firstValueFrom(this.businessStylesService.getBusinessStyles());
  }
  
  getpayeeFormData(){
    this.payeeForm.controls['id'].setValue(this.payee.id);
    this.payeeForm.controls['PayeeId'].setValue(this.payee.PayeeId);
    this.payeeForm.controls['PayeeName'].setValue(this.payee.PayeeName);
    this.payeeForm.controls['ContactPerson'].setValue(this.payee.ContactPerson);
    this.payeeForm.controls['ContactNo'].setValue(this.payee.ContactNo);
    this.payeeForm.controls['Address'].setValue(this.payee.Address);
    this.payeeForm.controls['PayeeTIN'].setValue(this.payee.PayeeTIN);
    this.payeeForm.controls['TermDays'].setValue(this.payee.TermDays);
    this.payeeForm.controls['BusinessStyle'].setValue(this.payee.BusinessStyle);
  }

  onClickBusinessStyle(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(BusinessStylesUIComponent,dialogConfig);
  }

  onSubmit(){
    this.loading = true;
    this.payeesService.saveEditPayees(this.payeeForm.getRawValue()).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        if(this.btnText == "Save")
            this.resetForm();
        else
          this.dialogRef.close();
          this.loading = false;

          if(this.type == 'expense'){
            this.dialogRef.close(res.payee);
          }
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  resetForm(){
    this.payeeForm.controls['id'].setValue('');
    this.payeeForm.controls['PayeeId'].setValue('generated');
    this.payeeForm.controls['PayeeName'].setValue('');
    this.payeeForm.controls['ContactPerson'].setValue('-');
    this.payeeForm.controls['ContactNo'].setValue('-');
    this.payeeForm.controls['Address'].setValue('-');
    this.payeeForm.controls['TermDays'].setValue('0');
  }

  onClose(){
    this.dialogRef.close();
  }

}
