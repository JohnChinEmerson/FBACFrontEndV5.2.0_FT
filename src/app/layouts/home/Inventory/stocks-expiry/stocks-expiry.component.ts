import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { StocksExpiryService } from 'src/app/services/Inventory/stocks-expiry.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { AdjustPriceUIComponent } from '../adjust-price-ui/adjust-price-ui.component';
import { ItemCategorysService } from 'src/app/services/Files/item-categorys.service';
import { StringHelperService } from 'src/app/services/string-helper.service';

@Component({
  selector: 'app-stocks-expiry',
  templateUrl: './stocks-expiry.component.html',
  styleUrls: ['./stocks-expiry.component.css']
})
export class StocksExpiryComponent implements OnInit {

  stocksExpiry           : any[];
  categorys :any=[];
  category    : any = 'All';
  dateType    : any = 0;
  dateTypes    : any=
    [
      {
        'Value': 0,
        'Label': 'This Month'
      },
      {
        'Value': 1,
        'Label': 'Next Month'
      },
      {
        'Value': 2,
        'Label': 'Next 2 Months'
      },
      {
        'Value': 3,
        'Label': 'Next 3 Months'
      },
      {
        'Value': null,
        'Label': 'Select Date'
      },
    ];
  dtFrom      : any;
  dtTo        : any;
  selectedData    : any;
  selectedId      : number = 0;
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
  contextButtons  =  [
  ];
  defaultColumns  = ['ExpiryDate','BatchLotNo', 'ItemName','UM','Category','Qty','Cost','Amount'];
  
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Cost','Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['ExpiryDate']
  };
  columnTypeMap: { [key: string]: string } = {};

  constructor(
    private dialog              : MatDialog,
    private StocksExpiryService        : StocksExpiryService,
    private itemCategorysService : ItemCategorysService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private stringHelperService              : StringHelperService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.onChangeDateType();
    this.getItemCategorys();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getItemCategorys(){
    this.categorys = await firstValueFrom(this.itemCategorysService.getCBOCategorys());
    this.categorys.push(this.stringHelperService.allCategoryCBO());
  }
  async onClickView(){
    this.isLoading = true;
    this.stocksExpiry = await firstValueFrom(this.StocksExpiryService.getStocksExpiryByCategoryByDateFromByDateTo(this.dateTimesService.ConvertToDateFormat(new Date(this.dtFrom)), this.dateTimesService.ConvertToDateFormat(new Date(this.dtTo)),this.category));
    if(this.stocksExpiry)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.stocksExpiry;
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

  onChangeDateType() {
    const today = new Date();
  
    if (this.dateType != null) {
      const fromDate = new Date(today.getFullYear(), today.getMonth() + this.dateType, 1);
      const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0); 
  
      this.dtFrom = fromDate;
      this.dtTo = toDate;
    } else {
      this.dtFrom = today;
      this.dtTo = today;
    }
  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstocksexpiry']));
    var data  = this.listData.filteredData;
    var title = this.category.toUpperCase()+' STOCKS EXPIRY';

    var dateType = this.dateTypes.find(x => x.Value == dateType);
    if(dateType.Label.toLowerCase() == 'select date')
      title += ' FROM '+this.dateTimesService.ConvertToDateFormat(new Date(this.dtFrom)) +' TO '+ this.dateTimesService.ConvertToDateFormat(new Date(this.dtTo));
    else
      title += ' FOR '+dateType.Label.toUpperCase();
    
    this.printService.popupWindow(url, 'printstocksexpiry', window, 800, 800);
    localStorage.setItem('HasPrintStocksExpiry', 'no');
    localStorage.setItem('StocksExpiry', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('Title4', title);
    localStorage.setItem('Type4', 'Title4')
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
