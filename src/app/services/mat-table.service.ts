import { Injectable, ViewChild , LOCALE_ID, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from './notification.service';
import { formatDate, formatNumber } from '@angular/common';
import { AuthService } from './auth.service';

export interface ColumnTypeConfig {
  decimalColumns?: string[];
  intColumns?: string[];
  dateTimeColumns?: string[];
  dateColumns?: string[];
}


@Injectable({
  providedIn: 'root'
})
export class MatTableService {
  constructor(
    private notificationService : NotificationService,
     private authService: AuthService,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  applyFilter(listData: MatTableDataSource<any>, searchKey: string) {
    listData.filter = (searchKey || '').trim().toLowerCase();
  }
  
  clearSearch(listData: MatTableDataSource<any>){
    this.applyFilter(listData, "");
    return "";
  }

  pageSizeOptions(){
    return [5,10,15,25,50,100,500,1000];
  }

  checkNull(selectedId: any): boolean {
    if (!selectedId) {
      this.notificationService.toastrWarning('No Record Selected.');
      return false;
    }
    return true;
  }

  clearList(listData: MatTableDataSource<any>){
    listData.data = [];
  }

  getColumnType(col: string, config: ColumnTypeConfig): 'date' | 'datetime' | 'decimal' | 'int' | 'text' {
    if (config.decimalColumns?.includes(col)) return 'decimal';
    if (config.intColumns?.includes(col)) return 'int';
    if (config.dateTimeColumns?.includes(col)) return 'datetime';
    if (config.dateColumns?.includes(col)) return 'date';
    return 'text';
  }

  getRowClasses(dc: string, type: string, element: any): { [key: string]: boolean } {
    return {
      [type]: true,
      'data-green-text': dc === 'UM' && element['HasMultipleUMs'] === 'yes',
      'mat-column-number': type === 'int' || type === 'decimal',
    };
  }

  getTotal(column,listData: MatTableDataSource<any>){
    let sum = 0;
    listData?.filteredData.forEach(x => {
      sum += +x[column];
    });
    return sum;
  }

  getRowDisplayTransform(dc: string, type: string, element: any): string {
    const value = element[dc];
    if (value === null || value === undefined) {
      return '';
    }

    switch (type) {
      case 'date':
        return value ? formatDate(value, 'MM/dd/yyyy', this.locale) : '';
      case 'datetime':
        return value ? formatDate(value, 'MM/dd/yyyy hh:mm a', this.locale) : '';
      case 'decimal':
        return formatNumber(value, this.locale, '1.2-2');
      case 'int':
        return formatNumber(value, this.locale, '1.0-0');
      case 'text':
      default:
        return value;
    }
  }
      CommonTransaction(): boolean {
      var accessRight = this.authService.UserAccount?.AccessRightName?.toLowerCase();
      if (accessRight === 'commonadmin') {
        this.notificationService.toastrWarning('Common Admin has viewing and editing access only.');
        return false;
      }
      return true;
    }
}
