import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
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
import { SaleReturnConfigService } from 'src/app/services/SaleReturn/sale-return-config.service';
import { SaleReturnDetailsService } from 'src/app/services/SaleReturn/sale-return-details.service';
import { SaleReturnHeadersService } from 'src/app/services/SaleReturn/sale-return-headers.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { SaleReturnDetailUIComponent } from '../sale-return-detail-ui/sale-return-detail-ui.component';
import { SRSerialNosUIComponent } from '../srserial-nos-ui/srserial-nos-ui.component';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-sale-return-details-ui',
  templateUrl: './sale-return-details-ui.component.html',
  styleUrls: ['./sale-return-details-ui.component.css']
})
export class SaleReturnDetailsUIComponent implements OnInit {

  saleReturnHeader      : any;
  saleReturnConfig      : any;
  saleReturnDetails     : any[];
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
  defaultColumns      = ['TransDate','TransNo', 'CustomerName','Qty','UM', 'ItemName','Price', 'Discount', 'Amount','RecordStatus', 'SalePaidStatus', 'ReadingNo', 'ExpiryDate', 'BatchLotNo', 'Reason'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Price', 'Discount', 'Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};

  constructor(
    private dialog              : MatDialog,
    private saleReturnHeadersService  : SaleReturnHeadersService,
    private saleReturnDetailsService  : SaleReturnDetailsService,
    private saleReturnConfigService   : SaleReturnConfigService,
    private saleDetailsService      : SaleDetailsService,
    private dateTimesService    : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private notificationService        : NotificationService,
    private router              : Router,
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
    this.getSaleReturnConfig();
  }
     
  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getSaleReturnConfig(){
    this.saleReturnConfig = await firstValueFrom(this.saleReturnConfigService.getSaleReturnConfig());
  }

  async getSaleReturnHeader(transNo){
    this.saleReturnHeader = await firstValueFrom(this.saleReturnHeadersService.getSaleReturnHeaderByTransNo(transNo));
  }

  async onClickView(){
    this.isLoading = true;
    if(this.transNo == 'all'){
      this.saleReturnDetails = await firstValueFrom(this.saleReturnDetailsService.getSaleReturnDetailsByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      ));
    }else{
      this.saleReturnDetails = await firstValueFrom(this.saleReturnDetailsService.getSaleReturnDetailsByTransNo(
      this.transNo
    ));
    }
    
    if(this.saleReturnDetails)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.saleReturnDetails;
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

    var saleReturnDetail:any = await firstValueFrom(this.saleReturnDetailsService.getSaleReturnDetailById(this.selectedData.id));
    var saleDetail:any = await firstValueFrom(this.saleDetailsService.getSaleDetailById(this.selectedData.SaleDetailId));

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([saleReturnDetail,saleDetail, 'editsalereturnrecord']);
    this.dialog.open(SaleReturnDetailUIComponent,dialogConfig).beforeClosed().subscribe(saleReturnDetail => {
      if(saleReturnDetail){
        const saleReturnDetailIndex = this.saleReturnDetails.findIndex(detail => detail.id === saleReturnDetail.id);
        if (saleReturnDetailIndex !== -1) {
          this.saleReturnDetails[saleReturnDetailIndex] = saleReturnDetail;  
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
          this.saleReturnDetailsService.updateSaleReturnDetailRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.saleReturnDetail);
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

    var sRDetail:any = await firstValueFrom(this.saleReturnDetailsService.getSaleReturnDetailById(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([sRDetail, 'salereturndetails', '']);
    this.dialog.open(SRSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(sRDetail => {
      this.onClickView();
    });
  }

  populateChanges(saleReturnDetail){
    this.selectedId  = null;
    this.selectedData = null;
    const saleReturnDetailIndex = this.saleReturnDetails.findIndex(detail => detail.id === saleReturnDetail.id);
    if (saleReturnDetailIndex !== -1) {
      this.saleReturnDetails[saleReturnDetailIndex] = saleReturnDetail;  
    }
    this.displayRecords();
  }
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalereturndetails']));
    var data  = this.listData.filteredData;
    var title = 'SALE RETURN DETAILS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'SaleReturnDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify([]));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('SaleReturnConfig', JSON.stringify(this.saleReturnConfig));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.transNo);
  }

  async onClickPrintDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    await this.getSaleReturnHeader(this.selectedData.TransNo);

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsalereturndetails']));
    var data  = this.listData.filteredData.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'SALES RETURN RECEIPT OF  - ' + this.saleReturnHeader.TransNo ;
    
    this.printService.popupWindow(url, 'saleReturnDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(this.saleReturnHeader));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('SaleReturnConfig', JSON.stringify(this.saleReturnConfig));
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
