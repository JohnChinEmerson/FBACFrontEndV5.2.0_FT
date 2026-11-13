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
import { PODetailsService } from 'src/app/services/Purchasing/podetails.service';
import { POHeadersService } from 'src/app/services/Purchasing/poheaders.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { LoadItemsForPOUIComponent } from '../load-items-for-poui/load-items-for-poui.component';
import { PODetailsUIComponent } from '../podetails-ui/podetails-ui.component';
import { POHeaderUIComponent } from '../poheader-ui/poheader-ui.component';
import { POConfigService } from 'src/app/services/Purchasing/poconfig.service';

@Component({
  selector: 'app-poreceipts',
  templateUrl: './poreceipts.component.html',
  styleUrls: ['./poreceipts.component.css']
})
export class POReceiptsComponent implements OnInit {

  poHeaders : any=[];
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
  
  defaultColumns    = ['TransDate','TransNo', 'SupplierName','TotalDue','PaymentType','InputByDateTime','InputBy', 'RecordStatus',];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private poHeadersService        : POHeadersService,
    private poDetailsService  : PODetailsService,
    private poConfigService   : POConfigService,
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
    this.poHeaders = await firstValueFrom(this.poHeadersService.getPOHeadersByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
    ));
    if(this.poHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.poHeaders;
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
    this.dialog.open(PODetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
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
    this.dialog.open(PODetailsUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.onClickView();
  });
  }

  async onClickEdit(){
    if(!this.matTableService.checkNull(this.selectedId)) return;


    var data = await firstValueFrom(this.poHeadersService.getPOHeaderByTransNo(this.selectedId));
    var supplier = await firstValueFrom(this.suppliersService.getSupplierBySupplierId(this.selectedData.SupplierId));

    if(data && supplier){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data = ([supplier,data,  data.TransNo, 'update','updatepoheader']);
      this.dialog.open(POHeaderUIComponent,dialogConfig).beforeClosed().subscribe(x => {
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
        var data = await firstValueFrom(this.poHeadersService.getPOHeaderByTransNo(this.selectedId));

          this.poHeadersService.updatePORecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.poHeader);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
          });
      
      }
    });
  }

  populateChanges(poHeader){
    this.selectedId  = null;
    this.selectedData = null;
    const poHeaderIndex = this.poHeaders.findIndex(detail => detail.TransNo === poHeader.TransNo);
    if (poHeaderIndex !== -1) {
      this.poHeaders[poHeaderIndex] = poHeader;  
    }
    this.displayRecords();
  }

  async onClickAddItem(){
     if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var data = await firstValueFrom(this.poHeadersService.getPOHeaderByTransNo(this.selectedId));

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([data.TransCode, data.SupplierId,data, 'poreceipts', 'stocks']);
    this.dialog.open(LoadItemsForPOUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.populateChanges(x);
      } 
    });
  }


  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printporeceipts']));
    var data  = this.listData.filteredData;
    var title = 'PO RECEIPTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'printporeceipts', window, 800, 800);
    localStorage.setItem('Headers', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

  async onClickPrintReceipt(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var poHeader = await firstValueFrom(this.poHeadersService.getPOHeaderByTransNo(this.selectedData.TransNo));
    var poDetails = await firstValueFrom(this.poDetailsService.getPODetailsByTransNo(this.selectedData.TransNo));

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpodetails']));
    var data  = poDetails.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'PO RECEIPT OF  - ' + poHeader.TransNo ;
    
    this.printService.popupWindow(url, 'poDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(poHeader));
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
