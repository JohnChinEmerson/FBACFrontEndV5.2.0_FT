import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CanvassDetailsService } from 'src/app/services/Canvassing/canvass-details.service';
import { CanvassHeadersService } from 'src/app/services/Canvassing/canvass-headers.service';
import { CanvassReasonsService } from 'src/app/services/Canvassing/canvass-reasons.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { AccountingEntryUIComponent } from '../../Accounting/accounting-entry-ui/accounting-entry-ui.component';
import { HomeComponent } from '../../home.component';
import { CanvassDetailsUIComponent } from '../canvass-details-ui/canvass-details-ui.component';
import { CanvassHeaderUIComponent } from '../canvass-header-ui/canvass-header-ui.component';
import { LoadItemsForCanvassUIComponent } from '../load-items-for-canvass-ui/load-items-for-canvass-ui.component';

@Component({
  selector: 'app-canvass-receipts',
  templateUrl: './canvass-receipts.component.html',
  styleUrls: ['./canvass-receipts.component.css']
})
export class CanvassReceiptsComponent implements OnInit {
  canvassHeaders : any=[];
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
  defaultColumns    = ['TransDate','TransNo', 'ReasonName', 'Remarks', 'ReferenceNo','InputByDateTime','InputBy', 'RecordStatus',];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private canvassHeadersService        : CanvassHeadersService,
    private canvassDetailsService        : CanvassDetailsService,
    private reasonsService        : CanvassReasonsService,
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
    this.canvassHeaders = await firstValueFrom(this.canvassHeadersService.getCanvassHeadersByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
    ));
    if(this.canvassHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.canvassHeaders;
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
    dialogConfig.width        = '2000px';
    dialogConfig.data         = ([this.dateFrom, this.dateTo, this.selectedData.TransNo]);
     dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(CanvassDetailsUIComponent,dialogConfig);
  }

  onClickViewAllDetails(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '2000px';
    dialogConfig.data         = ([this.dateFrom, this.dateTo, 'all']);
     dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(CanvassDetailsUIComponent,dialogConfig);
  }

  async onClickEdit(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var data = await firstValueFrom(this.canvassHeadersService.getCanvassHeaderByTransNo(this.selectedId));
    var reason = await firstValueFrom(this.reasonsService.getCanvassReasonByReasonId(this.selectedData.ReasonId));

    if(data && reason){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '800px';
      dialogConfig.data = [reason, data, data.TransNo, 'updatecanvassheader'];
      this.dialog.open(CanvassHeaderUIComponent,dialogConfig).beforeClosed().subscribe(x => {
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
        var data = await firstValueFrom(this.canvassHeadersService.getCanvassHeaderByTransNo(this.selectedId));

          this.canvassHeadersService.updateCanvassRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.canvassHeader);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error.message);
            },
          });
      
      }
    });
  }

  populateChanges(canvassHeader){
    this.selectedId  = null;
    this.selectedData = null;
    const canvassHeaderIndex = this.canvassHeaders.findIndex(detail => detail.TransNo === canvassHeader.TransNo);
    if (canvassHeaderIndex !== -1) {
      this.canvassHeaders[canvassHeaderIndex] = canvassHeader;  
    }
    this.displayRecords();
  }

  async onClickAddItem(){
     if (!this.matTableService.CommonTransaction()) {
      return;
    }
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var data = await firstValueFrom(this.canvassHeadersService.getCanvassHeaderByTransNo(this.selectedId));

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([data.TransCode, data.ReasonId,data, 'canvassreceipts', 'stocks']);
    this.dialog.open(LoadItemsForCanvassUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.populateChanges(x);
      } 
    });
  }

  
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcanvassreceipts']));
    var data  = this.listData.filteredData;
    var title = 'CANVASS RECEIPTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'PrintCanvassReceipts', window, 800, 800);
    localStorage.setItem('Headers', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

  async onClickPrintReceipt(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var canvassHeader = await firstValueFrom(this.canvassHeadersService.getCanvassHeaderByTransNo(this.selectedData.TransNo));
    var canvassDetails = await firstValueFrom(this.canvassDetailsService.getCanvassDetailsWithCanvassDetailSuppliersByTransNo(this.selectedData.TransNo));

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcanvassdetails']));
    var title = 'CANVASS RECEIPT OF  - ' + canvassHeader.TransNo ;
    
    this.printService.popupWindow(url, 'printcanvassdetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(canvassHeader));
    localStorage.setItem('Details', JSON.stringify(canvassDetails));
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
