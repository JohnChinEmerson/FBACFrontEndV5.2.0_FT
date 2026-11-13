import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CustomerChecksService } from 'src/app/services/CustomerChecks/customer-checks.service';
import { HelperService } from 'src/app/services/helper.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { CustomerChecksReportService } from 'src/app/services/CustomerChecks/customer-checks-report.service';
import { SupplierChecksReportService } from 'src/app/services/SupplierChecks/supplier-checks-report.service';
@Component({
  selector: 'app-check-reports-ui',
  templateUrl: './check-reports-ui.component.html',
  styleUrls: ['./check-reports-ui.component.css']
})
export class CheckReportsUIComponent implements OnInit {
    years :any; 
    months :any; 
    year :any = new Date().getFullYear(); 
    checkType: string = 'Customer';
    checkTypes = [
      { value: 'Customer', label: 'CustomerChecks' },
      { value: 'Supplier', label: 'SupplierChecks' }
    ];
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
    customerColumns = ['Month','Unpaid','Undeposited','Deposited','TotalAmount'];
    supplierColumns = ['Month','Unreleased','Released','Cleared','TotalAmount'];
    defaultColumns = [...this.customerColumns];

    columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Unpaid',  'Undeposited','Deposited','Unreleased','Released','Cleared','TotalAmount'],
      intColumns: [],
      dateTimeColumns: [],
      dateColumns: []
    };

    columnTypeMap: { [key: string]: string } = {};
  
    constructor(
      private helperService : HelperService,
      private customerChecksReportService : CustomerChecksReportService,
      private supplierChecksReportService : SupplierChecksReportService,
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
      try{
        if(this.checkType == "Customer"){
          this.data = await firstValueFrom(this.customerChecksReportService.getCustomerChecksReportByYear(this.year));
        }else{
          this.data = await firstValueFrom(this.supplierChecksReportService.getSupplierChecksReportByYear(this.year));
        }
        
      this.displayRecords();
      }finally{
        this.isLoading = false;
      }
    }
  
    displayRecords(){
      var data = this.data;
       this.listData =  new MatTableDataSource(data);
       this.listData.paginator = this.paginator;
       this.listData.sort = this.sort;
    
    }
    onCheckTypeChange() {
    if (this.checkType === 'Customer') {
      this.defaultColumns = [...this.customerColumns];
    } else {
      this.defaultColumns = [...this.supplierColumns];
    }
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.data = [];
    this.displayRecords();
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
  var url = this.router.serializeUrl(this.router.createUrlTree(['print/printchecksreport']));
  var data = this.listData.filteredData;
  var title = this.checkType === 'Customer' ? 'MONTHLY CUSTOMER CHECKS FOR THE YEAR ' + this.year : 'MONTHLY SUPPLIER CHECKS FOR THE YEAR ' + this.year;
  localStorage.setItem('Data', JSON.stringify(data));
  localStorage.setItem('Title', title);
  localStorage.setItem('CheckType', this.checkType);
  this.printService.popupWindow(url,'printchecksreport',window,800,800);
}
}
