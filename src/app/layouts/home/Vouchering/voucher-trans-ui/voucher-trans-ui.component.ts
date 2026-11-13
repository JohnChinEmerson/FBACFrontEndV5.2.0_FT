import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { VoucherTransService } from 'src/app/services/Vouchering/voucher-trans.service';
import { EmployeesUIComponent } from '../../Files/employees-ui/employees-ui.component';
import { EmployeesService } from 'src/app/services/Files/employees.service';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';
import { MatTableService } from 'src/app/services/mat-table.service';

@Component({
  selector: 'app-voucher-trans-ui',
  templateUrl: './voucher-trans-ui.component.html',
  styleUrls: ['./voucher-trans-ui.component.css']
})
export class VoucherTransUIComponent implements OnInit {
  btnText                   : string = "Save";
  voucherRequest     : any=[];
  voucherHeader      : any=[];
  employees          : any=[];
  action              : string;
  paymentTypes: any=[];
  loading                   : boolean = false;
  voucherTransForm                = new FormGroup({
        TransNo             : new FormControl('NA'),
        TransName           : new FormControl('Petty Cash'),
        VoucherDate         : new FormControl(new Date()),
        InvNo               : new FormControl('-'),
        PayToId             : new FormControl('CASH'),
        PayToName           : new FormControl('CASH'),
        PaymentType         : new FormControl('CASH'),
        Amount              : new FormControl('0'),
        Description         : new FormControl('-'),
        RequestedBy         : new FormControl('NA'),
        RequestedById: new FormControl('NA'),
        VoucherType: new FormControl(),
        TableName: new FormControl(),
        
  });
  txtSourceTransNoDisabled: boolean = false;
  cboPaymentTypeDisabled: boolean = false;
  cboPayToNameDisabled: boolean = false;
  printReceipt: boolean = false;
  disablePrintReceipt: boolean = false;

  constructor(
    private dialog              : MatDialog,
    private dialogRef              : MatDialogRef<VoucherTransUIComponent>,
    private voucherTransService : VoucherTransService,
    private employeesService    : EmployeesService,
    private notif               : NotificationService,
    private numbersService      : NumbersService,
    private router      : Router,
    private printService : PrintService,
    private dateTimesService    : DateTimesService,
    private cashAccountsService : CashAccountsService,
    private matTableService     : MatTableService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  async ngOnInit(): Promise<void> {
    this.voucherRequest = this.data[0];
    this.voucherHeader = this.data[1];
    this.action = this.data[2];
    
    this.getPaymentType('Cash');
    this.getEmployees();
    this.GetvoucherTransFormData();

    if(this.action == 'updatevoucherfromrecords'){
      this.btnText = 'Update';
      this.ToggleSourceTransaction(this.voucherRequest.EditableTransNo.toLowerCase() == "no");
      this.GetvoucherTransFormData2();
    }
  }
  async getPaymentType(customerId){
    this.paymentTypes = await firstValueFrom(this.cashAccountsService.setPaymentTypes(customerId, false));
  }
  async getEmployees(){
    this.employees = await firstValueFrom(this.employeesService.getEmployees());
    var a:any = {
      EmpId:'NA',
      EmpName:'NA',
    }
    this.employees.push(a);
  }

  GetvoucherTransFormData(){
    this.voucherTransForm.controls['TransNo'].setValue(this.voucherRequest.TransNo);
    this.voucherTransForm.controls['VoucherType'].setValue(this.voucherRequest.VoucherType);
    this.voucherTransForm.controls['TableName'].setValue(this.voucherRequest.TableName);
    this.voucherTransForm.controls['TransName'].setValue(this.voucherRequest.TransName);
    this.voucherTransForm.controls['VoucherDate'].setValue(new Date());
    this.voucherTransForm.controls['PayToId'].setValue(this.voucherRequest.PayToId);
    this.voucherTransForm.controls['PayToName'].setValue(this.voucherRequest.PayToName);
    this.voucherTransForm.controls['PaymentType'].setValue(this.voucherRequest.PaymentType);
    this.voucherTransForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(this.voucherRequest.Amount));
    
    this.voucherTransForm.controls['PayToName'].disable();
    this.voucherTransForm.controls['TransNo'].disable();

    if(this.voucherRequest.TransName.toLowerCase() != 'petty cash'){
      this.voucherTransForm.controls['InvNo'].enable();
    }
    else{
      this.voucherTransForm.controls['InvNo'].disable();
    }

    if(this.voucherRequest.TransName.toLowerCase() == 'purchasing' || this.voucherRequest.TransName.toLowerCase() == 'petty cash'){
      this.voucherTransForm.controls['Amount'].enable();
    }
    else{
      this.voucherTransForm.controls['Amount'].disable();
    }
  }

  GetvoucherTransFormData2(){
     this.voucherTransForm.controls['TransNo'].setValue(this.voucherHeader.TransNo);
    this.voucherTransForm.controls['VoucherType'].setValue(this.voucherHeader.VoucherType);
    this.voucherTransForm.controls['TableName'].setValue(this.voucherHeader.TableName);
    this.voucherTransForm.controls['TransName'].setValue(this.voucherHeader.TransName);
    this.voucherTransForm.controls['VoucherDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.voucherHeader.VoucherDate)));
    this.voucherTransForm.controls['PayToId'].setValue(this.voucherHeader.PayToId);
    this.voucherTransForm.controls['PayToName'].setValue(this.voucherHeader.PayToName);
    this.voucherTransForm.controls['PaymentType'].setValue(this.voucherHeader.PaymentType);
    this.voucherTransForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(this.voucherHeader.Amount));
    this.voucherTransForm.controls['Description'].setValue(this.voucherHeader.Description);
    this.voucherTransForm.controls['RequestedBy'].setValue(this.voucherHeader.RequestedBy);
    this.voucherTransForm.controls['RequestedById'].setValue(this.voucherHeader.RequestedById);
    this.voucherTransForm.controls['InvNo'].setValue(this.voucherHeader.InvNo);
    
    this.voucherTransForm.controls['PayToName'].disable();
    this.voucherTransForm.controls['TransNo'].disable();

    if(this.voucherRequest.TransName.toLowerCase() != 'petty cash'){
      this.voucherTransForm.controls['InvNo'].enable();
    }
    else{
      this.voucherTransForm.controls['InvNo'].disable();
    }

    if(this.voucherRequest.TransName.toLowerCase() == 'purchasing' || this.voucherRequest.TransName.toLowerCase() == 'petty cash'){
      this.voucherTransForm.controls['Amount'].enable();
    }
    else{
      this.voucherTransForm.controls['Amount'].disable();
    }
  }

 ToggleSourceTransaction(value)
  {
    if(value){
      this.voucherTransForm.controls['PayToName'].disable();
      this.voucherTransForm.controls['PaymentType'].disable();
      this.voucherTransForm.controls['TransNo'].disable();
    }
    else{
      this.voucherTransForm.controls['PayToName'].enable();
      this.voucherTransForm.controls['PaymentType'].enable();
      this.voucherTransForm.controls['TransNo'].enable();
    }
  }

  onChangeRequestedById(data){
    this.voucherTransForm.controls['RequestedBy'].setValue(data.EmpName);
  }

  onClickEmployees(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(EmployeesUIComponent,dialogConfig).beforeClosed().subscribe(x=>{
      this.getEmployees();
    })
  }

  onSubmit(){
    if (!this.matTableService.CommonTransaction()) {
      return;
    }
    this.loading = true;
    var dates = ['VoucherDate'];
    dates.forEach(x => {
      if(this.voucherTransForm.controls[x].value != null)
        this.voucherTransForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.voucherTransForm.controls[x].value)));
    });

    var data:any = {
      'receipt' : this.voucherRequest,
      'request' : this.voucherTransForm.getRawValue(),
    }
    this.voucherTransService.saveEditVoucherTrans(data, this.action).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
         if(this.action == 'generatepettycashvoucher'){
          this.ngOnInit();
          if(this.printReceipt){
            this.print(res.voucherHeader);
          }
         }
          else if(this.action == 'generatevoucherfromrequest' || this.action == 'updatevoucherfromrecords'){
          this.dialogRef.close(res.voucherHeader);
          if(this.printReceipt){
            this.print(res.voucherHeader);
          }
        }
        else if(this.action == 'updatevoucherfromrecords'){
          this.dialogRef.close(res.voucherHeader);
        }else{
          this.ngOnInit();
        }
        this.loading = false;
      },
      error:(err)=>{
        this.notif.toastrError(err.error);
        this.loading = false;
      },
    })
  }

  print(voucherHeader) {
    
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printvoucherreceipt']));
    var title = 'VOUCHER RECEIPT OF  - ' + voucherHeader.VoucherNo ;
    
    this.printService.popupWindow(url, 'printvoucherreceipt', window, 800, 800);
    localStorage.setItem('Voucher', JSON.stringify(voucherHeader));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', voucherHeader.VoucherNo);
  }
  

  onClose(){
    this.dialogRef.close();
  }
  onChangePrintReceipt(value){
    this.printReceipt = value;
   }
   onClickSignatures(){
    if(this.btnText.toLowerCase() == 'update'){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([this.voucherRequest.VoucherNo, 'VoucherHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([null, 'VoucherHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }
  }

}
