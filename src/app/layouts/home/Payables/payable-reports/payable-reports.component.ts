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
import { PayableReportsService } from 'src/app/services/Payables/payable-reports.service';
import { PayableStatementsService } from 'src/app/services/Payables/payable-statements.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-payable-reports',
  templateUrl: './payable-reports.component.html',
  styleUrls: ['./payable-reports.component.css']
})
export class PayableReportsComponent implements OnInit {

payableReports : any=[];
  suppliers:any [];
  supplierId:string = 'All';
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
    defaultColumns    = ['SupplierName','TotalDue', 'AmountPaid', 'Balance'];
    defaultColumns2    = ['SupplierName', 'ContactNo', 'Address','SourceTransNo','TransDate', 'DueDate','TotalDue', 'AmountPaid', 'Balance'];

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
      private payableReportsService        : PayableReportsService,
      private payableStatementsService        : PayableStatementsService,
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
      this.getSuppliers();
      this.toolBoxService.disableButtons(this.toolButtons, this.contextButtons, null, null);
    }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

    async getSuppliers(){
      this.suppliers = await firstValueFrom(this.payableStatementsService.loadSupplierWithAllWithBalance('true', 'true'));
    }
    emptyTable()
    {
      this.listData =  new MatTableDataSource([]);
      this.listData.paginator = this.paginator;
      this.listData.sort = this.sort;
    }
    
    async onClickView(){
      this.isLoading = true;
      this.payableReports = await firstValueFrom(this.payableReportsService.getPayableReportsBySupplierIdByDateFromByDateToByWithDate(
        this.supplierId,
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
        this.withDate, 
      ));
      if(this.payableReports)
        this.isLoading = false;
      this.displayRecords();
    }
  
    displayRecords(){
      var data = this.payableReports;
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
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpayablereports']));
      var data  = this.listData.filteredData;
      var supplier = this.suppliers.find(x => x.SupplierId == this.supplierId);
      var supplierName = supplier ? supplier.SupplierName : this.supplierId;

      if(this.supplierId.toLowerCase() == 'all')
          var title = 'ALL SUPPLIERS BALANCE';
      else
          title = supplierName.toUpperCase()+ ' STATEMENT OF ACCOUNT';

      if(this.withDate)
          title +=  ' FROM ' +this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)) 

      this.printService.popupWindow(url, 'printpayablereports', window, 800, 800);
      localStorage.setItem('Data', JSON.stringify(data));
      localStorage.setItem('SupplierId', this.supplierId);
      localStorage.setItem('Title', title);
    }
}
