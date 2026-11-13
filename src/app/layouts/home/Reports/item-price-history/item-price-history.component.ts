import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ItemPriceHistoryService } from '../../../../services/Reports/item-price-history.service';
import { ToolBoxService } from '../../../../services/tool-box.service';
import { DateTimesService } from '../../../../services/date-times.service';
import { ColumnTypeConfig, MatTableService } from '../../../../services/mat-table.service';
import { PrintService } from '../../../../services/print.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../services/notification.service';
import { firstValueFrom } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-item-price-history',
  templateUrl: './item-price-history.component.html',
  styleUrls: ['./item-price-history.component.css']
})
export class ItemPriceHistoryComponent implements OnInit {
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
  
  defaultColumns   = ['UM','Price', 'Qty', 'Amount'];
  defaultColumns2   = ['TransDate','TransNo', 'CustomerName', 'UM','Price', 'Qty', 'Conversion', 'TotalQty', 'Amount'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Price', 'Qty', 'Amount', 'Conversion', 'TotalQty',],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  constructor(
    private itemPriceHistoryService        : ItemPriceHistoryService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private notificationService : NotificationService,
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
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
      this.data = await firstValueFrom(this.itemPriceHistoryService.getItemPriceHistoryByDateFromByDateToByWithDateByItemId(
        this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateTo)),
        this.filteredData.withDate,
        this.filteredData.itemName,
        this.filteredData.branchId,
      ));
    }
    if(this.filteredData.filterType?.toLowerCase() == 'details'){
      this.data = await firstValueFrom(this.itemPriceHistoryService.getItemPriceHistoryDetailsByDateFromByDateToByWithDateByItemId(
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
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printitempricehistory']));
    var data  = this.listData.filteredData;
    var title = this.filteredData.branchName +' '+this.filteredData.itemName.toUpperCase() +' PRICE HISTORY -  ' +this.filteredData.filterType.toUpperCase() ;
    if(this.filteredData.withDate )
      title = this.filteredData.branchName +' '+this.filteredData.itemName.toUpperCase() +' PRICE HISTORY -  ' +this.filteredData.filterType.toUpperCase()  + this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.filteredData.dateTo))  ;
    this.printService.popupWindow(url, 'printitempricehistory', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('FilteredData', JSON.stringify(this.filteredData));
  }

}
