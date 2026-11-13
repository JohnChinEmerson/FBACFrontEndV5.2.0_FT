import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { POConfigService } from 'src/app/services/Purchasing/poconfig.service';
import { PODetailsService } from 'src/app/services/Purchasing/podetails.service';
import { POHeadersService } from 'src/app/services/Purchasing/poheaders.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { PODetailUIComponent } from '../podetail-ui/podetail-ui.component';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-podetails-ui',
  templateUrl: './podetails-ui.component.html',
  styleUrls: ['./podetails-ui.component.css']
})
export class PODetailsUIComponent implements OnInit {
  poHeader      : any;
  poConfig      : any;
  poDetails     : any[];
  transNo         : any;
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
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
    {'Label'   : 'Print Details','Function'  : () => this.onClickPrintDetails(),'Disabled': true,}, 
  ];  
  contextButtons      = [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Void/Open','Function'       : () => this.onClickVoid(),'Disabled': true,}, 
  ];
  defaultColumns      = ['TransDate','TransNo', 'SupplierName','Qty','UM', 'ItemName','Cost', 'Discount', 'Amount', 'RecordStatus'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Cost', 'Discount', 'Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  
  constructor(
    private dialog              : MatDialog,
    private poHeadersService  : POHeadersService,
    private poDetailsService  : PODetailsService,
    private poConfigService   : POConfigService,
    private stocksService      : StocksService,
    private dateTimesService    : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,

    @Inject(MAT_DIALOG_DATA) public data: any, 

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.contextButtons, null);
    this.dateFrom = this.data[0];
    this.dateTo   = this.data[1];
    this.transNo = this.data[2];
    this.onClickView();
    this.getPOConfig();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getPOConfig(){
    this.poConfig = await firstValueFrom(this.poConfigService.getPOConfig());
  }

  async getPOHeader(transNo){
    this.poHeader = await firstValueFrom(this.poHeadersService.getPOHeaderByTransNo(transNo));
  }

  async onClickView(){
    this.isLoading = true;
    if(this.transNo == 'all'){
      this.poDetails = await firstValueFrom(this.poDetailsService.getPODetailsByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      ));
    }else{
      this.poDetails = await firstValueFrom(this.poDetailsService.getPODetailsByTransNo(
      this.transNo
    ));
    }
    
    if(this.poDetails)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.poDetails;
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
    this.selectedId = data.id;
    this.selectedData = data;
  }

  async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var stock:any = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedData.ItemId));
    var poDetail:any = await firstValueFrom(this.poDetailsService.getPODetailById(this.selectedData.id));

    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([poDetail,stock, 'editporecord']);
    this.dialog.open(PODetailUIComponent,dialogConfig).beforeClosed().subscribe(poDetail => {
      if(poDetail){
        const poDetailIndex = this.poDetails.findIndex(detail => detail.id === poDetail.id);
        if (poDetailIndex !== -1) {
          this.poDetails[poDetailIndex] = poDetail;  
        }
        this.displayRecords();
        this.selectedId = undefined;
      }
    
    });
  }

  onClickVoid(){
    if(!this.matTableService.checkNull(this.selectedId)) return;
  
    var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
    this.notificationService.popupWarning(action.toUpperCase()+" Record",this.selectedData.ItemName + " under " + this.selectedData.TransNo + " will be " + action + ". Continue?").then(async (result) => {
      if (result.value) {
          this.poDetailsService.updatePODetailRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.poDetail);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
      }
    });
  }

  populateChanges(poDetail){
    this.selectedId  = null;
    this.selectedData = null;
    const poDetailIndex = this.poDetails.findIndex(detail => detail.id === poDetail.id);
    if (poDetailIndex !== -1) {
      this.poDetails[poDetailIndex] = poDetail;  
    }
    this.displayRecords();
  }
  
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpodetails']));
    var data  = this.listData.filteredData;
    var title = 'PO DETAILS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'PODetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify([]));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.transNo);
  }

  async onClickPrintDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    await this.getPOHeader(this.selectedData.TransNo);

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpodetails']));
    var data  = this.listData.filteredData.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'PO RECEIPT OF  - ' + this.poHeader.TransNo ;
    
    this.printService.popupWindow(url, 'poDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(this.poHeader));
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
