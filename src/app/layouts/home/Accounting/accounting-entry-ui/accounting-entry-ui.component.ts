import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GeneralJournalsService } from 'src/app/services/Accounting/general-journals.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-accounting-entry-ui',
  templateUrl: './accounting-entry-ui.component.html',
  styleUrls: ['./accounting-entry-ui.component.css']
})
export class AccountingEntryUIComponent implements OnInit {

  accountingEntries  : any[];
  searchKey     : string = "";
  selectedId    : number = 0;
  selectedData  : any;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  listData      : MatTableDataSource<any>;
  isLoading     : boolean = false;
  indexTables      : any;
  transNo      : string;

  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];
  contextButtons  =  [];
  defaultColumns  = ['Description',  'AccountTitle','Debit',  'Credit'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Debit',  'Credit'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog          : MatDialog,
    private generalJournalsService    : GeneralJournalsService,
    private saleHeadersService    : SaleHeadersService,
    private notif           : NotificationService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private router : Router,
    private printService : PrintService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }


  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
   this.indexTables = this.data[0];
   this.transNo = this.data[1];
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
    this.accountingEntries = await firstValueFrom(this.generalJournalsService.getEntryByIndexTableByTransNo(this.indexTables, this.transNo, 'all'));
    if(this.accountingEntries)
      this.isLoading = false;
    this.displayRecords();
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  displayRecords(){
    var data      = this.accountingEntries;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  getRecord(data : any){
    this.selectedId = data.Description;
    this.selectedData = data;
  }

  getTotal(column){
    let sum = 0;
    this.listData?.filteredData.forEach(x => {
      sum += +x[column];
    });
    return sum;
  }

  async onClickPrint(){
    var url = this.router.serializeUrl(
      this.router.createUrlTree(['print/printaccountingentry'])
    );
    var data:any = this.listData.filteredData;

    // if(this.indexTables.TransactionTable.toLowerCase() == 'saleheaders'){
    //   var header:any = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransNo(this.transNo));
    //       header.Particular = data[0].Description;
    //       header.ReferenceNo = this.transNo;
    //       header.Date = header.TransDate;
    // }
    var header:any ={
      Particular : data[0].Description,
      ReferenceNo : this.transNo,
      Date :  data[0].TransDate,
    };
  
    
    var title = 'JOURNAL VOUCHER - '+this.transNo;
    this.printService.popupWindow(url, 'AccountingEntry', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Header', JSON.stringify(header));
    localStorage.setItem('Title', title);
  }


  
  onContextMenu(event: MouseEvent, data: any) {
    if(this.contextButtons.length > 0){
      event.preventDefault();
      this.getRecord(data);
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
    
  }
}
