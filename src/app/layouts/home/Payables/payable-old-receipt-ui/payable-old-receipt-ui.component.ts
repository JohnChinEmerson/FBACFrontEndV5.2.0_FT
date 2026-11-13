import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { ExpensePayeesService } from 'src/app/services/Expenses/expense-payees.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { SuppliersService } from 'src/app/services/Files/suppliers.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PayableOldReceiptsService } from 'src/app/services/Payables/payable-old-receipts.service';
import { PrintService } from 'src/app/services/print.service';
import { ReasonsService } from 'src/app/services/StockAdjustments/reasons.service';
import { SupplierUIComponent } from '../../Files/supplier-ui/supplier-ui.component';
import { ReasonsUIComponent } from '../../StockAdjustments/reasons-ui/reasons-ui.component';
import { CustomerUIComponent } from '../../Files/customer-ui/customer-ui.component';
import { ExpensePayeeUIComponent } from '../../Expenses/expense-payee-ui/expense-payee-ui.component';
import { MatTableService } from 'src/app/services/mat-table.service';

@Component({
  selector: 'app-payable-old-receipt-ui',
  templateUrl: './payable-old-receipt-ui.component.html',
  styleUrls: ['./payable-old-receipt-ui.component.css']
})
export class PayableOldReceiptUIComponent implements OnInit {

 btnText               : string = "Save";
  loading               : boolean = false;
  payableOldReceipt: any=[];
  action:string;
  totalAmount:string;
  transCode:string;
  customers:any=[];
  payees:any=[];
  suppliers:any=[];
  reasons:any=[];
  supplier:any=[];
  transNames:any=['Sales Return','Receiving',  'Adjustment','Expenses'];
  transName:any = 'receiving';
  payableOldReceiptForm = new FormGroup({
        id        : new FormControl(''),
        TransNo   : new FormControl(''),
        TransName : new FormControl(''),
        TransDate  : new FormControl(new Date()),
        DueDate  : new FormControl(new Date()),
        SupplierId     : new FormControl(''),
        SupplierName     : new FormControl(''),
        ContactNo     : new FormControl(''),
        Address     : new FormControl(''),
        SupplierTIN     : new FormControl(''),
        BusinessStyle     : new FormControl(''),
        TotalAmount     : new FormControl(''),
        Remarks: new FormControl('-'),
              
  });
  printReceipt: boolean = false;
  disablePrintReceipt: boolean = false;
  selectCheck: boolean = false;
  constructor(
    private dialogRef         : MatDialogRef<PayableOldReceiptUIComponent>,
    private dialog                      : MatDialog,
    private payableOldReceiptsService  : PayableOldReceiptsService,
    private suppliersService  : SuppliersService,
    private customersService  : CustomersService,
    private reasonsService  : ReasonsService,
    private expensePayeesService             : ExpensePayeesService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    private dateTimesService    : DateTimesService,
    private printService    : PrintService,
    private router    : Router,
    public matTableService  : MatTableService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.payableOldReceipt = this.data[0];
      this.action = this.data[1];
      if (this.action.toLowerCase() == 'savepayableoldreceipttransaction' ) {
        this.btnText = "Save";
      }
      if (this.action.toLowerCase() == 'updatepayableoldreceipt' ) {
        this.btnText = "Update";
        this.disablePrintReceipt = true;
        this.getpayableOldReceiptForm2();
      }
    }
  }

  getpayableOldReceiptForm2(){
    this.payableOldReceiptForm.controls['id'].setValue(this.payableOldReceipt.id);
    this.payableOldReceiptForm.controls['TransNo'].setValue(this.payableOldReceipt.TransNo);
    this.payableOldReceiptForm.controls['TransName'].setValue(this.payableOldReceipt.TransName);
    this.payableOldReceiptForm.controls['SupplierId'].setValue(this.payableOldReceipt.SupplierId);
    this.payableOldReceiptForm.controls['SupplierName'].setValue(this.payableOldReceipt.SupplierName);
    this.payableOldReceiptForm.controls['ContactNo'].setValue(this.payableOldReceipt.ContactNo);
    this.payableOldReceiptForm.controls['Address'].setValue(this.payableOldReceipt.Address);
    this.payableOldReceiptForm.controls['BusinessStyle'].setValue(this.payableOldReceipt.BusinessStyle);
    this.payableOldReceiptForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.payableOldReceipt.TotalAmount));
    this.payableOldReceiptForm.controls['Remarks'].setValue(this.payableOldReceipt.Remarks);
    this.payableOldReceiptForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.payableOldReceipt.TransDate));
    this.payableOldReceiptForm.controls['DueDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.payableOldReceipt.DueDate));
  }


  validateForm(){
    if(this.numbersService.isNotGreaterThanOrEqualToZero(this.payableOldReceiptForm.controls['TotalAmount'].value.toString())) {
      return this.notif.toastrWarning("TotalAmount is Not Greater Than Or Equal To Zero.")
    };
    return this.onSubmit();
  }

  onSubmit(){
    this.loading = true;

    var dates = ['TransDate','DueDate'];
    dates.forEach(x => {
      if(this.payableOldReceiptForm.controls[x].value != null)
        this.payableOldReceiptForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.payableOldReceiptForm.controls[x].value)));
    });

    this.payableOldReceiptsService.savePayableOldReceipt(this.btnText,this.payableOldReceiptForm.getRawValue()).subscribe({
      next:(res)=>{
        var payableOldReceipt = res.payableOldReceipt;

        this.notif.toastrSuccess(res.message);
        if(this.btnText.toLowerCase() == 'save'){
          if(this.printReceipt){
            this.print(payableOldReceipt);
          }
        }
        this.dialogRef.close(res.payableOldReceipt);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  print(payableOldReceipt) {
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpayableoldreceipt']));
    var title = 'RECEIVABLE OLD RECEIPT';
    this.printService.popupWindow(url, 'printpayableoldreceipt', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(payableOldReceipt));
    localStorage.setItem('Title', title);
  }
  
  onChangeTransName(event)
  {
    this.transName = event.value;
      if (this.transName.toLowerCase() == "sales return")
          this.LoadCustomers("");
      else if (this.transName.toLowerCase() == "receiving")
        this.LoadSuppliers("");
      else if (this.transName.toLowerCase() == "expenses")
        this.LoadPayee("");
      else
        this.LoadReasons("");
  }
  async LoadCustomers(supplierName)
  {
      this.customers = await firstValueFrom(this.customersService.getCBOCustomers());
      if (supplierName != "")
          this.supplier = supplierName;
  }
  async LoadSuppliers(supplierName)
  {
      this.suppliers = await firstValueFrom(this.suppliersService.getCBOSuppliers());
      if (supplierName != "")
          this.supplier = supplierName;
  }
  async LoadPayee(supplierName){
    this.payees = await firstValueFrom(this.expensePayeesService.getCBOPayees());
    if (supplierName != "")
        this.supplier = supplierName;
  }
  async LoadReasons(supplierName)
  {
      this.reasons = await firstValueFrom(this.reasonsService.getCBOReasonsByAdjustmentType('stockin'));
      if (supplierName != "")
        this.supplier = supplierName;
  }
  async onChangeCustomer(data){
    var c = await firstValueFrom(this.customersService.getCustomerByCustomerId(data.CustomerId));
    this.payableOldReceiptForm.controls['SupplierId'].setValue(c.CustomerId);
    this.payableOldReceiptForm.controls['ContactNo'].setValue(c.ContactNo);
    this.payableOldReceiptForm.controls['Address'].setValue(c.Address);
    this.payableOldReceiptForm.controls['SupplierTIN'].setValue(c.CustomerTIN);
    this.payableOldReceiptForm.controls['BusinessStyle'].setValue(c.BusinessStyle);
  }
  async onChangePayee(data){
    var c = await firstValueFrom(this.expensePayeesService.getPayeeByPayeeId(data.PayeeId));
    this.payableOldReceiptForm.controls['SupplierId'].setValue(c.PayeeId);
    this.payableOldReceiptForm.controls['ContactNo'].setValue(c.ContactNo);
    this.payableOldReceiptForm.controls['Address'].setValue(c.Address);
    this.payableOldReceiptForm.controls['SupplierTIN'].setValue(c.PayeeTIN);
    this.payableOldReceiptForm.controls['BusinessStyle'].setValue(c.BusinessStyle);
  }
 async onChangeSupplier(data){
    var c = await firstValueFrom(this.suppliersService.getSupplierBySupplierId(data.SupplierId));
    this.payableOldReceiptForm.controls['SupplierId'].setValue(c.SupplierId);
    this.payableOldReceiptForm.controls['ContactNo'].setValue(c.ContactNo);
    this.payableOldReceiptForm.controls['Address'].setValue(c.Address);
    this.payableOldReceiptForm.controls['SupplierTIN'].setValue(c.SupplierTIN);
    this.payableOldReceiptForm.controls['BusinessStyle'].setValue(c.BusinessStyle);
  }
  async onChangeReason(data){
    var c = await firstValueFrom(this.reasonsService.getReasonByReasonId(data.ReasonId));
    this.payableOldReceiptForm.controls['SupplierId'].setValue(c.ReasonId);
    this.payableOldReceiptForm.controls['ContactNo'].setValue('-');
    this.payableOldReceiptForm.controls['Address'].setValue('-');
    this.payableOldReceiptForm.controls['SupplierTIN'].setValue('-');
    this.payableOldReceiptForm.controls['BusinessStyle'].setValue('-');
  }

  onClickNewSupplier(){
    if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['','sales',[]]);
    this.dialog.open(SupplierUIComponent,dialogConfig).beforeClosed().subscribe(supplier => {
      if(supplier){
        this.suppliers = [supplier,...this.suppliers]; 
      }
    });
  }
  onClickNewCustomer(){
      if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['','sales',[]]);
    this.dialog.open(CustomerUIComponent,dialogConfig).beforeClosed().subscribe(customer => {
      if(customer){
        this.customers = [customer,...this.customers]; 
      }
    });
  }
  
  onClickNewPayee(){
    if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['','expense']);
    this.dialog.open(ExpensePayeeUIComponent,dialogConfig).beforeClosed().subscribe(payee => {
      if(payee){
        this.payees = [payee,...this.payees]; 
      }
    });
  }
   onClickNewReason(){
         if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data         = 'stockin';
    this.dialog.open(ReasonsUIComponent,dialogConfig).beforeClosed().subscribe(reasons => {
      if(reasons){
        this.reasons = reasons; 
      }
    });
  }

  onClose(){
    this.dialogRef.close();
  }

  onChangePrintReceipt(value){
    this.printReceipt = value;
   }

}
