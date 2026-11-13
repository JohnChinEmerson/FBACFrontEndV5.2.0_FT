import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { SupplierCheckHeadersService } from 'src/app/services/SupplierChecks/supplier-check-headers.service';
import { SupplierChecksService } from 'src/app/services/SupplierChecks/supplier-checks.service';
import { SuppliersComponent } from '../../Files/suppliers/suppliers.component';
import { SuppliersService } from 'src/app/services/Files/suppliers.service';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { SupplierUIComponent } from '../../Files/supplier-ui/supplier-ui.component';
import { PayableStatementsService } from 'src/app/services/Payables/payable-statements.service';

@Component({
  selector: 'app-supplier-check-ui',
  templateUrl: './supplier-check-ui.component.html',
  styleUrls: ['./supplier-check-ui.component.css']
})
export class SupplierCheckUIComponent implements OnInit {
     btnText               : string = "Save";
    cashAccounts:any=[];
     supplierCheck                  : any=[];
     supplierChecks                 : any=[];
     suppliers:any;
     checkStatus:any;
     banks:any;
     loading               : boolean = false;
     type                  : string;
     supplierCheckForm = new FormGroup({
        SupplierCheckId      : new FormControl(''),
         TransDate        : new FormControl(new Date()),
         CheckDate2        : new FormControl(new Date()),
         SupplierId      : new FormControl(''),
         SupplierName      : new FormControl(''),
         CashAccount     : new FormControl(''),
         CashAccountType : new FormControl(''),
         CheckNo      : new FormControl(''),
         Amount          : new FormControl(0),
     });
   
     constructor(
       private dialog                      : MatDialog,
       private dialogRef                   : MatDialogRef<SupplierCheckUIComponent>,
       private supplierCheckService        : SupplierChecksService,
       private supplierCheckHeadersService  : SupplierCheckHeadersService,
       private supplierService             : SuppliersService,
      //  private banksService                : BanksService,
       private dateTimesService            : DateTimesService,
       private notif                       : NotificationService,
       private numbersService              : NumbersService,
       private stringHelperService : StringHelperService,
       private cashAccountsService    : CashAccountsService,
       private payableStatementsService: PayableStatementsService,
       @Inject(MAT_DIALOG_DATA) public data: any, 
     ) { }
   
     async ngOnInit(): Promise<void> {
       if (this.data) {
         this.supplierCheck = this.data[0];
         this.type = this.data[1];
         this.checkStatus = this.data[2];
         this.supplierChecks = this.data[3];
 
         await this.getSuppliers();
         await this.getcashAccounts();
         if (this.supplierCheck) {
           this.btnText = "Update";
           this.getsupplierCheckFormData();
         }
       }
     }
 
    //  async getSuppliers(){
    //  this.suppliers = await firstValueFrom(this.supplierService.getCBOSuppliers());
    //  this.suppliers.push(this.stringHelperService.withCASHSupplierCBO());
    //  }
  async getSuppliers(){
    const supplierMaster = await firstValueFrom(this.supplierService.getCBOSuppliers());
    const payableSuppliers = await firstValueFrom(this.payableStatementsService.loadSupplierWithAllWithBalance(false, false));
    this.suppliers = [...supplierMaster,...payableSuppliers].filter((supplier, index, self) =>
      index === self.findIndex(x =>x.SupplierId === supplier.SupplierId));
}
 
     async getcashAccounts() {
     this.cashAccounts = await firstValueFrom(this.cashAccountsService.loadCashAccounts('Check'));
     console.log('test',this.cashAccounts);
    }
    onChangeCashAccount(cashAccount: string) {
        const selected = this.cashAccounts.find( x => x.CashAccount === cashAccount);
        if (selected) {
            this.supplierCheckForm.controls['CashAccountType'].setValue(selected.CashAccountType);
        } else {
            this.supplierCheckForm.controls['CashAccountType'].setValue('');
        }
    }

     getsupplierCheckFormData(){
       this.supplierCheckForm.controls['SupplierCheckId'].setValue(this.supplierCheck.SupplierCheckId);
       this.supplierCheckForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.supplierCheck.TransDate)));
       this.supplierCheckForm.controls['CheckDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.supplierCheck.CheckDate2)));
       this.supplierCheckForm.controls['SupplierId'].setValue(this.supplierCheck.SupplierId);
       this.supplierCheckForm.controls['SupplierName'].setValue(this.supplierCheck.SupplierName);
       this.supplierCheckForm.controls['CashAccount'].setValue(this.supplierCheck.CashAccount);
       this.supplierCheckForm.controls['CashAccountType'].setValue(this.supplierCheck.CashAccountType);
       this.supplierCheckForm.controls['CheckNo'].setValue(this.supplierCheck.CheckNo);
       this.supplierCheckForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(this.supplierCheck.Amount));
     }
     
 
     onClickSupplier(){
       const dialogConfig        = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus    = true;
       dialogConfig.width        = '600px';
       dialogConfig.data = (['','supplierchecks',[]]);
       this.dialog.open(SupplierUIComponent,dialogConfig).beforeClosed().subscribe(supplier => {
         if(supplier){
           this.suppliers = [supplier,...this.suppliers]; 
         }
       });
     }
 
     onChangeSupplier(data){
       this.supplierCheckForm.controls['SupplierId'].setValue(data.SupplierId);
     }
   
     onSubmit(){
       var dates = ['TransDate','CheckDate2'];
       dates.forEach(x => {
         if(this.supplierCheckForm.controls[x].value != null)
           this.supplierCheckForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.supplierCheckForm.controls[x].value)));
       });
 
       this.loading = true;
       this.supplierCheckHeadersService.saveEditSupplierChecks(this.supplierCheckForm.getRawValue(), this.btnText).subscribe({
         next:(res)=>{
           this.notif.toastrSuccess(res.message);
           if(this.btnText == 'Save'){
             if(this.type == 'supplierchecks' && this.checkStatus.toLowerCase() == 'unreleased'){
               res.supplierCheck.TransName = 'SupplierChecks';
             }
             this.supplierChecks = [res.supplierCheck,...this.supplierChecks]; 

             this.resetForm();
             this.loading = false;
             if(this.type == 'supplierchecks'){
               this.dialogRef.close(this.supplierChecks);
             }
           }
           else{
             if(this.type == 'supplierchecks' && this.checkStatus.toLowerCase() == 'unreleased'){
               res.supplierCheck.TransName = 'SupplierChecks';
             }
 
             this.dialogRef.close(res.supplierCheck);
             this.loading = false;
           }
         },
         error:(err)=> {
           this.notif.toastrError(err.error.message);
         },
       });
     }
 
    
    resetForm(){
      this.supplierCheckForm.controls['SupplierCheckId'].setValue(null);
      this.supplierCheckForm.controls['TransDate'].setValue(new Date());
      this.supplierCheckForm.controls['CheckDate2'].setValue(new Date());
      this.supplierCheckForm.controls['SupplierId'].setValue(null);
      this.supplierCheckForm.controls['SupplierName'].setValue(null);
      this.supplierCheckForm.controls['Amount'].setValue('0');
      this.supplierCheckForm.controls['CashAccount'].setValue('');
      this.supplierCheckForm.controls['CashAccountType'].setValue('');
      this.supplierCheckForm.controls['CheckNo'].setValue('');
    }
   
     onClose(){
       if(this.type == 'supplierchecks'){
         this.dialogRef.close(this.supplierChecks);
       }else{
         this.dialogRef.close();
       }
     }
 
 }
 