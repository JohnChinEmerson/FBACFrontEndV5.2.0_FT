import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { SuppliersService } from 'src/app/services/Files/suppliers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ReturnToSupplierDetailsService } from 'src/app/services/ReturnToSupplier/return-to-supplier-details.service';
import { ReturnToSupplierHeadersService } from 'src/app/services/ReturnToSupplier/return-to-supplier-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { AccountingEntryUIComponent } from '../../Accounting/accounting-entry-ui/accounting-entry-ui.component';
import { HomeComponent } from '../../home.component';
import { LoadItemsForReturnToSupplierUIComponent } from '../load-items-for-return-to-supplier-ui/load-items-for-return-to-supplier-ui.component';
import { ReturnToSupplierDetailsUIComponent } from '../return-to-supplier-details-ui/return-to-supplier-details-ui.component';
import { ReturnToSupplierHeaderUIComponent } from '../return-to-supplier-header-ui/return-to-supplier-header-ui.component';
import { ReturnToSupplierConfigService } from 'src/app/services/ReturnToSupplier/return-to-supplier-config.service';

@Component({
  selector: 'app-return-to-supplier-receipts',
  templateUrl: './return-to-supplier-receipts.component.html',
  styleUrls: ['./return-to-supplier-receipts.component.css']
})
export class ReturnToSupplierReceiptsComponent implements OnInit {

  returnToSupplierHeaders : any=[];
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
    {'Label'   : 'Add Item','Function'            : () => this.onClickAddItem(),'Disabled': true,}, 
  ];
  defaultColumns    = ['TransDate','TransNo', 'CustomerName','TotalDue','PaymentType','InputByDateTime','InputBy', 'RecordStatus','ReadingNo'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};

  
  constructor(
    private dialog              : MatDialog,
    private returnToSupplierHeadersService        : ReturnToSupplierHeadersService,
    private returnToSupplierDetailsService        : ReturnToSupplierDetailsService,
    private returnToSupplierConfigService        : ReturnToSupplierConfigService,
    private suppliersService        : SuppliersService,
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
    this.returnToSupplierHeaders = await firstValueFrom(this.returnToSupplierHeadersService.getReturnToSupplierHeadersByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
    ));
    if(this.returnToSupplierHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.returnToSupplierHeaders;
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
    this.dialog.open(ReturnToSupplierDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
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
    this.dialog.open(ReturnToSupplierDetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.onClickView();
  });
  }

  async onClickEdit(){
    if(!this.matTableService.checkNull(this.selectedId)) return;


    var data = await firstValueFrom(this.returnToSupplierHeadersService.getReturnToSupplierHeaderByTransNo(this.selectedId));
    var supplier = await firstValueFrom(this.suppliersService.getSupplierBySupplierId(this.selectedData.SupplierId));
    var refundable:any = await firstValueFrom(this.returnToSupplierDetailsService.computeReturnToSupplierRefundable(this.selectedData.TransCode));

    if(data && supplier){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
    dialogConfig.data = ([supplier,data, data.TransNo, data.TotalAmount, 'open','updatereturntosupplierheader', refundable]);
      this.dialog.open(ReturnToSupplierHeaderUIComponent,dialogConfig).beforeClosed().subscribe(x => {
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
        this.returnToSupplierHeadersService.updateReturnToSupplierRecordStatus(this.selectedId, action).subscribe({
          next:(res)=>{
            this.notificationService.toastrSuccess(res.message);
            this.populateChanges(res.returnToSupplierHeader);
          },
          error:(err)=>{
            this.notificationService.toastrError(err.error.message);
          },
        });
      }
    });
  }

  populateChanges(returnToSupplierHeader){
    this.selectedId  = null;
    this.selectedData = null;
    const returnToSupplierHeaderIndex = this.returnToSupplierHeaders.findIndex(detail => detail.TransNo === returnToSupplierHeader.TransNo);
    if (returnToSupplierHeaderIndex !== -1) {
      this.returnToSupplierHeaders[returnToSupplierHeaderIndex] = returnToSupplierHeader;  
    }
    this.displayRecords();
  }

  async onClickAddItem(){
     if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var data = await firstValueFrom(this.returnToSupplierHeadersService.getReturnToSupplierHeaderByTransNo(this.selectedId));

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([data.TransCode, data.SupplierId,data, 'returntosupplierreceipts']);
    this.dialog.open(LoadItemsForReturnToSupplierUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.populateChanges(x);
      } 
    });
  }

  onClickAccountingEntry(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var indexTables: any ={
      'AccountTitleTable' : 'saleaccounttitles',
      'TransactionTable' : 'SaleReturnHeaders',
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
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreturntosupplierreceipts']));
    var data  = this.listData.filteredData;
    var title = 'RETURN TO SUPPLIER RECEIPTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'printreturntosupplierreceipts', window, 800, 800);
    localStorage.setItem('Headers', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

  async onClickPrintReceipt(){
    if(!this.matTableService.checkNull(this.selectedId)) return;
  
    var returnToSupplierHeader = await firstValueFrom(this.returnToSupplierHeadersService.getReturnToSupplierHeaderByTransNo(this.selectedData.TransNo));
    var returnToSupplierDetails = await firstValueFrom(this.returnToSupplierDetailsService.getReturnToSupplierDetailsByTransNo(this.selectedData.TransNo));
    var returnToSupplierConfig = await firstValueFrom(this.returnToSupplierConfigService.getReturnToSupplierConfig());

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreturntosupplierdetails']));
    var data  = returnToSupplierDetails.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'RETURN TO SUPPLIER RECEIPT OF  - ' + returnToSupplierHeader.TransNo ;
    
    this.printService.popupWindow(url, 'printreturntosupplierdetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(returnToSupplierHeader));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('ReturnToSupplierConfig', JSON.stringify(returnToSupplierConfig));
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
