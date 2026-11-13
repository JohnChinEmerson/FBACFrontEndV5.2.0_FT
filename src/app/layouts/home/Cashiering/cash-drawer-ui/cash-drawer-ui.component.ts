import { Component, Inject, OnInit } from '@angular/core';
import { CashDrawersService } from '../../../../services/Cashiering/cash-drawers.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { NumbersService } from 'src/app/services/numbers.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CashLedgerUIComponent } from '../cash-ledger-ui/cash-ledger-ui.component';
import { CashCountUIComponent } from '../cash-count-ui/cash-count-ui.component';
import { CashieringConfigService } from 'src/app/services/Cashiering/cashiering-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';
import { SaleConfigAccessRightsService } from 'src/app/services/Sales/sale-config-access-rights.service';

@Component({
  selector: 'app-cash-drawer-ui',
  templateUrl: './cash-drawer-ui.component.html',
  styleUrls: ['./cash-drawer-ui.component.css']
})
export class CashDrawerUIComponent implements OnInit {
  cashDrawer:any=[];
  totals : any=[];
  cashieringConfig:any=[];
  btnCashLedgerEnabled : boolean = false;
  btnCashCountEnabled : boolean = false;
  btnOpenCloseSalesEnabled : boolean = false;
  btnToggleEnabled : boolean  = false;
  printReceiptVisible : boolean = false;
  printReceipt : boolean = false;
  btnStartUpCashReadOnly: boolean = true;
  componentFrom : string;
  userId: string;
  btnText: string;
  btnStartUpText: string = 'Edit';
  loading               : boolean = false;
  saleConfigAccessright: any=[];
  textType  : string = 'number';
  
  cashDrawerForm = new FormGroup({
    StartUpCash          : new FormControl(0),
    CashIn         : new FormControl(0),
    CashOut     : new FormControl(0),
    TotalCash      : new FormControl(0),
    ReadingNo      : new FormControl(0),
});
  constructor(
    private cashDrawersService : CashDrawersService,
    private cashieringConfigService : CashieringConfigService,
    private saleConfigAccessRightsService     : SaleConfigAccessRightsService,
    private numbersService : NumbersService,
    private notificationService : NotificationService,
    private printService : PrintService,
    private dialog : MatDialog,
    private dialogRef : MatDialogRef<CashDrawerUIComponent>,
    private router : Router,
    private auth_service : AuthService, 
    @Inject(MAT_DIALOG_DATA) public data: any, 

  ) { }

  async ngOnInit(): Promise<void> {
    this.componentFrom = this.data[0];
    this.userId = this.data[1];
    if(this.componentFrom.toLowerCase() == 'cashdrawer'){
      await this.cashDrawerUI1(this.userId);
    }
    if(this.componentFrom.toLowerCase() == 'cashieringrecords'){
      this.cashDrawer = this.data[2];
      this.cashDrawerUI2(this.cashDrawer.ReadingNo);
    }
    if(this.componentFrom.toLowerCase() == 'cashreadingrecords'){
      this.cashDrawer = this.data[2];
      this.cashDrawerUI3(this.cashDrawer.ReadingNo);
    }
    this.cashDrawerForm.controls['ReadingNo'].setValue(this.cashDrawer.ReadingNo);
    await this.getsaleConfigAccessRightsService();
    this.getCashieringConfig();
  }

  async getsaleConfigAccessRightsService(){
    this.saleConfigAccessright = await firstValueFrom(this.saleConfigAccessRightsService.getSaleConfigAccessRightByAccessRightName(this.auth_service.UserAccount.AccessRightName));
    this.setUpFields();
  }

  async getCashieringConfig(){
    this.cashieringConfig = await firstValueFrom(this.cashieringConfigService.getCashieringConfig());
    this.onCheckPrintReceipt(this.cashieringConfig.PrintReceipt == 'yes')
  }

  setUpFields(){
    if(this.saleConfigAccessright.HideDrawerSales?.toLowerCase() == 'yes'){
      this.textType = 'password';
    }else{
      this.textType = 'number';
    }
    this.btnCashLedgerEnabled = this.saleConfigAccessright.HideDrawerSales?.toLowerCase() != 'yes';
  }

  async cashDrawerUI1(userId){
    this.cashDrawer = await firstValueFrom(this.cashDrawersService.GetOpenCashDrawerByUserId(userId));
    this.setCashDrawer();
    this.btnCashCountEnabled = this.cashDrawer != null;
    this.btnCashLedgerEnabled = this.cashDrawer != null;
  }

  cashDrawerUI2(readingNo){
    this.btnCashCountEnabled = this.cashDrawer != null;
    this.btnCashLedgerEnabled = this.cashDrawer != null;
    this.btnOpenCloseSalesEnabled =  this.cashDrawer != null;  
    this.btnToggleEnabled =  this.cashDrawer != null;  
    this.setCashDrawer();
  }

  cashDrawerUI3(readingNo){
    this.btnCashCountEnabled = this.cashDrawer != null;
    this.btnCashLedgerEnabled = this.cashDrawer != null;
    this.btnOpenCloseSalesEnabled =  this.cashDrawer != null;  
    this.btnToggleEnabled =  this.cashDrawer != null;  
    this.setCashDrawer();
  }

  async setCashDrawer(){
    this.totals = 
    {
      StartUpCash : 0,
      CashIn : 0,
      CashOut : 0,
      TotalCash : 0
    };
  
    this.btnText = "Start Sales";
   
    if (this.cashDrawer != null)
    {
        this.totals = await firstValueFrom(this.cashDrawersService.getTotalByCashDrawer(this.cashDrawer));
        this.btnText = this.cashDrawer.RecordStatus.toLowerCase() == "open" ? "Close Sales" : "Start Sales";
    }

    this.cashDrawerForm.controls['StartUpCash'].setValue(this.numbersService.Convert2Decimal(this.totals.StartUpCash));
    this.cashDrawerForm.controls['CashIn'].setValue(this.numbersService.Convert2Decimal(this.totals.CashIn));
    this.cashDrawerForm.controls['CashOut'].setValue(this.numbersService.Convert2Decimal(this.totals.CashOut));
    this.cashDrawerForm.controls['TotalCash'].setValue(this.numbersService.Convert2Decimal(this.totals.TotalCash));
    this.printReceiptVisible = this.btnText == "Close Sales";
  }

  async onClickSaveEditStartUpCash()
  {
      if (this.btnStartUpText.toLowerCase() == "save")
      {
          if (this.numbersService.isNotNumeric(this.cashDrawerForm.controls['StartUpCash'].value.toString()))
          {
            return this.notificationService.toastrError("Invalid Amount.");
          }
          else{
            await this.cashDrawersService.updateStartUpCash(this.cashDrawerForm.getRawValue()).subscribe({
              next:(res)=>{
                this.cashDrawer = res.cashDrawer;
              
                this.setCashDrawer();
                this.notificationService.toastrSuccess(res.message);

              },
              error:(err)=> {
                this.notificationService.toastrError(err.error.message);
              },
            });
          }
      }
      this.btnStartUpText = this.btnStartUpText.toLowerCase() == "edit" ? "Save" : "Edit";
      this.btnStartUpCashReadOnly = this.btnStartUpText.toLowerCase() == "edit";
  }

  onClickLedger(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([this.cashDrawer, 'CASH']);
    this.dialog.open(CashLedgerUIComponent,dialogConfig);
  }

  onClickCashCount(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data         = this.cashDrawer;
    this.dialog.open(CashCountUIComponent,dialogConfig);
  }

  onCheckPrintReceipt(value){
    this.printReceipt = value;
  }

  async onClickOpenCloseSales(){
    this.loading = true;
    var recordStatus = "open";
    if (this.btnText == "Close Sales")
    {
      this.notificationService.popupWarning("Close Sales","CashDrawer will be CLOSED. Continue?").then((result) => {
        if (result.value) {
          this.cashDrawersService.closCashDrawer(this.cashDrawer.ReadingNo).subscribe({
              next:async (res)=>{
                this.notificationService.toastrSuccess(res.message);
                recordStatus = "close";
                if (this.printReceipt)
                  {
                      this.cashDrawer = res.cashDrawer;
                      var cashIns     = res.cashIns;
                      var cashOuts    = res.cashOuts;
                      var bills       = res.bills;
                    
                      if (this.cashieringConfig.PrinterType.toLowerCase() == "ordinary"){
                        var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcashreading']));
                      }
                      else{
                         url   = this.router.serializeUrl(this.router.createUrlTree(['print/posprintcashreading']));
                      }

                      var title = 'CASH READING RECEIPT';
                      this.printService.popupWindow(url, 'printcashreading', window, 800, 800);
                      localStorage.setItem('cashDrawer', JSON.stringify(this.cashDrawer));
                      localStorage.setItem('cashIns', JSON.stringify(cashIns));
                      localStorage.setItem('cashOuts', JSON.stringify(cashOuts));
                      localStorage.setItem('denominations', JSON.stringify(bills));
                      localStorage.setItem('Title', title);
                      if (this.printReceipt != (this.cashieringConfig.PrintReceipt.toLowerCase() == "yes")){
                       await this.cashieringConfigService.updateCloseDrawerPrint(this.printReceipt).subscribe({
                        });
                      }
                  }
                this.closeUI(recordStatus);
                this.loading = false;
              },
              error:(err)=>{
                this.notificationService.toastrError(err.error);
                this.loading = false;
              },
          });
        }
      });
    }else{
      if (this.cashDrawer != null)
        {
          this.cashDrawersService.closeDrawerExcept(this.cashDrawer.ReadingNo).subscribe({
            next:async (res)=>{
              this.cashDrawer= res.cashDrawer;
              this.notificationService.toastrSuccess(res.message);
              this.loading = false;

            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
              this.loading = false;
            },
          });
        }
        else
        {
          this.cashDrawersService.startCashdrawer().subscribe({
            next:async (res)=>{
              this.cashDrawer= res.cashDrawer;
              this.setCashDrawer();
              this.notificationService.toastrSuccess(res.message);
              this.loading = false;
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
              this.loading = false;
            },
          });
        }
        this.closeUI(recordStatus);
    }
  }

  async closeUI(recordStatus){
      if (this.componentFrom.toLowerCase() == 'cashdrawer' || this.componentFrom.toLowerCase() == 'cashieringrecords')
      {
          var startupCash = this.cashDrawer.StartUpCash;
          if ( this.btnStartUpText.toLowerCase() == "edit")
              startupCash =this.cashDrawerForm.controls['StartUpCash'].value;
          await this.cashDrawersService.updateStartUpCashRecordStatus(this.cashDrawer.ReadingNo, startupCash, recordStatus).subscribe({
          });
      }

     this.cashDrawer = await firstValueFrom(this.cashDrawersService.getCashDrawerByReadingNo(this.cashDrawer.ReadingNo));

      if (this.componentFrom.toLowerCase() == 'cashdrawer'){
        this.dialogRef.close(this.cashDrawer);
        this.router.navigate(['home']);
      }else{
        this.dialogRef.close(this.cashDrawer);
      }
  }
  onClose(){
    this.dialogRef.close();
  }
}
