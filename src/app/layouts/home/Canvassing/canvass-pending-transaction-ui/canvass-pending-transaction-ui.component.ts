import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { CanvassDetailsService } from 'src/app/services/Canvassing/canvass-details.service';
import { CanvassHeadersService } from 'src/app/services/Canvassing/canvass-headers.service';
import { CanvassTransactionService } from 'src/app/services/Canvassing/canvass-transaction.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-canvass-pending-transaction-ui',
  templateUrl: './canvass-pending-transaction-ui.component.html',
  styleUrls: ['./canvass-pending-transaction-ui.component.css']
})
export class CanvassPendingTransactionUIComponent implements OnInit {
  canvassHeaders           : any[];
  canvassDetails           : any[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  listData2        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  pageSizeOptions2 :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  isLoading2       : boolean = false;

  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild(MatPaginator) paginator2    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu2: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'Save To Canvass','Function'            : () => this.onClickSaveToCanvass(),'Disabled': true,}, 
  ];
  contextButtons  =  [
    {'Label'   : 'Remove','Function'            : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'            : () => this.onClickRemoveAll(),'Disabled': true,}, 
  ];
   defaultColumns1  = ['TransCode', 'ReasonName'];
  defaultColumns2  = ['Qty', 'UM', 'ItemName'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap1: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

  transCode : string;
  constructor(
    private dialogRef         : MatDialogRef<CanvassPendingTransactionUIComponent>,
    private dialog              : MatDialog,
    private canvassHeadersService        : CanvassHeadersService,
    private canvassDetailsService        : CanvassDetailsService,
    private canvassTransactionService        : CanvassTransactionService,
    public matTableService     : MatTableService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap1 = this.buildColumnTypeMap(this.defaultColumns1);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
     await this.homeTs.getButtons();
     this.toolBoxService.disableButtons(this.toolButtons,null, this.contextButtons, null);
    this.transCode  = this.data;
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
    this.canvassHeaders = await firstValueFrom(this.canvassHeadersService.getCanvassHeadersByRecordStatus('pending'));
    if(this.canvassHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  async onClickViewCanvassDetails(){
    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;

    this.isLoading2 = true;
    this.canvassDetails = await firstValueFrom(this.canvassDetailsService.getCanvassDetailsByTransCode(this.selectedData.TransCode));
    if(this.canvassDetails)
      this.isLoading2 = false;
    this.displayRecords2();
  }

  displayRecords(){
    var data = this.canvassHeaders;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;

    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;

  }
  displayRecords2(){
    var data = this.canvassDetails;
    this.listData2 =  new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;
  }
  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  getRecord(data : any){
    this.selectedId = data.TransCode;
    this.selectedData = data;
    this.onClickViewCanvassDetails();
  }
 
  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.TransCode+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.canvassTransactionService.deleteCanvassDetailsByTransCode(this.selectedData.TransCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.canvassHeaders = this.canvassHeaders.filter(x => x.TransCode != this.selectedData.TransCode);
              this.displayRecords();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickRemoveAll(){
    this.notificationService.popupWarning("Delete Record","All records will be remove. Continue?").then((result) => {
      if (result.value) {
        this.canvassTransactionService.deleteAllCanvassHeadersPending().subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.canvassHeaders = [];
              this.displayRecords();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickSaveToCanvass(){
    this.notificationService.popupWarning("Save To Canvass","Record will be save to canvass. Continue?").then((result) => {
      if(result.value){
          if(this.transCode){
            this.canvassTransactionService.saveAsPendingCanvassByTransCode(this.transCode).subscribe({
                next:(res)=>{
                
                },
                error:(err)=>{
                  this.notificationService.toastrError(err.error);
                },
            });
        }
        this.canvassTransactionService.backToOngoingCanvassByTransCode(this.selectedData.TransCode).subscribe({
            next:(res)=>{
              this.dialogRef.close(res);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClose(){
    this.dialogRef.close(false);
  }
  onContextMenu(event: MouseEvent, data: any) {
    this.getRecord(data);
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'data': data };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

}
