import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { DisbursementHeadersService } from 'src/app/services/Disbursements/disbursement-headers.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PrintService } from 'src/app/services/print.service';
import { StockAdjustmentDetailsService } from 'src/app/services/StockAdjustments/stock-adjustment-details.service';
import { StockAdjustmentHeadersService } from 'src/app/services/StockAdjustments/stock-adjustment-headers.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { TaxHelperService } from 'src/app/services/tax-helper.service';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';
import { fitHeaderDialogToPhone } from '../../../shared/transaction-header/transaction-header';

@Component({
  selector: 'app-stock-adjustment-header-ui',
  templateUrl: './stock-adjustment-header-ui.component.html',
  styleUrls: ['../../../shared/transaction-header/transaction-header.css']
})
export class StockAdjustmentHeaderUIComponent implements OnInit {

  btnText : string = "Save";
   loading : boolean = false;
   stockAdjustmentHeader: any=[];
   reportAs: any=[];
   action:string;
   totalAmount:string;
   transCode:string;
   recordStatus:string;
   reason:any=[];
   branches:any=[];
   branchId:any;
   stockAdjustmentConfig:any=[];
   stockAdjustmentHeaderForm = new FormGroup({
        id          : new FormControl(''),
        TransNo     : new FormControl(''),
        TransCode   : new FormControl(''),
        TransDate   : new FormControl(new Date()),
        ReasonId       : new FormControl(''),
        ReasonName     : new FormControl(''),
        TotalAmount    : new FormControl(''),
        TermDays       : new FormControl(''),
        Notes          : new FormControl('-'),
        AdjustmentType : new FormControl(''),
        ReportAs       : new FormControl(''),
        ReferenceNo    : new FormControl('-'),
        ToBranchId      : new FormControl('NA'),
        ToBranchName    : new FormControl('NA'),
        FromBranchId      : new FormControl('NA'),
        FromBranchName    : new FormControl('NA'),
        FromBranchReceiptNo    : new FormControl('NA'),
   });
   printReceipt: boolean = false;
   disablePrintReceipt: boolean = false;
   TermDaysReadOnly: boolean = false;
   adjustmentType : string;
   constructor(
     private dialogRef         : MatDialogRef<StockAdjustmentHeaderUIComponent>,
     private dialog                      : MatDialog,
     private stockAdjustmentHeadersService  : StockAdjustmentHeadersService,
     private branchesService  : BranchesService,
     private notif             : NotificationService,
     private numbersService    : NumbersService,
     private dateTimesService    : DateTimesService,
     private stringHelperService    : StringHelperService,
     private printService    : PrintService,
     private router    : Router,
     @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
 
   ) { }
 
   // phones: the less used fields are folded until MORE DETAILS
   showMore: boolean = false;

   async ngOnInit(): Promise<void> {
     // phones: the dialog takes the whole screen
     fitHeaderDialogToPhone(this.dialogRef);
     if (this.data) {
       this.reason = this.data[0];
       this.stockAdjustmentHeader = this.data[1];
       this.transCode = this.data[2];
       this.totalAmount = this.data[3];
       this.adjustmentType = this.data[4];
       this.recordStatus = this.data[5];
       this.action = this.data[6];
       await this.getCBOBranches();
       this.getReportAs();
       this.getstockAdjustmentHeaderFormDefault();

       if (this.action.toLowerCase() == 'savestockadjustmenttransaction' ) {
         this.btnText = "Save";
         this.getstockAdjustmentHeaderForm1();
       }
       if (this.action.toLowerCase() == 'updatestockadjustmentheader' ) {
         this.btnText = "Update";
         this.getstockAdjustmentHeaderForm2();
       }
       this.getstockAdjustmentHeaderBranchInfo();

     }
   }

   async getCBOBranches(){
    this.branches = await firstValueFrom(this.branchesService.getBranchesCBOExcept());
  }

   getReportAs(){
    if(this.adjustmentType.toLowerCase() == 'stockin'){
      this.reportAs = ['Adjustment', 'Payable'];
    }else{
      this.reportAs = ['Adjustment', 'Expense', 'Receivable'];
    }
   }
 
   getstockAdjustmentHeaderFormDefault(){
     this.stockAdjustmentHeaderForm.controls['AdjustmentType'].setValue(this.adjustmentType);
     this.stockAdjustmentHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert2Decimal(0));
     this.stockAdjustmentHeaderForm.controls['ReportAs'].setValue(this.reportAs[0]);
     this.ToggleTerms(this.reportAs[0].toLowerCase() == 'payable' || this.reportAs[0].toLowerCase() == 'receivable')
   }
 
   async getstockAdjustmentHeaderForm1(){
     this.stockAdjustmentHeaderForm.controls['TransCode'].setValue(this.transCode);
     this.stockAdjustmentHeaderForm.controls['ReasonId'].setValue(this.reason.ReasonId);
     this.stockAdjustmentHeaderForm.controls['ReasonName'].setValue(this.reason.ReasonName);
     this.stockAdjustmentHeaderForm.controls['AdjustmentType'].setValue(this.reason.AdjustmentType);
     this.stockAdjustmentHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.totalAmount));
   }
 
   async getstockAdjustmentHeaderForm2(){
       this.printReceipt = false;
       this.disablePrintReceipt = true;
       this.displayStockAdjustmentHeaderValues();
   }
 
   displayStockAdjustmentHeaderValues(){
     this.stockAdjustmentHeaderForm.controls['id'].setValue(this.stockAdjustmentHeader.id);
     this.stockAdjustmentHeaderForm.controls['TransNo'].setValue(this.stockAdjustmentHeader.TransNo);
     this.stockAdjustmentHeaderForm.controls['TransCode'].setValue(this.stockAdjustmentHeader.TransCode);
     this.stockAdjustmentHeaderForm.controls['ReasonId'].setValue(this.stockAdjustmentHeader.ReasonId);
     this.stockAdjustmentHeaderForm.controls['ReasonName'].setValue(this.stockAdjustmentHeader.ReasonName);
     this.stockAdjustmentHeaderForm.controls['AdjustmentType'].setValue(this.stockAdjustmentHeader.AdjustmentType);
     this.stockAdjustmentHeaderForm.controls['ReferenceNo'].setValue(this.stockAdjustmentHeader.ReferenceNo);
     this.stockAdjustmentHeaderForm.controls['ReportAs'].setValue(this.stockAdjustmentHeader.ReportAs);
     this.stockAdjustmentHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(this.stockAdjustmentHeader.TermDays));
     this.stockAdjustmentHeaderForm.controls['TotalAmount'].setValue(this.numbersService.Convert2Decimal(this.stockAdjustmentHeader.TotalAmount));
     this.stockAdjustmentHeaderForm.controls['Notes'].setValue(this.stockAdjustmentHeader.Notes);
     this.stockAdjustmentHeaderForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(this.stockAdjustmentHeader.TransDate));
     this.stockAdjustmentHeaderForm.controls['ToBranchId'].setValue(this.stockAdjustmentHeader.ToBranchId);
     this.stockAdjustmentHeaderForm.controls['ToBranchName'].setValue(this.stockAdjustmentHeader.ToBranchName);
     this.stockAdjustmentHeaderForm.controls['FromBranchId'].setValue(this.stockAdjustmentHeader.FromBranchId);
     this.stockAdjustmentHeaderForm.controls['FromBranchName'].setValue(this.stockAdjustmentHeader.FromBranchName);
     this.stockAdjustmentHeaderForm.controls['FromBranchReceiptNo'].setValue(this.stockAdjustmentHeader.FromBranchReceiptNo);
   }

   getstockAdjustmentHeaderBranchInfo(){
    if(this.adjustmentType.toLowerCase() == 'stockin' && this.stockAdjustmentHeader.FromBranchId.toLowerCase() != 'na'){
      this.stockAdjustmentHeaderForm.controls['ReportAs'].setValue(this.stockAdjustmentHeader.ReportAs);
      this.stockAdjustmentHeaderForm.controls['FromBranchId'].setValue(this.stockAdjustmentHeader.FromBranchId);
      this.stockAdjustmentHeaderForm.controls['FromBranchName'].setValue(this.stockAdjustmentHeader.FromBranchName);
      this.stockAdjustmentHeaderForm.controls['FromBranchReceiptNo'].setValue(this.stockAdjustmentHeader.FromBranchReceiptNo);

      this.stockAdjustmentHeaderForm.controls['ReportAs'].disable();
      this.stockAdjustmentHeaderForm.controls['FromBranchId'].disable();
      this.stockAdjustmentHeaderForm.controls['FromBranchName'].disable();
     }
     
     if(this.adjustmentType.toLowerCase() == "stockout" && this.stockAdjustmentHeader.ToBranchId.toLowerCase() != 'na' && this.stockAdjustmentHeader.LoadStatus.toLowerCase() != 'na'  ){
      this.stockAdjustmentHeaderForm.controls['ReportAs'].setValue(this.stockAdjustmentHeader.ReportAs);
      this.stockAdjustmentHeaderForm.controls['ToBranchId'].setValue(this.stockAdjustmentHeader.ToBranchId);
      this.stockAdjustmentHeaderForm.controls['ToBranchName'].setValue(this.stockAdjustmentHeader.ToBranchName);

      this.stockAdjustmentHeaderForm.controls['ReportAs'].disable();
      this.stockAdjustmentHeaderForm.controls['ToBranchId'].disable();
      this.stockAdjustmentHeaderForm.controls['ToBranchName'].disable();
     }
   }

   onChangeBranchName(data){
    if(this.adjustmentType == 'stockout')
      this.stockAdjustmentHeaderForm.controls['ToBranchId'].setValue(data.BranchId);
    else
      this.stockAdjustmentHeaderForm.controls['FromBranchId'].setValue(data.BranchId);
  }

   onChangeReportAs(event){
    if(event.value.toLowerCase() == 'payable' ||  event.value.toLowerCase() == 'receivable'  )
        this.ToggleTerms(true);
    else
      this.ToggleTerms(false);
   }
   ToggleTerms( value){
     this.TermDaysReadOnly = !value;
     if (value)
     {
       this.stockAdjustmentHeaderForm.controls['TermDays'].setValue('');
     }
     else
     {
       this.stockAdjustmentHeaderForm.controls['TermDays'].setValue(this.numbersService.Convert0Decimal(0));
     }
   }
 
   validateForm(){
     return this.onSubmit();
   }
   onSubmit(){
     this.loading = true;
 
     var dates = ['TransDate'];
     dates.forEach(x => {
       if(this.stockAdjustmentHeaderForm.controls[x].value != null)
         this.stockAdjustmentHeaderForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.stockAdjustmentHeaderForm.controls[x].value)));
     });
 
     this.stockAdjustmentHeadersService.updateStockAdjustmentHeader(this.transCode, this.totalAmount, this.adjustmentType, this.recordStatus, this.action,this.stockAdjustmentHeaderForm.getRawValue()).subscribe({
       next:(res)=>{
         var stockAdjustmentHeader = res.stockAdjustmentHeader;
         var stockAdjustmentDetails = res.stockAdjustmentDetails;
 
         this.notif.toastrSuccess(res.message);
         if(this.action == 'savestockadjustmenttransaction'){
           if(this.printReceipt){
             this.print(stockAdjustmentHeader, stockAdjustmentDetails);
           }
         }
         this.dialogRef.close(res.stockAdjustmentHeader);
         this.loading = false;
       },
       error:(err)=> {
         this.notif.toastrError(err.error.message);
         this.loading = false;
       },
     });
   }
 
   print(stockAdjustmentHeader, stockAdjustmentDetails) {

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstockadjustmentdetails']));
    var title = 'STOCK ADJUSTMENT RECEIPT OF  - ' + stockAdjustmentHeader.TransNo ;
    this.printService.popupWindow(url, 'printstockadjustmentdetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(stockAdjustmentHeader));
    localStorage.setItem('Details', JSON.stringify(stockAdjustmentDetails));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', stockAdjustmentHeader.TransNo);
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
      dialogConfig.data         = ([this.stockAdjustmentHeader.TransNo, 'StockAdjustmentHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([null, 'StockAdjustmentHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }
  }


}
