import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { SupplierReceivingReportService } from 'src/app/services/Receiving/supplier-receiving-report.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../../home.component';

@Component({
  selector: 'app-receiving-supplier-receiving-report',
  templateUrl: './receiving-supplier-receiving-report.component.html',
  styleUrls: ['./receiving-supplier-receiving-report.component.css']
})
export class ReceivingSupplierReceivingReportComponent implements OnInit {

  receivingHeaders     : any=[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  filterBys:any;
  filterBy:string = 'RECEIPTS';
  suppliers:any;
  supplierId:any;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
  ];  
  contextButtons     = [
  ];
  defaultColumns = ['TransDate', 'TransNo','TotalAmount','DiscountAmount', 'WHTaxAmount', 'VATAmount','DeliveryFee', 'POPayment', 'TotalDue'];
  defaultColumns2 = ['TransDate', 'TransNo', 'ItemName', 'UM','Cost', 'Qty',  'Discount','Amount' ];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalAmount','DiscountAmount', 'WHTaxAmount', 'VATAmount','DeliveryFee', 'POPayment', 'TotalDue','Cost', 'Qty',  'Discount','Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

  constructor(
    private dialog                        : MatDialog,
    private supplierReceivingReportService        : SupplierReceivingReportService,
    private toolBoxService                : ToolBoxService,
    private dateTimesService              : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private notificationService : NotificationService,
    private suppliersService : SuppliersService,
    private stringHelperService : StringHelperService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
    this.getCBOSuppliers();
    this.getfilterBys();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, null, null);
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getCBOSuppliers(){
    this.suppliers = await firstValueFrom(this.suppliersService.getCBOSuppliers());
    this.supplierId = this.suppliers[0].SupplierId;
  }
  async getfilterBys(){
    this.filterBys = ['ITEMS', 'RECEIPTS'];
  }

  async onClickView(){
    this.isLoading = true;
    this.receivingHeaders = await firstValueFrom(this.supplierReceivingReportService.getSupplierReceivingReportBySupplierIdByDateFromByDateToByFilter(
      this.supplierId, 
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      this.filterBy
    ));
    if(this.receivingHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.receivingHeaders;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  emptyTable(){
    this.listData =  new MatTableDataSource([]);
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

  getTotal(column){
    let sum = 0;
    this.listData?.filteredData.forEach(x => {
            sum += +x[column];
    });
    return sum;
  }

 async onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsupplierreceivingreport']));
    var data  = this.listData.filteredData;
    var supplier:any = await firstValueFrom(this.suppliersService.getSupplierBySupplierId(this.supplierId));

    var title = supplier.SupplierName+' '+ this.filterBy.toUpperCase()+'  FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'PrintSupplierReceivingReport', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('FilterBy', this.filterBy);
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
