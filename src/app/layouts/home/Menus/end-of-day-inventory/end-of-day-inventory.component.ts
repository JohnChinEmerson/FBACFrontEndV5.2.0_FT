import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnTypeConfig, MatTableService } from 'src/app/services/mat-table.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MenuReportsService } from 'src/app/services/Menus/menu-reports.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { IngredientsUsedUIComponent } from '../ingredients-used-ui/ingredients-used-ui.component';

// Desktop Mariosoft.Costing.UI EndOfDayInventoryUI
@Component({
  selector: 'app-end-of-day-inventory',
  templateUrl: './end-of-day-inventory.component.html',
  styleUrls: ['../menus-shared.css']
})
export class EndOfDayInventoryComponent implements OnInit {
  transDate     : any = new Date();
  rows          : any[] = [];
  listData      : MatTableDataSource<any> = new MatTableDataSource([]);
  searchKey     : string = '';
  isLoading     : boolean = false;
  pageSizeOptions : any = this.matTableService.pageSizeOptions();
  defaultColumns  = ['EndOfDayInventoryId', 'ItemName', 'UM', 'Category', 'Available', 'QtyUsed', 'SystemCount', 'PhysicalCount', 'Variance', 'Cost', 'TotalCost'];
  labels          : { [key: string]: string } = { 'EndOfDayInventoryId': 'EOD No.' };
  columnConfig    : ColumnTypeConfig = {
    decimalColumns: ['Available', 'QtyUsed', 'SystemCount', 'PhysicalCount', 'Variance', 'Cost', 'TotalCost'],
    intColumns: [], dateTimeColumns: [], dateColumns: []
  };
  columnTypeMap   : { [key: string]: string } = {};
  @ViewChild(MatPaginator) paginator: MatPaginator;

  toolButtons   = [
    {'Label'   : 'Go','Function'                : () => this.onClickView(),'Disabled': true},
    {'Label'   : 'Ingredients Used','Function'  : () => this.onClickIngredientsUsed(),'Disabled': true},
    {'Label'   : 'Void','Function'              : () => this.onClickVoid(),'Disabled': true},
    {'Label'   : 'Print','Function'             : () => this.onClickPrint(),'Disabled': true},
  ];

  constructor(
    private dialog              : MatDialog,
    private menuReportsService  : MenuReportsService,
    private dateTimesService    : DateTimesService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private router              : Router,
    private printService        : PrintService,
    private homeTs              : HomeComponent,
    private matTableService     : MatTableService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.defaultColumns.forEach(c => this.columnTypeMap[c] = this.matTableService.getColumnType(c, this.columnConfig));
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(null, this.toolButtons, null, null);
    this.menuReportsService.requiredRefresh.subscribe(() => this.onClickView());
    this.onClickView();
  }

  get dateText(){
    return this.dateTimesService.ConvertToDateFormat(new Date(this.transDate));
  }

  get filteredRows(){
    return this.listData.filteredData;
  }

  sum(key: string){
    return this.filteredRows.reduce((total, row) => total + (+row[key] || 0), 0);
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey || '');
  }

  clearSearch(){
    this.searchKey = this.matTableService.clearSearch(this.listData);
  }

  async onClickView(){
    this.isLoading = true;
    try {
      this.rows = await firstValueFrom(this.menuReportsService.getEndOfDayInventoryByDate(this.dateText));
      this.listData = new MatTableDataSource(this.rows);
      this.listData.paginator = this.paginator;
      this.applyFilter();
    } finally {
      this.isLoading = false;
    }
  }

  onClickIngredientsUsed(){
    if (this.rows.length > 0)
      return this.notificationService.toastrWarning('End-of-Day Inventory for ' + this.dateText + ' is already saved. Void it first to redo it.');
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = false;
    dialogConfig.width        = '1100px';
    dialogConfig.maxWidth     = '98vw';
    dialogConfig.data         = ([this.dateText]);
    this.dialog.open(IngredientsUsedUIComponent, dialogConfig);
  }

  onClickVoid(){
    if (this.rows.length == 0) return this.notificationService.toastrWarning('No records found.');
    var eodId = this.rows[0].EndOfDayInventoryId;
    this.notificationService.popupWarning('Void', 'END OF DAY INVENTORY AS OF ' + this.dateText + ' (' + eodId + ') will be VOID. Stocks used will be put back. Continue?').then((result) => {
      if (result.value) {
        this.menuReportsService.voidEndOfDayInventory(eodId).subscribe({
          next:(res) => this.notificationService.toastrSuccess(res.message),
          error:(err) => this.notificationService.toastrError(err.error.message)
        });
      }
    });
  }

  onClickPrint(){
    var url = this.router.serializeUrl(this.router.createUrlTree(['print/printdatalist']));
    localStorage.setItem('PrintDataList', JSON.stringify({
      'Title'   : 'END OF DAY INVENTORY AS OF ' + this.dateText,
      'Columns' : [
        { 'Key': 'ItemName', 'Label': 'ItemName' },
        { 'Key': 'UM', 'Label': 'UM' },
        { 'Key': 'Available', 'Label': 'Available', 'Type': 'decimal' },
        { 'Key': 'QtyUsed', 'Label': 'QtyUsed', 'Type': 'decimal' },
        { 'Key': 'SystemCount', 'Label': 'SystemCount', 'Type': 'decimal' },
        { 'Key': 'PhysicalCount', 'Label': 'PhysicalCount', 'Type': 'decimal' },
        { 'Key': 'Variance', 'Label': 'Variance', 'Type': 'decimal' },
        { 'Key': 'TotalCost', 'Label': 'TotalCost', 'Type': 'decimal' },
      ],
      'Data'    : this.filteredRows,
      'Totals'  : { 'TotalCost': this.sum('TotalCost') },
    }));
    this.printService.popupWindow(url, 'EndOfDayInventory', window, 1000, 800);
  }
}
