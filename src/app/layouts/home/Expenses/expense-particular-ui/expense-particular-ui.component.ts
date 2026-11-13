import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { AccountTitlesService } from 'src/app/services/Accounting/account-titles.service';
import { ExpenseParticularsService } from 'src/app/services/Expenses/expense-particulars.service';
import { VATTypesService } from 'src/app/services/Files/vattypes.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AccountTitleUIComponent } from '../../Accounting/account-title-ui/account-title-ui.component';

@Component({
  selector: 'app-expense-particular-ui',
  templateUrl: './expense-particular-ui.component.html',
  styleUrls: ['./expense-particular-ui.component.css']
})
export class ExpenseParticularUIComponent implements OnInit {

  btnText               : string = "Save";
  categorys             : any=[];
  particular            : any;
  btnTextToEdit         : boolean = false;
  loading               : boolean = false;
  type                  : string;
  particularForm = new FormGroup({
      id            : new FormControl(''),
      ParticularId        : new FormControl('generated'),
      ParticularName      : new FormControl(''),
      Category      : new FormControl(''),
      CategoryId      : new FormControl(''),
      Amount          : new FormControl(0),
    
  });

  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<ExpenseParticularUIComponent>,
    private particularService                 : ExpenseParticularsService,
    private accountTitlesService        : AccountTitlesService,
    private vATTypesService            : VATTypesService,
    private notif                       : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    this.getCategory();
    this.accountTitlesService.requiredRefresh.subscribe(()=>{
      this.getCategory();
    });
  
    if (this.data) {
      this.particular = this.data[0];
      this.type = this.data[1];
      if (this.particular) {
        this.btnText = "Update";
        this.getParticularFormData();
      }
    }
  }

  async getCategory(){
    this.categorys      = await firstValueFrom(this.accountTitlesService.getAccountTitlesByAccountType('expense'));
    this.categorys  = this.categorys.filter(x => x.AccountTitle.toLowerCase()  != 'operating expenses');
  }


  getParticularFormData(){
    this.particularForm.controls['id'].setValue(this.particular.id);
    this.particularForm.controls['ParticularId'].setValue(this.particular.ParticularId);
    this.particularForm.controls['ParticularName'].setValue(this.particular.ParticularName);
    this.particularForm.controls['Category'].setValue(this.particular.Category);
    this.particularForm.controls['CategoryId'].setValue(this.particular.CategoryId);
    this.particularForm.controls['Amount'].setValue(this.particular.Amount);
  }

  onSubmit(){
    this.loading = true;
    this.particularService.saveEditParticulars(this.particularForm.getRawValue()).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        if(this.btnText == 'Save'){
          if(this.btnTextToEdit){
            this.particularForm.controls['ParticularId'].disable();
            this.particularForm.controls['ParticularId'].setValue('generated');
          }
          else{
            this.resetForm();
          }
          this.loading = false;
          if(this.type == 'expense' ){
            this.dialogRef.close(res.particular);
          }
        }
        else{
          this.dialogRef.close();
          this.loading = false;
        }
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
      },
    });
  }

  onChangeCategory(data){
    this.particularForm.controls['CategoryId'].setValue(data.AccountCode);
    this.particularForm.controls['Category'].setValue(data.AccountTitle);
  }

  onClickCategory(){
      var accountTitle:any = {
        id : null, 
        AccountType : 'Expense',
        AccountTitle : null,
      };
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '600px';
      dialogConfig.data = ([accountTitle,this.categorys]);
      this.dialog.open(AccountTitleUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        this.getCategory();
      });
  }

  resetForm(){
    this.particularForm.controls['id'].setValue('');
    this.particularForm.controls['ParticularId'].setValue('generated');
    this.particularForm.controls['ParticularName'].setValue('');
    this.particularForm.controls['Category'].setValue('');
    this.particularForm.controls['CategoryId'].setValue('');
    this.particularForm.controls['Amount'].setValue('0');
  }

  onClose(){
    this.dialogRef.close();
  }

}
