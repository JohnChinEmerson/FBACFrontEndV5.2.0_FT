import { Component, OnInit, ViewChild } from '@angular/core';
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
import { CustomerLedgerService } from 'src/app/services/Receivables/customer-ledger.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { ReceivableStatementsService } from 'src/app/services/Receivables/receivable-statements.service';

@Component({
  selector: 'app-customer-ledger',
  templateUrl: './customer-ledger.component.html',
  styleUrls: ['./customer-ledger.component.css']
})
export class CustomerLedgerComponent implements OnInit {
  customerLedger : any=[];
  customers : any;
  customerId : any;
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  lblPreviousBalance : string =  "Previous Balance : 0.00";
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
  
  defaultColumns    = ['TransDate','TransName','TransNo','DebitAmt', 'CreditAmt', 'Balance'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['DebitAmt', 'CreditAmt', 'Balance'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private customerLedgerService        : CustomerLedgerService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private receivableStatementsService : ReceivableStatementsService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.loadCustomers();
    this.toolBoxService.disableButtons(this.toolButtons, null, null, null);
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async loadCustomers(){
    this.customers = await firstValueFrom(this.receivableStatementsService.loadCustomerWithAllWithBalance(false, false));
    this.customerId = this.customers[0].CustomerId;
  }
  async onClickView(){
    this.isLoading = true;
   var data:any = await firstValueFrom(this.customerLedgerService.getCustomerLedgerByCustomerIdByDateFromByDateTo(
      this.customerId,
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
    ));
    this.customerLedger = data[0];
    this.lblPreviousBalance = data[1];
    if(this.customerLedger)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.customerLedger;
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
  getTotal(column){
    let sum = 0;
    this.listData?.filteredData.forEach((x, index, array)=> {
      sum += Number(+x[column]);
      if (column === 'Balance' && index === array.length - 1) {
        sum = x[column];
      }
    });
    return sum;
  }
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcustomerledger']));
    var data  = this.listData.filteredData;
    var customer = this.customers.find(x => x.CustomerId == this.customerId);
    var customerName = customer ? customer.CustomerName : this.customerId;
    var title = customerName.toUpperCase()+' CUSTOMER LEDGER FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)) + ' | '+this.lblPreviousBalance ;
    this.printService.popupWindow(url, 'printcustomerledger', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }
}
