import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AdjustingEntryDetailsService } from 'src/app/services/Accounting/adjusting-entry-details.service';
import { AdjustingEntryHeadersService } from 'src/app/services/Accounting/adjusting-entry-headers.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-adjusting-entry-details-ui',
  templateUrl: './adjusting-entry-details-ui.component.html',
  styleUrls: ['./adjusting-entry-details-ui.component.css']
})
export class AdjustingEntryDetailsUIComponent implements OnInit {

  asjustingEntryHeader      : any;
  adjustingEntryDetails     : any[];
  referenceNo         : any;
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
    {'Label'   : 'Print Details','Function'  : () => this.onClickPrintDetails(),'Disabled': true,}, 
  ];  
  contextButtons      = [];
  defaultColumns      = ['TransDate','ReferenceNo', 'TransName', 'Description', 'AccountTitle','Debit', 'Credit'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Debit', 'Credit'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private adjustingEntryHeadersService  : AdjustingEntryHeadersService,
    private adjustingEntryDetailsService  : AdjustingEntryDetailsService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService    : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    @Inject(MAT_DIALOG_DATA) public data: any, 

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.dateFrom = this.data[0];
    this.dateTo   = this.data[1];
    this.referenceNo = this.data[2];
    this.onClickView();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }
  async getAdjustingEntryHeader(referenceNo){
    this.asjustingEntryHeader = await firstValueFrom(this.adjustingEntryHeadersService.getAdjustingEntryHeaderByReferenceNo(referenceNo));
  }

  async onClickView(){
    this.isLoading = true;
    if(this.referenceNo == 'all'){
      this.adjustingEntryDetails = await firstValueFrom(this.adjustingEntryDetailsService.getAdjustingEntryDetailsByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      ));
    }else{
      this.adjustingEntryDetails = await firstValueFrom(this.adjustingEntryDetailsService.getAdjustingEntryDetailsByReferenceNo(
      this.referenceNo
    ));
    }
    
    if(this.adjustingEntryDetails)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.adjustingEntryDetails;
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
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printadjustingentrydetails']));
    var data  = this.listData.filteredData;
    var title = 'ADJUSTING ENTRY DETAILS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'printadjustingentrydetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify([]));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('ReferenceNo', this.referenceNo);
  }

  async onClickPrintDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    await this.getAdjustingEntryHeader(this.selectedData.ReferenceNo);

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printadjustingentrydetails']));
    var data  = this.listData.filteredData.filter(x =>x.ReferenceNo == this.selectedData.ReferenceNo && x.RecordStatus == 'open');
    var title = 'ADJUSTING ENTRY - ' + this.asjustingEntryHeader.ReferenceNo ;
    
    this.printService.popupWindow(url, 'printadjustingentrydetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(this.asjustingEntryHeader));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('ReferenceNo', this.selectedData.ReferenceNo);
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
