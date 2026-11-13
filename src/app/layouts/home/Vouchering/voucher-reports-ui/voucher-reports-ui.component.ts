import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HelperService } from 'src/app/services/helper.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { VoucherReportsService } from 'src/app/services/Vouchering/voucher-reports.service';

@Component({
  selector: 'app-voucher-reports-ui',
  templateUrl: './voucher-reports-ui.component.html',
  styleUrls: ['./voucher-reports-ui.component.css']
})
export class VoucherReportsUIComponent implements OnInit {

    years :any; 
    months :any; 
    year :any = new Date().getFullYear(); 
    data : any;
    searchKey       : string = "";
    
    listData        : MatTableDataSource<any>;
    pageSizeOptions :any = this.matTableService.pageSizeOptions();
    isLoading       : boolean = false;
  
    @ViewChild(MatSort) sort              : MatSort;
    @ViewChild(MatPaginator) paginator    : MatPaginator;  
    @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
    
    contextMenuPosition = { x: '0px', y: '0px' };
    toolButtons     = [
      {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
      {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
    ];
    contextButtons  =  [];
    defaultColumns  = ['Month','Purchasing',  'Receiving','Expenses','SupplierPayments', 'TotalAmount'];
    columnConfig: ColumnTypeConfig = {
      decimalColumns: ['Purchasing',  'Receiving','Expenses','SupplierPayments', 'TotalAmount'],
      intColumns: [],
      dateTimeColumns: [],
      dateColumns: []
    };
    columnTypeMap: { [key: string]: string } = {};

    constructor(
      private helperService : HelperService,
      private voucherReportsService : VoucherReportsService,
      private toolBoxService      : ToolBoxService,
      public matTableService     : MatTableService,
      private printService        : PrintService,
      private router              : Router,
      private homeTs              : HomeComponent,
    ) { }
  
    async ngOnInit(): Promise<void> {
      this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
      await this.homeTs.getButtons();
      this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
      this.getYears();
    }

    private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
      const map: { [key: string]: string } = {};
      for (const col of columns) {
        map[col] = this.matTableService.getColumnType(col, this.columnConfig);
      }
      return map;
    }

  
    async getYears(){
      this.years = await firstValueFrom(this.helperService.getYears());
    }
 
    async onClickView(){
      this.isLoading = true;
      this.data = await firstValueFrom(this.voucherReportsService.getVoucherReportByYear(this.year));
      if(this.data)
        this.isLoading = false;
      this.displayRecords();
    }
  
    displayRecords(){
      var data = this.data;
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
  
    getTotal(column){
      let sum = 0;
       this.listData?.filteredData.forEach(x => {
         sum += +x[column];
       });
      return sum;
    }
  
    onClickPrint(){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printvoucherreports']));
      var data  = this.listData.filteredData;
 
      var title  = 'MONTHLY VOUCHERS FOR THE YEAR '+this.year;
      this.printService.popupWindow(url, 'printvoucherreports', window, 800, 800);
      localStorage.setItem('Data', JSON.stringify(data));
      localStorage.setItem('Title', title);
    }

}
