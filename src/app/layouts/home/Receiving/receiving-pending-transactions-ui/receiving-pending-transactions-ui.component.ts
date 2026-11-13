import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ReceivingDetailsService } from 'src/app/services/Receiving/receiving-details.service';
import { ReceivingHeadersService } from 'src/app/services/Receiving/receiving-headers.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ReceivingTransactionService } from 'src/app/services/Receiving/receiving-transaction.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-receiving-pending-transactions-ui',
  templateUrl: './receiving-pending-transactions-ui.component.html',
  styleUrls: ['./receiving-pending-transactions-ui.component.css']
})
export class ReceivingPendingTransactionsUIComponent implements OnInit {
  receivingHeaders           : any[];
  receivingDetails           : any[];
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
  @ViewChild('paginator') paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild('paginator2') paginator2    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu2: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'Save To Receiving','Function'            : () => this.onClickSaveToReceiving(),'Disabled': true,}, 
  ];
  contextButtons  =  [
    {'Label'   : 'Remove','Function'            : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Remove All','Function'            : () => this.onClickRemoveAll(),'Disabled': true,}, 
  ];
  defaultColumns  = ['TransCode', 'SupplierName'];
  defaultColumns2  = ['Qty','UM','ItemName','Cost','Discount','Amount'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Cost','Discount','Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

  transCode : string;
  constructor(
    private dialogRef         : MatDialogRef<ReceivingPendingTransactionsUIComponent>,
    private dialog              : MatDialog,
    private receivingHeadersService        : ReceivingHeadersService,
    private receivingDetailsService        : ReceivingDetailsService,
    private receivingTransactionService        : ReceivingTransactionService,
    public matTableService     : MatTableService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
     this.toolBoxService.disableButtons(this.toolButtons, null, this.contextButtons, null);
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
    this.receivingHeaders = await firstValueFrom(this.receivingHeadersService.getReceivingHeadersByRecordStatus('pending'));
    if(this.receivingHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  async onClickViewReceivingDetails(){
    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;

    this.isLoading2 = true;
    this.receivingDetails = await firstValueFrom(this.receivingDetailsService.getReceivingDetailsByTransCode(this.selectedData.TransCode));
    if(this.receivingDetails)
      this.isLoading2 = false;
    this.displayRecords2();
  }

  displayRecords(){
    var data = this.receivingHeaders;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;

    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;

  }
  displayRecords2(){
    var data = this.receivingDetails;
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
    this.onClickViewReceivingDetails();
  }
 
  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record",this.selectedData.TransCode+ " will be remove. Continue?").then((result) => {
      if (result.value) {
        this.receivingTransactionService.deleteReceivingDetailsByTransCode(this.selectedData.TransCode).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.receivingHeaders = this.receivingHeaders.filter(x => x.TransCode != this.selectedData.TransCode);
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
        this.receivingTransactionService.deleteAllReceivingHeadersPending().subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.receivingHeaders = [];
              this.displayRecords();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickSaveToReceiving(){
    this.notificationService.popupWarning("Save To Receiving","Record will be save to receiving. Continue?").then((result) => {
      if(result.value){
          if(this.transCode){
            this.receivingTransactionService.saveAsPendingReceivingByTransCode(this.transCode).subscribe({
                next:(res)=>{
                
                },
                error:(err)=>{
                  this.notificationService.toastrError(err.error);
                },
            });
        }
        this.receivingTransactionService.backToOngoingReceivingByTransCode(this.selectedData.TransCode).subscribe({
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
