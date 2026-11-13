import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom, async } from 'rxjs';
import { CashTransfersService } from 'src/app/services/Cashflow/cash-transfers.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { AccountingEntryUIComponent } from '../../Accounting/accounting-entry-ui/accounting-entry-ui.component';
import { HomeComponent } from '../../home.component';
import { CashTransferUIComponent } from '../cash-transfer-ui/cash-transfer-ui.component';

@Component({
  selector: 'app-cash-transfers',
  templateUrl: './cash-transfers.component.html',
  styleUrls: ['./cash-transfers.component.css']
})
export class CashTransfersComponent implements OnInit {

  cashTransfers : any=[];
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
  ];  
  toolButtons2     = [
    {'Label'   : 'Print Receipt','Function'               : () => this.onClickPrintReceipt(),'Disabled': true,}, 

  ];  
  contextButtons     = [
    {'Label'   : 'Edit','Function'                : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Void/Open','Function'           : () => this.onClickVoid(),'Disabled': true,},
    {'Label'   : 'Accounting Entry','Function'    : () => this.onClickAccountingEntry(),'Disabled': true,}, 
  ];
  dateColumns       = [];
  defaultColumns    = ['TransDate','TransNo', 'Source','Amount','Destination', 'SourceType', 'DestinationType','ReferenceNo','InputByDateTime','InputBy', 'RecordStatus'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Amount'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  
  constructor(
    private dialog              : MatDialog,
    private cashTransfersService        : CashTransfersService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private notificationService : NotificationService,
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
    this.cashTransfers = await firstValueFrom(this.cashTransfersService.getCashTransfersByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
    ));
    if(this.cashTransfers)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.cashTransfers;
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
    dialogConfig.data = (['','savecashtransfer']);
    this.dialog.open(CashTransferUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        this.onClickView();
    });
  }

  async onClickEdit(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var cashTransfer:any = await firstValueFrom(this.cashTransfersService.getCashTransferByTransNo(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '800px';
    dialogConfig.data = ([cashTransfer,'updatecashtransfer']);
    this.dialog.open(CashTransferUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        this.onClickView();
    });
  }

  onClickVoid(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
    this.notificationService.popupWarning(action.toUpperCase()+" Record","All Items  under " + this.selectedId + " will be " + action.toUpperCase () + ". Continue?").then(async (result) => {
      if (result.value) {
        var data = await firstValueFrom(this.cashTransfersService.getCashTransferByTransNo(this.selectedId));
            this.cashTransfersService.updateCashTransferRecordStatus(data.TransNo, action).subscribe({
              next:(res)=>{
                this.notificationService.toastrSuccess(res.message);
                this.populateChanges(res.cashTransfer);
              },
              error:(err)=>{
                this.notificationService.toastrError(err.error);
              },
            });
      }
    });
  }

  populateChanges(cashTransfer){
    this.selectedId  = null;
    this.selectedData = null;
    const cashTransferIndex = this.cashTransfers.findIndex(detail => detail.TransNo === cashTransfer.TransNo);
    if (cashTransferIndex !== -1) {
      this.cashTransfers[cashTransferIndex] = cashTransfer;  
    }
    this.displayRecords();
  }



  onClickAccountingEntry(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var indexTables: any ={
      'AccountTitleTable' : 'cashtransferaccounttitles',
      'TransactionTable' : 'cashtransfers',
      'TransName' : null,
    } ;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([indexTables, this.selectedId]);
    this.dialog.open(AccountingEntryUIComponent,dialogConfig);

  }
  async onClickPrintReceipt(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcashtransferreceipt']));
    var data  = this.listData.filteredData;
    var title = 'CASH TRANSFER RECEIPTS ';
    this.printService.popupWindow(url, 'printcashtransferreceipt', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(this.selectedData));
    localStorage.setItem('Title', title);

  
  }
  
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcashtranfers']));
    var data  = this.listData.filteredData;
    var title = 'CASH TRANSFERS RECEIPTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'printcashtranfers', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
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

}
