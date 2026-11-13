import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MenuReportsService } from 'src/app/services/Menus/menu-reports.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ColumnTypeConfig, MatTableService } from 'src/app/services/mat-table.service';

// Desktop Mariosoft.Costing.UI MenuSalesReportUI: "Menu Sales Report" and "Ingredient Sales Report" tabs.
@Component({
  selector: 'app-menu-sales-report',
  templateUrl: './menu-sales-report.component.html',
  styleUrls: ['../menus-shared.css']
})
export class MenuSalesReportComponent implements OnInit {
  menuDateFrom        : any = new Date();
  menuDateTo          : any = new Date();
  ingredientDateFrom  : any = new Date();
  ingredientDateTo    : any = new Date();
  menuData            : MatTableDataSource<any>;
  ingredientData      : MatTableDataSource<any>;
  menuSearchKey       : string;
  ingredientSearchKey : string;
  isLoadingMenu       : boolean = false;
  isLoadingIngredient : boolean = false;
  pageSizeOptions     : any = this.matTableService.pageSizeOptions();
  menuColumns         = ['ItemName', 'ItemType', 'Category', 'UM', 'Qty', 'Amount', 'AveCostAmount', 'Profit'];
  ingredientColumns   = ['ItemName', 'UM', 'Cost', 'BegBalance', 'StockIn', 'StockOut', 'TotalCost', 'EndBalance'];
  labels              : { [key: string]: string } = { 'AveCostAmount': 'Cost', 'StockOut': 'Used' };
  columnConfig        : ColumnTypeConfig = {
    decimalColumns: ['Qty', 'Amount', 'AveCostAmount', 'Profit', 'Cost', 'BegBalance', 'StockIn', 'StockOut', 'TotalCost', 'EndBalance'],
    intColumns: [], dateTimeColumns: [], dateColumns: []
  };
  columnTypeMap       : { [key: string]: string } = {};

  // the tab bodies are created when shown, so the paginators attach whenever they appear
  private _menuPaginator: MatPaginator;
  private _ingredientPaginator: MatPaginator;
  @ViewChild('menuPaginator') set menuPaginator(p: MatPaginator) {
    this._menuPaginator = p;
    if (this.menuData) this.menuData.paginator = p;
  }
  @ViewChild('ingredientPaginator') set ingredientPaginator(p: MatPaginator) {
    this._ingredientPaginator = p;
    if (this.ingredientData) this.ingredientData.paginator = p;
  }

  constructor(
    private menuReportsService  : MenuReportsService,
    private dateTimesService    : DateTimesService,
    private notificationService : NotificationService,
    private router              : Router,
    private printService        : PrintService,
    private matTableService     : MatTableService,
  ) { }

  ngOnInit(): void {
    [...this.menuColumns, ...this.ingredientColumns].forEach(c => this.columnTypeMap[c] = this.matTableService.getColumnType(c, this.columnConfig));
  }

  applyFilter(listData: MatTableDataSource<any>, key: string){
    if (listData) this.matTableService.applyFilter(listData, key || '');
  }

  clearSearch(listData: MatTableDataSource<any>){
    return listData ? this.matTableService.clearSearch(listData) : '';
  }

  private fmt(date: any){
    return this.dateTimesService.ConvertToDateFormat(new Date(date));
  }

  sum(rows: any[], key: string){
    return (rows || []).reduce((total, row) => total + (+row[key] || 0), 0);
  }

  async onClickGoMenu(){
    this.isLoadingMenu = true;
    try {
      var rows: any = await firstValueFrom(this.menuReportsService.getMenuSalesReport(this.fmt(this.menuDateFrom), this.fmt(this.menuDateTo)));
      this.menuData = new MatTableDataSource(rows);
      this.menuData.paginator = this._menuPaginator;
      this.applyFilter(this.menuData, this.menuSearchKey);
    } catch (err: any) {
      this.notificationService.toastrError(err?.error?.message || 'Unable to load the report.');
    } finally {
      this.isLoadingMenu = false;
    }
  }

  async onClickGoIngredient(){
    this.isLoadingIngredient = true;
    try {
      var rows: any = await firstValueFrom(this.menuReportsService.getIngredientSalesReport(this.fmt(this.ingredientDateFrom), this.fmt(this.ingredientDateTo)));
      this.ingredientData = new MatTableDataSource(rows);
      this.ingredientData.paginator = this._ingredientPaginator;
      this.applyFilter(this.ingredientData, this.ingredientSearchKey);
    } catch (err: any) {
      this.notificationService.toastrError(err?.error?.message || 'Unable to load the report.');
    } finally {
      this.isLoadingIngredient = false;
    }
  }

  private print(title: string, columns: any[], data: any[], totalKeys: string[]){
    var totals: any = {};
    totalKeys.forEach(k => totals[k] = this.sum(data, k));
    var url = this.router.serializeUrl(this.router.createUrlTree(['print/printdatalist']));
    localStorage.setItem('PrintDataList', JSON.stringify({ 'Title': title, 'Columns': columns, 'Data': data, 'Totals': totals }));
    this.printService.popupWindow(url, 'MenuSalesReport', window, 1000, 800);
  }

  onClickPrintMenu(){
    if (!this.menuData) return;
    this.print('MENU SALES REPORT FROM ' + this.fmt(this.menuDateFrom) + ' TO ' + this.fmt(this.menuDateTo), [
      { 'Key': 'ItemName', 'Label': 'ItemName' },
      { 'Key': 'ItemType', 'Label': 'ItemType' },
      { 'Key': 'Category', 'Label': 'Category' },
      { 'Key': 'Qty', 'Label': 'Qty', 'Type': 'decimal' },
      { 'Key': 'Amount', 'Label': 'Amount', 'Type': 'decimal' },
      { 'Key': 'AveCostAmount', 'Label': 'Cost', 'Type': 'decimal' },
      { 'Key': 'Profit', 'Label': 'Profit', 'Type': 'decimal' },
    ], this.menuData.filteredData, ['Qty', 'Amount', 'AveCostAmount', 'Profit']);
  }

  onClickPrintIngredient(){
    if (!this.ingredientData) return;
    this.print('INGREDIENT SALES REPORT FROM ' + this.fmt(this.ingredientDateFrom) + ' TO ' + this.fmt(this.ingredientDateTo), [
      { 'Key': 'ItemName', 'Label': 'Ingredient' },
      { 'Key': 'UM', 'Label': 'UM' },
      { 'Key': 'Cost', 'Label': 'Cost', 'Type': 'decimal' },
      { 'Key': 'BegBalance', 'Label': 'BegBalance', 'Type': 'decimal' },
      { 'Key': 'StockIn', 'Label': 'StockIn', 'Type': 'decimal' },
      { 'Key': 'StockOut', 'Label': 'Used', 'Type': 'decimal' },
      { 'Key': 'TotalCost', 'Label': 'TotalCost', 'Type': 'decimal' },
      { 'Key': 'EndBalance', 'Label': 'EndBalance', 'Type': 'decimal' },
    ], this.ingredientData.filteredData, ['TotalCost']);
  }
}
