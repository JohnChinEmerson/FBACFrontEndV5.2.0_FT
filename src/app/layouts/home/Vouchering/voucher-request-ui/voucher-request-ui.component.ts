import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { VoucherRequestsService } from 'src/app/services/Vouchering/voucher-requests.service';
import { HomeComponent } from '../../home.component';
import { PODetailsService } from 'src/app/services/Purchasing/podetails.service';
import { VoucherTransUIComponent } from '../voucher-trans-ui/voucher-trans-ui.component';
import { NotificationService } from 'src/app/services/notification.service';
import { POHeadersService } from 'src/app/services/Purchasing/poheaders.service';

@Component({
  selector: 'app-voucher-request-ui',
  templateUrl: './voucher-request-ui.component.html',
  styleUrls: ['./voucher-request-ui.component.css']
})
export class VoucherRequestUIComponent implements OnInit {
  pendingHeaders           : any[];
  pendingDetails          : any[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  searchKey2       : string = "";
  listData        : MatTableDataSource<any>;
  listData2        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  pageSizeOptions2 :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  isLoading2       : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild('paginator') paginator    : MatPaginator;  
  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild('paginator2') paginator2    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
  ];  

  contextButtons      = [
    {'Label'   : 'Generate Voucher','Function'            : () => this.onClickGenerateVoucher(),'Disabled': true,}, 
    {'Label'   : 'Disapprove Requests','Function'            : () => this.onClickDisapproveRequest(),'Disabled': true,}, 
  ];
  defaultColumns      = ['TransNo','TransDate','PayToName', 'TransName','Amount','InputBy','InputByDateTime','VoucherNo'];
  defaultColumns2     = ['Qty', 'UM', 'ItemName','Cost', 'Discount', 'Amount','RecordStatus'];
 columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Amount','Qty','Cost', 'Discount', 'Amount'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  
  constructor(
    private dialog              : MatDialog,
    private VoucherRequestsService        : VoucherRequestsService,
    private pODetailsService        : PODetailsService,
    private pOHeadersService        : POHeadersService,
    private toolBoxService      : ToolBoxService,
    private notificationService      : NotificationService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.contextButtons, null,null);
    this.VoucherRequestsService.requiredRefresh.subscribe(()=>{
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
    this.pendingHeaders = await firstValueFrom(this.VoucherRequestsService.getVoucherRequestPending());
    if(this.pendingHeaders)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.pendingHeaders;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;

    this.listData2 =  new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  displayRecords2(){
    var data = this.pendingDetails;
    this.listData2 =  new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;
  }

  applyFilter2(){
    this.matTableService.applyFilter(this.listData2, this.searchKey2);
  }

  clearSearch2(){
    this.searchKey2 =  this.matTableService.clearSearch(this.listData2);
  }

  getRecord(data : any){
    this.selectedId = data.TransNo;
    this.selectedData = data;
    this.onClickViewDetails();
  }

  async onClickViewDetails(){
    this.isLoading2 = true;
    this.pendingDetails = await firstValueFrom(this.pODetailsService.getOpenPODetailsByTransNo(this.selectedData.TransNo));
    if(this.pendingDetails)
        this.isLoading2 = false;
      this.displayRecords2();
  }
  onClickGenerateVoucher(){
   if (!this.matTableService.CommonTransaction()) {
      return;
    }
    this.selectedData.VoucherType = 'generated';
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = ([this.selectedData,'' ,'generatevoucherfromrequest']);
    this.dialog.open(VoucherTransUIComponent, dialogConfig).beforeClosed().subscribe(item => {
        this.onClickView();
    });
  }

  onClickDisapproveRequest(){
    this.notificationService.popupWarning("DISAPPROVED Record","Voucher Request for "+this.selectedId+" will be DISAPPROVED. Continue?").then(async (result) => {
      if (result.value) {
          this.pOHeadersService.updateVoucherRequest(this.selectedId, "na", "disapproved").subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess('Successfully DISAPPROVED!');
              this.onClickView();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
      }
    });
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
