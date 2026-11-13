import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { BanksService } from 'src/app/services/Cashflow/banks.service';
import { CustomerChecksService } from 'src/app/services/CustomerChecks/customer-checks.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { CustomerUIComponent } from '../../Files/customer-ui/customer-ui.component';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { CheckHeadersService } from 'src/app/services/CustomerChecks/check-headers.service';
import { BanksUIComponent } from '../banks-ui/banks-ui.component';

@Component({
  selector: 'app-customer-check-ui',
  templateUrl: './customer-check-ui.component.html',
  styleUrls: ['./customer-check-ui.component.css']
})
export class CustomerCheckUIComponent implements OnInit {
    btnText               : string = "Save";
    customerCheck                  : any=[];
    customerChecks                 : any=[];
    customers:any;
    checkStatus:any;
    banks:any;
    loading               : boolean = false;
    type                  : string;
    customerCheckForm = new FormGroup({
       CheckId      : new FormControl(''),
        TransDate        : new FormControl(new Date()),
        CheckDate2        : new FormControl(new Date()),
        CustomerId      : new FormControl(''),
        CustomerName      : new FormControl(''),
        BankName            : new FormControl(''),
        CheckNo      : new FormControl(''),
        Amount          : new FormControl(0),
    });
  
    constructor(
      private dialog                      : MatDialog,
      private dialogRef                   : MatDialogRef<CustomerCheckUIComponent>,
      private customerCheckService        : CustomerChecksService,
      private checkHeadersService        : CheckHeadersService,
      private customersService        : CustomersService,
      private banksService                : BanksService,
      private dateTimesService            : DateTimesService,
      private notif                       : NotificationService,
      private numbersService              : NumbersService,
      private stringHelperService : StringHelperService,
      @Inject(MAT_DIALOG_DATA) public data: any, 
    ) { }
  
    async ngOnInit(): Promise<void> {
      if (this.data) {
        this.customerCheck = this.data[0];
        this.type = this.data[1];
        this.checkStatus = this.data[2];
        this.customerChecks = this.data[3];

        await this.getCustomers();
        await this.getBanks();
        if (this.customerCheck) {
          this.btnText = "Update";
          this.getcustomerCheckFormData();
        }
      }
    }

    async getCustomers(){
      this.customers = await firstValueFrom(this.customersService.getCBOCustomers());
    this.customers.push(this.stringHelperService.withCASHCustomerCBO());
    }

    async getBanks(){
      this.banks = await firstValueFrom(this.banksService.getBanks());
    }
  
    getcustomerCheckFormData(){
      this.customerCheckForm.controls['CheckId'].setValue(this.customerCheck.CheckId);
      this.customerCheckForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.customerCheck.TransDate)));
      this.customerCheckForm.controls['CheckDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.customerCheck.CheckDate2)));
      this.customerCheckForm.controls['CustomerId'].setValue(this.customerCheck.CustomerId);
      this.customerCheckForm.controls['CustomerName'].setValue(this.customerCheck.CustomerName);
      this.customerCheckForm.controls['BankName'].setValue(this.customerCheck.BankName);
      this.customerCheckForm.controls['CheckNo'].setValue(this.customerCheck.CheckNo);
      this.customerCheckForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(this.customerCheck.Amount));
    }
    
    onClickBankName(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(BanksUIComponent,dialogConfig).beforeClosed().subscribe(x=>{
      this.getBanks();
    })
    }

    onClickCustomer(){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '600px';
      dialogConfig.data = (['','customerchecks',[]]);
      this.dialog.open(CustomerUIComponent,dialogConfig).beforeClosed().subscribe(customer => {
        if(customer){
          this.customers = [customer,...this.customers]; 
        }
      });
    }

    onChangeCustomer(data){
      this.customerCheckForm.controls['CustomerId'].setValue(data.CustomerId);
    }
  
    onSubmit(){
      var dates = ['TransDate','CheckDate2'];
      dates.forEach(x => {
        if(this.customerCheckForm.controls[x].value != null)
          this.customerCheckForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.customerCheckForm.controls[x].value)));
      });

      this.loading = true;
      this.checkHeadersService.saveEditCustomerChecks(this.customerCheckForm.getRawValue(), this.btnText).subscribe({
        next:(res)=>{
          this.notif.toastrSuccess(res.message);
          if(this.btnText == 'Save'){
            if(this.type == 'customerchecks' && this.checkStatus.toLowerCase() == 'unpaid'){
              res.customerCheck.TransName = 'CustomerChecks';
            }
            this.customerChecks = [res.customerCheck,...this.customerChecks]; 
            this.resetForm();
            this.loading = false;
            if(this.type == 'customerchecks' ){
             
              this.dialogRef.close(this.customerChecks);
            }
          }
          else{
            if(this.type == 'customerchecks' && this.checkStatus.toLowerCase() == 'unpaid'){
              res.customerCheck.TransName = 'CustomerChecks';
            }

            this.dialogRef.close(res.customerCheck);
            this.loading = false;
          }
        },
        error:(err)=> {
          this.notif.toastrError(err.error.message);
        },
      });
    }

   
    resetForm(){
      this.customerCheckForm.controls['CheckId'].setValue(null);
      this.customerCheckForm.controls['TransDate'].setValue(new Date());
      this.customerCheckForm.controls['CheckDate2'].setValue(new Date());
      this.customerCheckForm.controls['CustomerId'].setValue(null);
      this.customerCheckForm.controls['CustomerName'].setValue(null);
      this.customerCheckForm.controls['Amount'].setValue('0');
      this.customerCheckForm.controls['BankName'].setValue('');
      this.customerCheckForm.controls['CheckNo'].setValue('');
    }
  
    onClose(){
      if(this.type == 'customerchecks'){
        this.dialogRef.close(this.customerChecks);
      }else{
        this.dialogRef.close();
      }
    }

}
