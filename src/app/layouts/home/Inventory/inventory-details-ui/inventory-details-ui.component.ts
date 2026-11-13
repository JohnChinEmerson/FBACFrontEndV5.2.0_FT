import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { InventoryDetailsService } from 'src/app/services/Inventory/inventory-details.service';
import { InventoryHistoryService } from 'src/app/services/Inventory/inventory-history.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-inventory-details-ui',
  templateUrl: './inventory-details-ui.component.html',
  styleUrls: ['./inventory-details-ui.component.css']
})
export class InventoryDetailsUIComponent implements OnInit {

  inventoryHeader           : any[];
  inventoryDetails           : any[];
  inventoryBatchId  : any;
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  varianceTypes : any=[
    {
      'Label' : 'All',
      'Value' : 'all',
    },
    {
      'Label' : 'Variance = 0',
      'Value' : 'zero',
    },
    {
      'Label' : 'Variance > 0',
      'Value' : 'greater zero',
    },
    {
      'Label' : 'Variance < 0',
      'Value' : 'less than zero',
    },
  ];
  varianceType : string='all';
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
    {'Label'   : 'Print Details','Function'           : () => this.onClickPrintDetails(),'Disabled': true,}, 
  ];  
  contextButtons     = [];
  defaultColumns  = ['InventoryBatchId', 'ItemName', 'UM','PhysicalCount','SystemCount','Variance', 'InputBy'];
  
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['PhysicalCount','SystemCount','Variance'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
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
    @Inject(MAT_DIALOG_DATA) public data: any, 

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.dateFrom = this.data[0];
    this.dateTo = this.data[1];
    this.inventoryBatchId = this.data[2];
    this.onClickView();
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
    if(this.inventoryBatchId == 'all'){
      this.inventoryDetails = await firstValueFrom(this.inventoryDetailsService.getInventoryDetailsByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      ));
    }else{
      this.inventoryDetails = await firstValueFrom(this.inventoryDetailsService.getInventoryDetailsByInventoryBatchId(
      this.inventoryBatchId
    ));
    }
    
    if(this.inventoryDetails)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.inventoryDetails;
    if(this.varianceType.toLocaleLowerCase() != 'all'){
      if(this.varianceType.toLocaleLowerCase() == 'zero'){
        data = data.filter(x => x.Variance == 0);
      } 
      if(this.varianceType.toLocaleLowerCase() == 'greater zero'){
        data = data.filter(x => x.Variance > 0);
      }
      if(this.varianceType.toLocaleLowerCase() == 'less than zero'){
        data = data.filter(x => x.Variance < 0);
      }
    }
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
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printinventorydetails']));
    var data  = this.listData.filteredData;
    var title = 'INVENTORY DETAILS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'InventoryDetails', window, 800, 800);
    localStorage.setItem('InventoryDetails', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

  onClickPrintDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printinventorydetails']));
    var data  = this.listData.filteredData.filter(x =>x.InventoryBatchId == this.selectedData.InventoryBatchId);
    var title = 'INVENTORY DETAILS OF BATCHID - ' + this.selectedData.InventoryBatchId ;
    this.printService.popupWindow(url, 'InventoryDetails', window, 800, 800);
    localStorage.setItem('InventoryDetails', JSON.stringify(data));
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
