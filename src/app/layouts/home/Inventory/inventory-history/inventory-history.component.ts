import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { InventoryHistoryService } from 'src/app/services/Inventory/inventory-history.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { InventoryDetailsUIComponent } from '../inventory-details-ui/inventory-details-ui.component';
import { InventoryDetailsService } from 'src/app/services/Inventory/inventory-details.service';

@Component({
  selector: 'app-inventory-history',
  templateUrl: './inventory-history.component.html',
  styleUrls: ['./inventory-history.component.css']
})
export class InventoryHistoryComponent implements OnInit {
  inventoryHeaders           : any[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
    {'Label'   : 'View Details','Function'           : () => this.onClickViewDetails(),'Disabled': true,}, 
    {'Label'   : 'View All Details','Function'           : () => this.onClickViewAllDetails(),'Disabled': true,}, 
  ];  
  contextButtons     = [];
  defaultColumns  = ['InventoryBatchDate', 'InventoryBatchId','TotalPhysicalCount','TotalSystemCount','TotalVarianceQty','TotalVarianceCost', 'TotalVariancePrice'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalPhysicalCount','TotalSystemCount','TotalVarianceQty','TotalVarianceCost', 'TotalVariancePrice'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['InventoryBatchDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private inventoryHistoryService        : InventoryHistoryService,
    private inventoryDetailsService        : InventoryDetailsService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, null, null);
    this.inventoryHistoryService.requiredRefresh.subscribe(()=>{
      this.onClickView();
    });
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
    this.inventoryHeaders = await firstValueFrom(this.inventoryHistoryService.getInventoryHeadersByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
    ));
    if(this.inventoryHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.inventoryHeaders;
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
    this.selectedId = data.InventoryBatchId;
    this.selectedData = data;
  }

  onClickViewDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([this.dateFrom, this.dateTo, this.selectedData.InventoryBatchId]);
    this.dialog.open(InventoryDetailsUIComponent,dialogConfig);
  }

  onClickViewAllDetails(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([this.dateFrom, this.dateTo, 'all']);
    this.dialog.open(InventoryDetailsUIComponent,dialogConfig);
  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printinventoryhistory']));
    var data  = this.listData.filteredData;
    var title = 'INVENTORY HISTORY FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'InventoryHistory', window, 800, 800);
    localStorage.setItem('InventoryHistory', JSON.stringify(data));
    localStorage.setItem('Title', title);
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
