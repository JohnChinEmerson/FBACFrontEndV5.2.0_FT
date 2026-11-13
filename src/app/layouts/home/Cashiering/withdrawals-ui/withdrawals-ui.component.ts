import { Component, OnInit, ViewChild } from '@angular/core';
import { WithdrawalUIComponent } from '../withdrawal-ui/withdrawal-ui.component';
import { WithdrawalsService } from 'src/app/services/Cashiering/withdrawals.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CashDrawersService } from 'src/app/services/Cashiering/cash-drawers.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-withdrawals-ui',
  templateUrl: './withdrawals-ui.component.html',
  styleUrls: ['./withdrawals-ui.component.css']
})
export class WithdrawalsUIComponent implements OnInit {
  withdrawals : any=[];
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
    {'Label'   : 'WithDraw','Function'               : () => this.onClickWithDraw(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
    {'Label'   : 'Print Receipt','Function'        : () => this.onClickPrintReceipt(),'Disabled': true,}, 
  ];  
  contextButtons     = [
    {'Label'   : 'Edit','Function'                : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Void/Open','Function'                : () => this.onClickVoid(),'Disabled': true,}, 
  ];
  defaultColumns    = ['TransDate','TransNo', 'ReadingNo', 'UserFullName', 'Reason','Amount','Destination', 'InputBy', 'RecordStatus', 'MachineName','InputByDateTime'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Amount'],
    intColumns: [],
    dateTimeColumns: ['InputByDateTime'],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private cashDrawersService        : CashDrawersService,
    private withdrawalsService      : WithdrawalsService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private notificationService : NotificationService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
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
    this.withdrawals = await firstValueFrom(this.withdrawalsService.getWithdrawalsByDateFromByDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
    ));
    if(this.withdrawals)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.withdrawals;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;

    this.selectedId = undefined;
    this.selectedData = undefined;
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  getRecord(data : any){
    this.selectedId = data.TransNo;
    this.selectedData = data;
  }


  onClickWithDraw(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = ([null, null]);
    this.dialog.open(WithdrawalUIComponent,dialogConfig).beforeClosed().subscribe(withdrawal=>{
      if(withdrawal){
        this.withdrawals = [withdrawal,...this.withdrawals]; 
        this.displayRecords();
      }
    });
  }

  async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = ([this.selectedData, this.selectedData.ReadingNo]);
    this.dialog.open(WithdrawalUIComponent,dialogConfig).beforeClosed().subscribe(withdrawal=>{
      if(withdrawal){
        this.populateChanges(withdrawal);
      }
    });


  }

  onClickVoid(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
    this.notificationService.popupWarning(action.toUpperCase()+" Record","Withdrawal " + this.selectedId + " will be " + action.toUpperCase () + ". Continue?").then(async (result) => {
      if (result.value) {
          this.withdrawalsService.updateWithdrawalRecordStatus(this.selectedData.TransNo, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.withdrawal);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
      }
    });

  }

  populateChanges(withdrawal){
    this.selectedId  = null;
    this.selectedData = null;
    const withdrawalIndex = this.withdrawals.findIndex(detail => detail.TransNo === withdrawal.TransNo);
    if (withdrawalIndex !== -1) {
      this.withdrawals[withdrawalIndex] = withdrawal;  
    }
    this.displayRecords();
  }


  onClickPrintReceipt(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printwithdrawalreceipt']));
    var data  = this.listData.filteredData;
    var title = 'WITHDRAWAL RECEIPT ';
    this.printService.popupWindow(url, 'printwithdrawalreceipt', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(this.selectedData));
    localStorage.setItem('Title', title);
  
  }
  
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printwithdrawals']));
    var data  = this.listData.filteredData;
    var title = 'WITHDRAWALS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'printwithdrawals', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
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
