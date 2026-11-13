import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateZReadingsService } from 'src/app/services/BIR/date-zreadings.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { SaleDetailUIComponent } from '../../Sales/sale-detail-ui/sale-detail-ui.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-zreadings-ui',
  templateUrl: './zreadings-ui.component.html',
  styleUrls: ['./zreadings-ui.component.css']
})
export class ZReadingsUIComponent implements OnInit {

  ZReadings     : any[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  computerName    : any;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
    {'Label'   : 'Print  Receipt','Function'  : () => this.onClickPrintReceipt(),'Disabled': true,}, 
    {'Label'   : 'POS Print','Function'  : () => this.onClickPOSPrint(),'Disabled': true,}, 
  ];  
  contextButtons      = [
  ];
  dateColumns         = [];
  defaultColumns      = ['TransDate', 'DateGenerated','ZReadingNo', 'Terminal','PreviousSales', 'NetSales', 'EndingSales','GeneratedBy','RecordStatus'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['PreviousSales', 'NetSales', 'EndingSales'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate', 'DateGenerated']
  };

  columnTypeMap: { [key: string]: string } = {};

  constructor(
    private dialog              : MatDialog,
    private dateZReadingsService  : DateZReadingsService,
    private dateTimesService    : DateTimesService,
    public matTableService     : MatTableService,
    private authService     : AuthService,
    private printService        : PrintService,
    private router              : Router,
    private notificationService : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any, 

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.computerName = this.data;
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
      this.ZReadings = await firstValueFrom(this.dateZReadingsService.getDateZReadingsByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
        this.computerName
      ));
    if(this.ZReadings)
    this.isLoading = false;
      this.displayRecords();
  }

  displayRecords(){
    var data = this.ZReadings;
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
    this.selectedId = data.id;
    this.selectedData = data;
  }


  
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printzreadings']));
    var data  = this.listData.filteredData;
    var title = this.computerName.toUpperCase()+' ZREADINGS RECEIPTS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'printzreadings', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

  async onClickPrintReceipt(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printzreadingreceipt']));
    var data  = this.selectedData;
    var title = 'Z Reading Report'  ;
    this.printService.popupWindow(url, 'printzreadingreceipt', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }
  async onClickPOSPrint(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    // Desktop ZReadingsUI.btnPOSPrint_Click: re-print of the saved Z-Reading
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printzreadingpos']));
    localStorage.setItem('Data', JSON.stringify(this.selectedData));
    localStorage.setItem('Title', 'Z READING REPORT(reprint)');
    localStorage.setItem('Reprint', 'true');
    this.printService.popupWindow(url, 'printzreadingpos', window, 800, 800);
   
  }
  onContextMenu(event: MouseEvent, data: any) {
    if(this.contextButtons.length > 0){
      this.getRecord(data);
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

}
