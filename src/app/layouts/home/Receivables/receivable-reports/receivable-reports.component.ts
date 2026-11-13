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
import { ReceivableReportsService } from 'src/app/services/Receivables/receivable-reports.service';
import { ReceivableStatementsService } from 'src/app/services/Receivables/receivable-statements.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-receivable-reports',
  templateUrl: './receivable-reports.component.html',
  styleUrls: ['./receivable-reports.component.css']
})
export class ReceivableReportsComponent implements OnInit {
  receivableReports : any=[];
  customers:any [];
  customerId:string = 'All';
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  withDate : boolean = false;
    @ViewChild(MatSort) sort              : MatSort;
    @ViewChild(MatPaginator) paginator    : MatPaginator;  
    @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  
    contextMenuPosition = { x: '0px', y: '0px' };
    toolButtons     = [
      {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
      {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
    ];  

    contextButtons     = [
    ];
    defaultColumns    = ['CustomerName', 'TotalDue', 'AmountPaid', 'Balance'];
    defaultColumns2    = ['CustomerName', 'ContactNo', 'Address','SourceTransNo','TransDate', 'DueDate','TotalDue', 'AmountPaid', 'Balance'];
    columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue', 'AmountPaid', 'Balance'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate', 'DueDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

    constructor(
      private dialog              : MatDialog,
      private receivableReportsService        : ReceivableReportsService,
      private receivableStatementsService        : ReceivableStatementsService,
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
      this.getCustomers();
      this.toolBoxService.disableButtons(this.toolButtons, this.contextButtons, null, null);
    }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

    async getCustomers(){
      this.customers = await firstValueFrom(this.receivableStatementsService.loadCustomerWithAllWithBalance('true', 'true'));
    }
    emptyTable()
    {
      this.listData =  new MatTableDataSource([]);
      this.listData.paginator = this.paginator;
      this.listData.sort = this.sort;
    }
    
    async onClickView(){
      this.isLoading = true;
      this.receivableReports = await firstValueFrom(this.receivableReportsService.getReceivableReportsByCustomerIdByDateFromByDateToByWithDate(
        this.customerId,
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
        this.withDate, 
      ));
      if(this.receivableReports)
        this.isLoading = false;
      this.displayRecords();
    }
  
    displayRecords(){
      var data = this.receivableReports;
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
      this.selectedId = data.SourceTransNo;
      this.selectedData = data;
    }


    getTotal(column){
      let sum = 0;
        this.listData?.filteredData.forEach(x => {
          sum += +x[column];
        });
       return sum;
     }
    onClickPrint(){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivablereports']));
      var data  = this.listData.filteredData;
      var customer = this.customers.find(x => x.CustomerId == this.customerId);
      var customerName = customer ? customer.CustomerName : this.customerId;

      if(this.customerId.toLowerCase() == 'all')
          var title = 'ALL CUSTOMERS BALANCE';
      else
          title = customerName.toUpperCase()+ ' STATEMENT OF ACCOUNT';

      if(this.withDate)
          title +=  ' FROM ' +this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)) 

      this.printService.popupWindow(url, 'printreceivablereports', window, 800, 800);
      localStorage.setItem('Data', JSON.stringify(data));
      localStorage.setItem('CustomerId', this.customerId);
      localStorage.setItem('Title', title);
    }
}
