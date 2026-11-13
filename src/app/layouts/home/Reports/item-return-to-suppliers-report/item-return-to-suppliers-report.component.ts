import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { HomeComponent } from '../../home.component';
import { ItemReturnToSuppliersService } from 'src/app/services/Reports/item-return-to-suppliers.service';

@Component({
  selector: 'app-item-return-to-suppliers-report',
  templateUrl: './item-return-to-suppliers-report.component.html',
  styleUrls: ['./item-return-to-suppliers-report.component.css']
})
export class ItemReturnToSuppliersReportComponent implements OnInit {
@Input() filteredData: any = [];
  data :any ;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  defaultColumns    = ['SupplierId', 'SupplierName','Reason','Qty', 'Discount','Amount'];
  defaultColumns2    = ['TransDate','TransNo', 'SupplierName','Reason', 'ItemName', 'UM','Qty', 'Cost', 'Discount', 'Amount'];
  defaultColumns3   = ['TransDate','TransNo', 'SupplierName','Reason', 'UM','Qty', 'Cost', 'Discount', 'Amount'];

  columnConfig: ColumnTypeConfig = {
  decimalColumns: ['Qty', 'Cost', 'Discount', 'Amount'],
  intColumns: [],
  dateTimeColumns: [],
  dateColumns: ['TransDate']
};

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  columnTypeMap3: { [key: string]: string } = {};


  constructor(
    private itemReturnToSuppliersService        : ItemReturnToSuppliersService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private notificationService : NotificationService,
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.columnTypeMap3 = this.buildColumnTypeMap(this.defaultColumns3);
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
    if(this.filteredData.filterType?.toLowerCase() == 'summary'){
      this.data = await firstValueFrom(this.itemReturnToSuppliersService.getItemReturnToSuppliersByDateFromByDateToByWithDateByItemId(
        this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateTo)),
        this.filteredData.withDate,
        this.filteredData.itemName,
        this.filteredData.branchId,
      ));
    }
    if(this.filteredData.filterType?.toLowerCase() == 'details'){
      this.data = await firstValueFrom(this.itemReturnToSuppliersService.getItemReturnToSupplierDetailsByDateFromByDateToByWithDateByItemId(
        this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateTo)),
        this.filteredData.withDate,
        this.filteredData.itemName,
        this.filteredData.branchId,
      ));
    }
   
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
  


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filteredData'] && changes['filteredData'].currentValue) {
      this.onClickView();
    }
  }
  getTotal(column){
    let sum = 0;
    this.listData?.filteredData.forEach(x => {
      sum += +x[column];
    });
    return sum;
  }


  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printitemreturntosuppliers']));
    var data  = this.listData.filteredData;
    var title = this.filteredData.branchName +' '+this.filteredData.itemName.toUpperCase() +' RETURN TO SUPPLIERS -  ' +this.filteredData.filterType.toUpperCase() ;
    if(this.filteredData.withDate )
      title = this.filteredData.branchName +' '+this.filteredData.itemName.toUpperCase() +' RETURN TO SUPPLIERS -  ' +this.filteredData.filterType.toUpperCase()  + this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateTo))  ;
    this.printService.popupWindow(url, 'printitemreturntosuppliers', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('FilteredData', JSON.stringify(this.filteredData));
  }
}
