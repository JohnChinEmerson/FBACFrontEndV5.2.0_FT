import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';
import { ReceivingDetailsService } from 'src/app/services/Receiving/receiving-details.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-receiving-ave-cost-history-ui',
  templateUrl: './receiving-ave-cost-history-ui.component.html',
  styleUrls: ['./receiving-ave-cost-history-ui.component.css']
})
export class ReceivingAveCostHistoryUIComponent implements OnInit {

  receivingDetails     : any[];
  item         : any;
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  aveCostMethod : string;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  contextButtons      = [];
  defaultColumns      = ['TransDate','TransNo', 'SupplierName','ReceivedQty','Cost', 'Discount', 'OverHeadCost', 'ReceivedStockValue', 'OldQty', 'OldAveCost', 'OldStockValue', 'NewAveCost'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['ReceivedQty','Cost', 'Discount', 'OverHeadCost', 'ReceivedStockValue', 'OldQty', 'OldAveCost', 'OldStockValue', 'NewAveCost'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private receivingDetailsService  : ReceivingDetailsService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService    : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    @Inject(MAT_DIALOG_DATA) public data: any, 

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.item = this.data;
    this.aveCostMethod = this.item.AveCostMethod;
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
    this.receivingDetails = await firstValueFrom(this.receivingDetailsService.getReceivingDetailsByItemIdByAveCostMethod(this.item.ItemId, this.aveCostMethod));
    if(this.receivingDetails)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.receivingDetails;
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
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivingavecosthistory']));
    var data  = this.listData.filteredData;
    var title = this.item.ItemName.toUpperCase()+' - '+ this.aveCostMethod.toUpperCase();
    this.printService.popupWindow(url, 'printreceivingavecosthistory', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

}
