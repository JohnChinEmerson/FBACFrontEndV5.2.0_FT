import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../../home.component';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { CustomerSalesReportService } from 'src/app/services/Sales/customer-sales-report.service';

@Component({
  selector: 'app-sales-customer-sales-report',
  templateUrl: './sales-customer-sales-report.component.html',
  styleUrls: ['./sales-customer-sales-report.component.css']
})
export class SalesCustomerSalesReportComponent implements OnInit {
  @Input() branchId: any = [];
  saleHeaders     : any=[];
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
  customers:any;
  customerId:any;
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

  defaultColumns = ['TransDate','TransNo','TotalSales','DiscountAmount', 'WHTaxAmount', 'VATAmount','LessVAT','DeliveryFee', 'AdvancePayment', 'RebatePaid',  'TotalDue'];
  defaultColumns2 = ['TransDate','TransNo', 'ItemName', 'UM','Price', 'Qty',  'Discount','Amount'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalSales','DiscountAmount', 'WHTaxAmount', 'VATAmount','LessVAT','DeliveryFee', 'AdvancePayment', 'RebatePaid',  'TotalDue','Price', 'Qty',  'Discount','Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  
  constructor(
    private dialog                        : MatDialog,
    private customerSalesReportService        : CustomerSalesReportService,
    private toolBoxService                : ToolBoxService,
    private dateTimesService              : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private notificationService : NotificationService,
    private customersService : CustomersService,
    private stringHelperService : StringHelperService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
    this.getCBOCustomers();
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

  async getCBOCustomers(){
    this.customers = await firstValueFrom(this.customersService.getCBOCustomers());
    this.customers.push(this.stringHelperService.withCASHCustomerCBO());
    this.customerId = this.customers[0].CustomerId;
  }
  async getfilterBys(){
    this.filterBys = ['ITEMS', 'RECEIPTS'];
  }

  async onClickView(){
    this.isLoading = true;
    this.saleHeaders = await firstValueFrom(this.customerSalesReportService.getCustomerSalesReportByCustomerIdByDateFromByDateToByFilter(
      this.customerId, 
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      this.filterBy,
      this.branchId
    ));
    if(this.saleHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.saleHeaders;
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
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcustomersalesreport']));
    var data  = this.listData.filteredData;
    var customer:any = await firstValueFrom(this.customersService.getCustomerByCustomerId(this.customerId));

    var title = customer.CustomerName+' '+ this.filterBy.toUpperCase()+'  FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'PrintCustomerSalesReport', window, 800, 800);
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
