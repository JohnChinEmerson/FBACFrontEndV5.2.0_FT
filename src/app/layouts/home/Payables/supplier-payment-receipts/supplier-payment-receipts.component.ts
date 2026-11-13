import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SupplierPaymentHeadersService } from 'src/app/services/Payables/supplier-payment-headers.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { AccountingEntryUIComponent } from '../../Accounting/accounting-entry-ui/accounting-entry-ui.component';
import { HomeComponent } from '../../home.component';
import { SupplierPaymentHeaderUIComponent } from '../supplier-payment-header-ui/supplier-payment-header-ui.component';
import { SupplierPaymentDetailsUIComponent } from '../supplier-payment-details-ui/supplier-payment-details-ui.component';
import { SupplierPaymentDetailsService } from '../../../../services/Payables/supplier-payment-details.service';

@Component({
  selector: 'app-supplier-payment-receipts',
  templateUrl: './supplier-payment-receipts.component.html',
  styleUrls: ['./supplier-payment-receipts.component.css']
})
export class SupplierPaymentReceiptsComponent implements OnInit {

 supplierPaymentHeaders : any=[];
   selectedData    : any;
   selectedId      : number = 0;
   searchKey       : string = "";
   listData        : MatTableDataSource<any>;
   pageSizeOptions :any = this.matTableService.pageSizeOptions();
   isLoading       : boolean = false;
   dateFrom        : any = new Date();
   dateTo          : any = new Date();
   @ViewChild(MatSort) sort              : MatSort;
   @ViewChild(MatPaginator) paginator    : MatPaginator;  
   @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
 
   contextMenuPosition = { x: '0px', y: '0px' };
   toolButtons     = [
     {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
     {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
   ];  
   toolButtons2     = [
     {'Label'   : 'View Details','Function'        : () => this.onClickViewDetails(),'Disabled': true,}, 
     {'Label'   : 'Print Receipt','Function'               : () => this.onClickPrintReceipt(),'Disabled': true,}, 
     {'Label'   : 'View All Details','Function'    : () => this.onClickViewAllDetails(),'Disabled': true,}, 
   ];  
   contextButtons     = [
     {'Label'   : 'Edit','Function'                : () => this.onClickEdit(),'Disabled': true,}, 
     {'Label'   : 'Void/Open','Function'           : () => this.onClickVoid(),'Disabled': true,},
     {'Label'   : 'Accounting Entry','Function'    : () => this.onClickAccountingEntry(),'Disabled': true,}, 
   ];
 
  defaultColumns    = ['TransDate','TransNo', 'SupplierName', 'ContactNo', 'Adddress', 'SupplierTIN','BusinessStyle','TotalDue','PaymentType','InputByDateTime','InputBy', 'RecordStatus', 'ReadingNo', 'FundSource'];
   columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};

   constructor(
     private dialog              : MatDialog,
     private supplierPaymentHeadersService        : SupplierPaymentHeadersService,
     private supplierPaymentDetailsService        : SupplierPaymentDetailsService,
     private toolBoxService      : ToolBoxService,
     private dateTimesService      : DateTimesService,
     public matTableService     : MatTableService,
     private printService        : PrintService,
     private router              : Router,
     private homeTs              : HomeComponent,
     private notificationService : NotificationService,
      private viewContainerRef : ViewContainerRef,
   ) { }
 
   async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
     await this.homeTs.getButtons();
     this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.contextButtons, null);
   }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }
 
   async onClickView(){
     this.isLoading = true;
     this.supplierPaymentHeaders = await firstValueFrom(this.supplierPaymentHeadersService.getSupplierPaymentHeadersByDateFromByDateTo(
       this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
       this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
     ));
     if(this.supplierPaymentHeaders)
       this.isLoading = false;
     this.displayRecords();
   }
 
   displayRecords(){
     var data = this.supplierPaymentHeaders;
     this.listData =  new MatTableDataSource(data);
     this.listData.paginator = this.paginator;
     this.listData.sort = this.sort;
   }
 
   applyFilter(){
     this.matTableService.applyFilter(this.listData, this.searchKey);
   }
 
   clearSearch(){
     this.searchKey =  this.matTableService.clearSearch(this.listData);
   }
 
   getRecord(data : any){
     this.selectedId = data.TransNo;
     this.selectedData = data;
   }
 
   onClickViewDetails(){
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
     const dialogConfig        = new MatDialogConfig();
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus    = true;
     dialogConfig.width        = '1500px';
     dialogConfig.data         = ([this.dateFrom, this.dateTo, this.selectedData.TransNo]);
    dialogConfig.viewContainerRef = this.viewContainerRef; 
     this.dialog.open(SupplierPaymentDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        this.onClickView();
    });
   }
 
   onClickViewAllDetails(){
     const dialogConfig        = new MatDialogConfig();
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus    = true;
     dialogConfig.width        = '1500px';
     dialogConfig.data         = ([this.dateFrom, this.dateTo, 'all']);
    dialogConfig.viewContainerRef = this.viewContainerRef; 
     this.dialog.open(SupplierPaymentDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        this.onClickView();
    });
   }
 
   async onClickEdit(){
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
     var data = await firstValueFrom(this.supplierPaymentHeadersService.getSupplierPaymentHeaderByTransNo(this.selectedId));
     if(data){
       const dialogConfig        = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus    = true;
       dialogConfig.width        = '1000px';
       dialogConfig.data = ([data, data.TransNo,data.TotalAmount,'updatesupplierpaymentheader']);
       this.dialog.open(SupplierPaymentHeaderUIComponent,dialogConfig).beforeClosed().subscribe(x => {
         if(x){
           this.populateChanges(x);
         }
       });
     }
   }
 
   onClickVoid(){
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
     var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
     this.notificationService.popupWarning(action.toUpperCase()+" Record","All Items  under " + this.selectedId + " will be " + action.toUpperCase () + ". Continue?").then(async (result) => {
       if (result.value) {
          this.supplierPaymentHeadersService.updateSupplierPaymentRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.supplierPaymentHeader);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
       }
     });
   }
 
   populateChanges(supplierPaymentHeader){
     this.selectedId  = null;
     this.selectedData = null;
     const supplierPaymentHeaderIndex = this.supplierPaymentHeaders.findIndex(detail => detail.TransNo === supplierPaymentHeader.TransNo);
     if (supplierPaymentHeaderIndex !== -1) {
       this.supplierPaymentHeaders[supplierPaymentHeaderIndex] = supplierPaymentHeader;  
     }
     this.displayRecords();
   }

 
   onClickAccountingEntry(){
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
     var indexTables: any ={
       'AccountTitleTable' : 'supplierpaymentaccounttitles',
       'TransactionTable' : 'supplierpaymentheaders',
       'TransName' : null,
     } ;
     const dialogConfig        = new MatDialogConfig();
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus    = true;
     dialogConfig.width        = '1000px';
     dialogConfig.data         = ([indexTables, this.selectedId]);
     this.dialog.open(AccountingEntryUIComponent,dialogConfig);
 
   }
  
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsupplierpaymentreceipts']));
    var data  = this.listData.filteredData;
    var title = 'SUPPLIER PAYMENT RECEIPTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'printsupplierpaymentreceipts', window, 800, 800);
    localStorage.setItem('Headers', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

  async onClickPrintReceipt(){
    if(!this.matTableService.checkNull(this.selectedId)) return;
 
    var supplierPaymentHeader = await firstValueFrom(this.supplierPaymentHeadersService.getSupplierPaymentHeaderByTransNo(this.selectedData.TransNo));
    var supplierPaymentDetails = await firstValueFrom(this.supplierPaymentDetailsService.getSupplierPaymentDetailsByTransNo(this.selectedData.TransNo));

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsupplierpaymentdetails']));
    var data  = supplierPaymentDetails.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'SUPPLIER PAYMENT RECEIPT OF  - ' + supplierPaymentHeader.TransNo ;
    
    this.printService.popupWindow(url, 'supplierPaymentDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(supplierPaymentHeader));
    localStorage.setItem('Voucher', null);
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.selectedData.TransNo);
  }

   
   onContextMenu(event: MouseEvent, data: any) {
     if(this.contextButtons.length > 0){
       this.getRecord(data);
       event.preventDefault();
       this.contextMenuPosition.x = event.clientX + 'px';
       this.contextMenuPosition.y = event.clientY + 'px';
       this.contextMenu.menuData = { 'data': data };
       this.contextMenu.menu.focusFirstItem('mouse');
       this.contextMenu.openMenu();
     }
   }
}
