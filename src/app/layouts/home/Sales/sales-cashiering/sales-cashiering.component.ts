import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { ChangeUIComponent } from '../change-ui/change-ui.component';

@Component({
  selector: 'app-sales-cashiering',
  templateUrl: './sales-cashiering.component.html',
  styleUrls: ['./sales-cashiering.component.css']
})
export class SalesCashieringComponent implements OnInit {

  saleHeaders : any=[];
  saleDetails : any=[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  listData2        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  isLoading2       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  totalAmount     : number = 0;

  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild('paginator') paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild('paginator2') paginator2    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu2: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    // {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Tender Amount','Function'                : () => this.onClickTenderAmount(),'Disabled': true,}, 
  ];  
 
  contextButtons     = [
  ];
  defaultColumns    = ['TransDate', 'TransNo', 'CustomerName','TotalDue'];
  defaultColumns2    = ['Qty', 'UM', 'ItemName','Price', 'Discount', 'Amount','ExpiryDate', 'BatchLotNo'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue','Qty','Price', 'Discount', 'Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private saleHeadersService        : SaleHeadersService,
    private saleDetailsService        : SaleDetailsService,
    private customersService        : CustomersService,
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
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons,null, null, null);
    this.onClickView();
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
    this.saleHeaders = await firstValueFrom(this.saleHeadersService.getDataPendingCashiering());
    if(this.saleHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  async onClickViewDetails(){
    this.isLoading2 = true;
    this.saleDetails = await firstValueFrom(this.saleDetailsService.getSaleDetailsByTransNo(this.selectedId));
    if(this.saleDetails)
      this.isLoading2 = false;
    this.displayRecords2();
  }

  async onClickTenderAmount(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var saleHeader:any = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransNo(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data         = ([saleHeader, 'cashiering']);
    this.dialog.open(ChangeUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.saleHeaders = this.saleHeaders.filter(x => x.TransNo != this.selectedData.TransNo);
        this.displayRecords();
      }
    });
  }

  displayRecords(){
    var data = this.saleHeaders;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;

    this.selectedId = undefined;
    this.selectedData = undefined;
    this.totalAmount = 0;
    
    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort;

  }
  displayRecords2(){
    var data = this.saleDetails;
    this.totalAmount = 0;
    data.forEach(x => {
      this.totalAmount += +x.Amount;
    });
    this.listData2 =  new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;
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
    this.onClickViewDetails();
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
    this.toolBoxService.onHome();
  }

}
