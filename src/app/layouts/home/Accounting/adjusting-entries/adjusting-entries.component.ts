import { Component, OnInit, ViewChild } from '@angular/core';
import { AdjustingEntryHeadersService } from 'src/app/services/Accounting/adjusting-entry-headers.service';
import { AdjustingEntryDetailsUIComponent } from '../adjusting-entry-details-ui/adjusting-entry-details-ui.component';
import { AdjustingEntryUIComponent } from '../adjusting-entry-ui/adjusting-entry-ui.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { AdjustingEntryDetailsService } from 'src/app/services/Accounting/adjusting-entry-details.service';

@Component({
  selector: 'app-adjusting-entries',
  templateUrl: './adjusting-entries.component.html',
  styleUrls: ['./adjusting-entries.component.css']
})
export class AdjustingEntriesComponent implements OnInit {

  adjustingEntryHeaders : any=[];
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
    {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
    {'Label'   : 'New Entry','Function'               : () => this.onClickNewEntry(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
    {'Label'   : 'View Details','Function'        : () => this.onClickViewDetails(),'Disabled': true,}, 
    {'Label'   : 'View All Details','Function'    : () => this.onClickViewAllDetails(),'Disabled': true,}, 
  ];  
  contextButtons     = [
    {'Label'   : 'Edit','Function'                : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Void/Open','Function'           : () => this.onClickVoid(),'Disabled': true,},
  ];
  defaultColumns    = ['TransDate','ReferenceNo', 'TransName','InputByDateTime','InputBy', 'MachineName'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private adjustingEntryHeadersService        : AdjustingEntryHeadersService,
    private adjustingEntryDetailsService        : AdjustingEntryDetailsService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private notificationService : NotificationService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.contextButtons, null);
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
    this.adjustingEntryHeaders = await firstValueFrom(this.adjustingEntryHeadersService.getAdjustingEntryHeadersByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))
    ));
    if(this.adjustingEntryHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.adjustingEntryHeaders;
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
    this.selectedId = data.ReferenceNo;
    this.selectedData = data;
  }


  onClickViewDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([this.dateFrom, this.dateTo, this.selectedData.ReferenceNo]);
    this.dialog.open(AdjustingEntryDetailsUIComponent,dialogConfig);
  }

  onClickViewAllDetails(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([this.dateFrom, this.dateTo, 'all']);
    this.dialog.open(AdjustingEntryDetailsUIComponent,dialogConfig);
  }

  onClickNewEntry(){
   if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '2000px';
    dialogConfig.data = (['',[], this.adjustingEntryHeaders, 'saveadjustingentry']);
    this.dialog.open(AdjustingEntryUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.adjustingEntryHeaders  = [x,...this.adjustingEntryHeaders];
        this.selectedId  = null;
        this.selectedData = null;
        this.displayRecords();
      }
    });
}

  async onClickEdit(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var data    = await firstValueFrom(this.adjustingEntryHeadersService.getAdjustingEntryHeaderByReferenceNo(this.selectedId));
    var details = await firstValueFrom(this.adjustingEntryDetailsService.getAdjustingEntryDetailsByReferenceNo(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '2000px';
    dialogConfig.data = ([data, details, this.adjustingEntryHeaders,'updateadjustingentry']);
    this.dialog.open(AdjustingEntryUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
          this.populateChanges(x);
      }
    });
 
  }

  onClickVoid(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
    this.notificationService.popupWarning(action.toUpperCase()+" Record","All Items  under " + this.selectedId + " will be " + action.toUpperCase () + ". Continue?").then(async (result) => {
      if (result.value) {
        var data = await firstValueFrom(this.adjustingEntryHeadersService.getAdjustingEntryHeaderByReferenceNo(this.selectedId));

        this.adjustingEntryHeadersService.updateAdjustingEntryRecordStatus(this.selectedId, action).subscribe({
          next:(res)=>{
            this.notificationService.toastrSuccess(res.message);
            this.onClickView();
          },
          error:(err)=>{
            this.notificationService.toastrError(err.error);
          },
        });
       
      }
    });
  }

  populateChanges(adjustingEntryHeader){
    this.selectedId  = null;
    this.selectedData = null;
    const adjustingEntryHeaderIndex = this.adjustingEntryHeaders.findIndex(detail => detail.ReferenceNo === adjustingEntryHeader.ReferenceNo);
    if (adjustingEntryHeaderIndex !== -1) {
      this.adjustingEntryHeaders[adjustingEntryHeaderIndex] = adjustingEntryHeader;  
    }
    this.displayRecords();
  }

  
    onClickPrint(){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printadjustingentryrecords']));
      var data  = this.listData.filteredData;
      var title = 'ADJUSTING ENTRIES FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
      this.printService.popupWindow(url, 'printadjustingentryrecords', window, 800, 800);
      localStorage.setItem('Headers', JSON.stringify(data));
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
