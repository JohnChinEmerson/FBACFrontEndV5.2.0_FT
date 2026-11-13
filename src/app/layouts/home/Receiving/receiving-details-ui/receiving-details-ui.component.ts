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
import { ReceivingConfigService } from 'src/app/services/Receiving/receiving-config.service';
import { ReceivingDetailsService } from 'src/app/services/Receiving/receiving-details.service';
import { ReceivingHeadersService } from 'src/app/services/Receiving/receiving-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { ReceivingDetailUIComponent } from '../receiving-detail-ui/receiving-detail-ui.component';
import { RRSerialNosUIComponent } from '../rrserial-nos-ui/rrserial-nos-ui.component';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-receiving-details-ui',
  templateUrl: './receiving-details-ui.component.html',
  styleUrls: ['./receiving-details-ui.component.css']
})
export class ReceivingDetailsUIComponent implements OnInit {
  receivingHeader      : any;
  receivingConfig      : any;
  receivingDetails     : any[];
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
    {'Label'   : 'SerialNos','Function'       : () => this.onClickSerialNos(),'Disabled': true,}, 
  ];
  defaultColumns      = ['TransDate','TransNo', 'SupplierName','Qty','UM', 'ItemName','Cost', 'Discount', 'Amount','RecordStatus',  'ReadingNo', 'ExpiryDate', 'BatchLotNo'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Cost', 'Discount', 'Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  
  constructor(
    private dialog              : MatDialog,
    private receivingHeadersService  : ReceivingHeadersService,
    private receivingDetailsService  : ReceivingDetailsService,
    private receivingConfigService   : ReceivingConfigService,
    private stocksService       : StocksService,
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
    this.getReceivingConfig();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getReceivingConfig(){
    this.receivingConfig = await firstValueFrom(this.receivingConfigService.getReceivingConfig());
  }

  async getReceivingHeader(transNo){
    this.receivingHeader = await firstValueFrom(this.receivingHeadersService.getReceivingHeaderByTransNo(transNo));
  }

  async onClickView(){
    this.isLoading = true;
    if(this.transNo == 'all'){
      this.receivingDetails = await firstValueFrom(this.receivingDetailsService.getReceivingDetailsByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      ));
    }else{
      this.receivingDetails = await firstValueFrom(this.receivingDetailsService.getReceivingDetailsByTransNo(
      this.transNo
    ));
    }
    
    if(this.receivingDetails)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.receivingDetails;
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
    var receivingDetail:any = await firstValueFrom(this.receivingDetailsService.getReceivingDetailById(this.selectedData.id));

    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([receivingDetail,stock, 'editreceivingrecord']);
    this.dialog.open(ReceivingDetailUIComponent,dialogConfig).beforeClosed().subscribe(receivingDetail => {
      if(receivingDetail){
        const receivingDetailIndex = this.receivingDetails.findIndex(detail => detail.id === receivingDetail.id);
        if (receivingDetailIndex !== -1) {
          this.receivingDetails[receivingDetailIndex] = receivingDetail;  
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
          this.receivingDetailsService.updateReceivingDetailRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.receivingDetail);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
      }
    });
  }

  async onClickSerialNos(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var rRDetail:any = await firstValueFrom(this.receivingDetailsService.getReceivingDetailById(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([rRDetail, 'receivingdetails', '']);
    this.dialog.open(RRSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(receivingDetail => {
      this.onClickView();
    });
  }
  
  populateChanges(receivingDetail){
    this.selectedId  = null;
    this.selectedData = null;
    const receivingDetailIndex = this.receivingDetails.findIndex(detail => detail.id === receivingDetail.id);
    if (receivingDetailIndex !== -1) {
      this.receivingDetails[receivingDetailIndex] = receivingDetail;  
    }
    this.displayRecords();
  }
  
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivingdetails']));
    var data  = this.listData.filteredData;
    var title = 'RECEIVING DETAILS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'ReceivingDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify([]));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.transNo);
  }

  async onClickPrintDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    await this.getReceivingHeader(this.selectedData.TransNo);

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivingdetails']));
    var data  = this.listData.filteredData.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'RECEIVING RECEIPT OF  - ' + this.receivingHeader.TransNo ;
    
    this.printService.popupWindow(url, 'receivingDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(this.receivingHeader));
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
