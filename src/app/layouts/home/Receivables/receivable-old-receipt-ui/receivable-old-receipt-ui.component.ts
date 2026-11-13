import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PrintService } from 'src/app/services/print.service';
import { ReceivableOldReceiptsService } from 'src/app/services/Receivables/receivable-old-receipts.service';
import { ReasonsService } from 'src/app/services/StockAdjustments/reasons.service';
import { CustomerUIComponent } from '../../Files/customer-ui/customer-ui.component';
import { ReasonsUIComponent } from '../../StockAdjustments/reasons-ui/reasons-ui.component';
import { MatTableService } from 'src/app/services/mat-table.service';

@Component({
  selector: 'app-receivable-old-receipt-ui',
  templateUrl: './receivable-old-receipt-ui.component.html',
  styleUrls: ['./receivable-old-receipt-ui.component.css']
})
export class ReceivableOldReceiptUIComponent implements OnInit {

  btnText               : string = "Save";
  loading               : boolean = false;
  receivableOldReceipt: any=[];
  action:string;
  totalAmount:string;
  transCode:string;
  customers:any=[];
  reasons:any=[];
  customer:any=[];
  transNames:any=['Sales', 'Adjustment'];
  transName:any = 'sales';
  receivableOldReceiptForm = new FormGroup({
        id        : new FormControl(''),
        TransNo   : new FormControl(''),
        TransName : new FormControl(''),
        TransDate  : new FormControl(new Date()),
        DueDate  : new FormControl(new Date()),
        CustomerId     : new FormControl(''),
        CustomerName     : new FormControl(''),
        ContactNo     : new FormControl(''),
        Address     : new FormControl(''),
        CustomerTIN     : new FormControl(''),
        BusinessStyle     : new FormControl(''),
        TotalAmount     : new FormControl(''),
        Remarks: new FormControl('-'),
              
  });
  printReceipt: boolean = false;
  disablePrintReceipt: boolean = false;
  selectCheck: boolean = false;
  constructor(
    private dialogRef         : MatDialogRef<ReceivableOldReceiptUIComponent>,
    private dialog                      : MatDialog,
    private receivableOldReceiptsService  : ReceivableOldReceiptsService,
    private customersService  : CustomersService,
    private reasonsService  : ReasonsService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    private dateTimesService    : DateTimesService,
    private printService    : PrintService,
    private router    : Router,
    private matTableService : MatTableService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.receivableOldReceipt = this.data[0];
      this.action = this.data[1];
      if (this.action.toLowerCase() == 'savereceivableoldreceipttransaction' ) {
        this.btnText = "Save";
      }
      if (this.action.toLowerCase() == 'updatereceivableoldreceipt' ) {
        this.btnText = "Update";
        this.disablePrintReceipt = true;
        this.getreceivableOldReceiptForm2();
      }
    }
  }

  getreceivableOldReceiptForm2(){
    this.receivableOldReceiptForm.controls['id'].setValue(this.receivableOldReceipt.id);
    this.receivableOldReceiptForm.controls['TransNo'].setValue(this.receivableOldReceipt.TransNo);
    this.receivableOldReceiptForm.controls['TransName'].setValue(this.receivableOldReceipt.TransName);
    this.receivableOldReceiptForm.controls['CustomerId'].setValue(this.receivableOldReceipt.CustomerId);
    this.receivableOldReceiptForm.controls['CustomerName'].setValue(this.receivableOldReceipt.CustomerName);
    this.receivableOldReceiptForm.controls['ContactNo'].setValue(this.receivableOldReceipt.ContactNo);
    this.receivableOldReceiptForm.controls['Address'].setValue(this.receivableOldReceipt.Address);
    this.receivableOldReceiptForm.controls['BusinessStyle'].setValue(this.receivableOldReceipt.BusinessStyle);
    this.receivableOldReceiptForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.receivableOldReceipt.TotalAmount));
    this.receivableOldReceiptForm.controls['Remarks'].setValue(this.receivableOldReceipt.Remarks);
    this.receivableOldReceiptForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.receivableOldReceipt.TransDate));
    this.receivableOldReceiptForm.controls['DueDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.receivableOldReceipt.DueDate));
  }


  validateForm(){
    if(this.numbersService.isNotGreaterThanOrEqualToZero(this.receivableOldReceiptForm.controls['TotalAmount'].value.toString())) {
      return this.notif.toastrWarning("TotalAmount is Not Greater Than Or Equal To Zero.")
    };
    return this.onSubmit();
  }

  onSubmit(){
    this.loading = true;

    var dates = ['TransDate','DueDate'];
    dates.forEach(x => {
      if(this.receivableOldReceiptForm.controls[x].value != null)
        this.receivableOldReceiptForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.receivableOldReceiptForm.controls[x].value)));
    });

    this.receivableOldReceiptsService.saveReceivableOldReceipt(this.btnText,this.receivableOldReceiptForm.getRawValue()).subscribe({
      next:(res)=>{
        var receivableOldReceipt = res.receivableOldReceipt;

        this.notif.toastrSuccess(res.message);
        if(this.btnText.toLowerCase() == 'save'){
          if(this.printReceipt){
            this.print(receivableOldReceipt);
          }
        }
        this.dialogRef.close(res.receivableOldReceipt);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  print(receivableOldReceipt) {
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivableoldreceipt']));
    var title = 'RECEIVABLE OLD RECEIPT';
    this.printService.popupWindow(url, 'printreceivableoldreceipt', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(receivableOldReceipt));
    localStorage.setItem('Title', title);
  }
  
  onChangeTransName(event)
  {
    this.transName = event.value;
      if (this.transName.toLowerCase() == "sales")
          this.LoadCustomers("");
      else
        this.LoadReasons("");
  }
  async LoadCustomers(customerName)
  {
      this.customers = await firstValueFrom(this.customersService.getCBOCustomers());
      if (customerName != "")
          this.customer = customerName;
  }

  async LoadReasons(customerName)
  {
      this.reasons = await firstValueFrom(this.reasonsService.getCBOReasonsByAdjustmentType('stockout'));
      if (customerName != "")
        this.customer = customerName;
  }

 async onChangeCustomer(data){
    var c = await firstValueFrom(this.customersService.getCustomerByCustomerId(data.CustomerId));
    this.receivableOldReceiptForm.controls['CustomerId'].setValue(c.CustomerId);
    this.receivableOldReceiptForm.controls['ContactNo'].setValue(c.ContactNo);
    this.receivableOldReceiptForm.controls['Address'].setValue(c.Address);
    this.receivableOldReceiptForm.controls['CustomerTIN'].setValue(c.CustomerTIN);
    this.receivableOldReceiptForm.controls['BusinessStyle'].setValue(c.BusinessStyle);
  }
  async onChangeReason(data){
    var c = await firstValueFrom(this.reasonsService.getReasonByReasonId(data.ReasonId));
    this.receivableOldReceiptForm.controls['CustomerId'].setValue(c.ReasonId);
    this.receivableOldReceiptForm.controls['ContactNo'].setValue('-');
    this.receivableOldReceiptForm.controls['Address'].setValue('-');
    this.receivableOldReceiptForm.controls['CustomerTIN'].setValue('-');
    this.receivableOldReceiptForm.controls['BusinessStyle'].setValue('-');
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

   onClickNewReason(){
          if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data         = 'stockout';
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
