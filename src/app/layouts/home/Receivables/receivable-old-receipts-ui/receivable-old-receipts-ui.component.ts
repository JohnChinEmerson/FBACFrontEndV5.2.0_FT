import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ReceivableOldReceiptsService } from 'src/app/services/Receivables/receivable-old-receipts.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { AccountingEntryUIComponent } from '../../Accounting/accounting-entry-ui/accounting-entry-ui.component';
import { ReceivableOldReceiptUIComponent } from '../receivable-old-receipt-ui/receivable-old-receipt-ui.component';

@Component({
  selector: 'app-receivable-old-receipts-ui',
  templateUrl: './receivable-old-receipts-ui.component.html',
  styleUrls: ['./receivable-old-receipts-ui.component.css']
})
export class ReceivableOldReceiptsUIComponent implements OnInit {
  receivableOldReceipts : any=[];
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
     {'Label'   : 'New','Function'                : () => this.onClickNew(),'Disabled': true,}, 
     {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
     {'Label'   : 'Print Receipt','Function'        : () => this.onClickPrintReceipt(),'Disabled': true,}, 
   ];  

   contextButtons     = [
     {'Label'   : 'Edit','Function'                : () => this.onClickEdit(),'Disabled': true,}, 
     {'Label'   : 'Void/Open','Function'           : () => this.onClickVoid(),'Disabled': true,},
     {'Label'   : 'Accounting Entry','Function'    : () => this.onClickAccountingEntry(),'Disabled': true,}, 
   ];
  defaultColumns    = ['TransDate', 'DueDate','TransNo', 'CustomerName', 'ContactNo','TotalAmount','AmountPaid', 'Balance','InputByDateTime' ,'InputBy', 'RecordStatus'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalAmount','AmountPaid', 'Balance'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate', 'DueDate']
  };
  columnTypeMap: { [key: string]: string } = {};
   
   constructor(
     private dialog              : MatDialog,
    private dialogRef         : MatDialogRef<ReceivableOldReceiptsUIComponent>,
     private receivableOldReceiptsService        : ReceivableOldReceiptsService,
     private toolBoxService      : ToolBoxService,
     private dateTimesService      : DateTimesService,
     public matTableService     : MatTableService,
     private printService        : PrintService,
     private router              : Router,
     private notificationService : NotificationService,
   ) { }
 
   async ngOnInit(): Promise<void> {
      this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
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
     this.receivableOldReceipts = await firstValueFrom(this.receivableOldReceiptsService.getReceivableOldReceiptsByDateFromByDateTo(
       this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
       this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
     ));
     if(this.receivableOldReceipts)
       this.isLoading = false;
     this.displayRecords();
   }
 
   displayRecords(){
     var data = this.receivableOldReceipts;
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
 
   onClickNew(){
          if (!this.matTableService.CommonTransaction()) {
      return;
    }
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '800px';
      dialogConfig.data = (['','savereceivableoldreceipt']);
      this.dialog.open(ReceivableOldReceiptUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        this.onClickView();
      }); 

   }
   async onClickEdit(){
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
     var data = await firstValueFrom(this.receivableOldReceiptsService.getReceivableOldReceiptByTransNo(this.selectedId));
     if(data){
       const dialogConfig        = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus    = true;
       dialogConfig.width        = '800px';
       dialogConfig.data = ([data, 'updatereceivableoldreceipt']);
       this.dialog.open(ReceivableOldReceiptUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        this.onClickView();
       });
     }
   }
 
   onClickVoid(){
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
     var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
     this.notificationService.popupWarning(action.toUpperCase()+" Record","All Items  under " + this.selectedId + " will be " + action.toUpperCase () + ". Continue?").then(async (result) => {
       if (result.value) {
          this.receivableOldReceiptsService.updateReceivableOldReceiptRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.onClickView();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
       }
     });
   }
 
 
   onClickAccountingEntry(){
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
     var indexTables: any ={
       'AccountTitleTable' : 'receivableoldreceiptaccounttitles',
       'TransactionTable' : 'receivableoldreceipts',
       'TransName' : null,
     } ;
     const dialogConfig        = new MatDialogConfig();
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus    = true;
     dialogConfig.width        = '800px';
     dialogConfig.data         = ([indexTables, this.selectedId]);
     this.dialog.open(AccountingEntryUIComponent,dialogConfig);
 
   }
   
    onClickPrint(){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivableoldreceipts']));
      var data  = this.listData.filteredData;
      var title = 'RECEIVABLE OLD RECEIPTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
      this.printService.popupWindow(url, 'printreceivableoldreceipts', window, 800, 800);
      localStorage.setItem('Headers', JSON.stringify(data));
      localStorage.setItem('Title', title);
    }

     onClickPrintReceipt(){
      if(!this.matTableService.checkNull(this.selectedId)) return;

      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivableoldreceipt']));
      var title = 'RECEIVABLE OLD RECEIPT';
      this.printService.popupWindow(url, 'printreceivableoldreceipt', window, 800, 800);
      localStorage.setItem('Data', JSON.stringify(this.selectedData));
      localStorage.setItem('Title', title);
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

   onClose(){
    this.dialogRef.close();
  }

}
