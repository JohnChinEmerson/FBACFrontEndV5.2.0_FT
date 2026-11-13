import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DeliveryDetailsService } from 'src/app/services/Delivery/delivery-details.service';
import { ItemCategorysService } from 'src/app/services/Files/item-categorys.service';
import { ItemsService } from 'src/app/services/Files/items.service';
import { HelperService } from 'src/app/services/helper.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-delivery-reports',
  templateUrl: './delivery-reports.component.html',
  styleUrls: ['./delivery-reports.component.css']
})
export class DeliveryReportsComponent implements OnInit {
  years :any; 
   months :any; 
   month :any  ='All'; 
   items :any; 
   item :any; 
   year :any = new Date().getFullYear(); 
   categorys:any;
   category:string = 'All';
   data : any;
   searchKey       : string = "";
   listData        : MatTableDataSource<any[]>;
   listData2        : MatTableDataSource<any[]>;
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


   // Table 1: month == 'All' — months are dynamic, so this starts with just 'Description'
   // and gets the fetched month names appended in ngOnInit.
   defaultColumns  = ['Description'];

   // Table 2: month != 'All' && item == 'All'
   defaultColumns2  = ['ItemName', 'UM', 'Category', 'Price', 'Qty', 'Amount'];

   // Table 3: month != 'All' && item != 'All'
   defaultColumns3  = ['Date', 'Qty', 'Amount'];

   columnConfig: ColumnTypeConfig = {
     decimalColumns: ['Price', 'Qty', 'Amount'],
     intColumns: [],
     dateTimeColumns: [],
     dateColumns: ['Date']
   };
   columnTypeMap: { [key: string]: string } = {};
   columnTypeMap2: { [key: string]: string } = {};
   columnTypeMap3: { [key: string]: string } = {};

   constructor(
     private helperService : HelperService,
     private deliveryDetailsService : DeliveryDetailsService,
     private stringHelperService : StringHelperService,
     private categorysService : ItemCategorysService,
     private itemsService : ItemsService,
     private notificationService : NotificationService,
     private toolBoxService      : ToolBoxService,
     public matTableService     : MatTableService,
     private printService        : PrintService,
     private router              : Router,
     private homeTs              : HomeComponent,
   ) { }
 
   async ngOnInit(): Promise<void> {
     this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
     this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
     this.columnTypeMap3 = this.buildColumnTypeMap(this.defaultColumns3);
     await this.getMonths();
     await this.homeTs.getButtons();
     this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
     this.getYears();
     this.getCategorys();
   }

   private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
     const map: { [key: string]: string } = {};
     for (const col of columns) {
       map[col] = this.matTableService.getColumnType(col, this.columnConfig);
     }
     return map;
   }
 
  async getMonths(){
     var monthNames = await firstValueFrom(this.helperService.getMonths());
     this.defaultColumns = this.defaultColumns.concat(monthNames).concat('Total');
     this.columnConfig.decimalColumns = this.columnConfig.decimalColumns.concat(monthNames).concat('Total');

     this.months = await firstValueFrom(this.helperService.getMonthsWithValue());
     this.months.push(this.stringHelperService.all());
     this.month = 'All';
   }

   async getItemNames(){
    this.items = await firstValueFrom(this.itemsService.getCBOItemsByCategory(this.category));
    this.items.push(this.stringHelperService.allItemNameCBO());
    this.item = 'All';
  }
 
   async getYears(){
     this.years = await firstValueFrom(this.helperService.getYears());
   }
 
   async getCategorys(){
     this.categorys = await firstValueFrom(this.categorysService.getCBOCategorys());
     this.categorys.push(this.stringHelperService.allCategoryCBO());
     this.category  = 'All';

     this.getItemNames();
   }
 
   async onChangeAdjustmentType(){
     await this.getCategorys();
   }

   async onClickView(){
     this.isLoading = true;
 
     if (this.month.toString().toLowerCase() == "all"){
        this.data = await firstValueFrom(this.deliveryDetailsService.getDeliveryDetailsReportByYearByCategory(this.year,  this.category));
        this.displayRecords();
      }
    else{
      this.data = await firstValueFrom(this.deliveryDetailsService.getDeliveryDetailsReportByYearByMonthByCategoryByItemId(this.year, this.month, this.category, this.item));
      this.displayRecords2();
    }
    this.isLoading = false;
   }
 
   displayRecords(){
     var data = this.data;
     this.listData =  new MatTableDataSource(data);
     this.listData.paginator = this.paginator;
     this.listData.sort = this.sort;
   }

   displayRecords2(){
    var data = this.data;
    this.listData2 =  new MatTableDataSource(data);
    this.listData2.paginator = this.paginator;
    this.listData2.sort = this.sort;
  }

  onChangeItemName(){
    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator;
    this.listData2.sort = this.sort;
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
   getTotal2(column){
    let sum = 0;
    this.listData2?.filteredData.forEach(x => {
            sum += +x[column];
    });
    return sum;
  }
   onClickPrint(){
     var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printdeliveryreport']));
     var data  = this.listData.filteredData;
     var title  = this.category.toUpperCase()+' ITEMS QTY DELIVERY FOR THE YEAR '+this.year;

     if(this.month.toString().toLowerCase() != 'all'){
        data  = this.listData2.filteredData;
        if(this.item.toLowerCase() == 'all'){
          title  = this.category.toUpperCase()+' DELIVERY AS OF '+this.month+'/'+this.year;
        }
        else{
          title  = this.item.toUpperCase()+' DELIVERY AS OF '+this.month+'/'+this.year;
        }
     }
     this.printService.popupWindow(url, 'printdeliveryreport', window, 800, 800);
     localStorage.setItem('Data', JSON.stringify(data));
     localStorage.setItem('NumberColumns', JSON.stringify(this.columnConfig.decimalColumns));
     localStorage.setItem('Title', title);
     localStorage.setItem('Category', this.category);
     localStorage.setItem('ItemId', this.item);
     localStorage.setItem('Month', this.month);
   }

}
