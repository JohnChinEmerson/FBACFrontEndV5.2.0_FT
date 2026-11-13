import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CashDrawersService } from 'src/app/services/Cashiering/cash-drawers.service';
import { SaleReadingsService } from 'src/app/services/Cashiering/sale-readings.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { CashDrawerUIComponent } from '../cash-drawer-ui/cash-drawer-ui.component';
import { CashLedgerUIComponent } from '../cash-ledger-ui/cash-ledger-ui.component';
import { DepositToUIComponent } from '../deposit-to-ui/deposit-to-ui.component';
import { CashReadingsService } from 'src/app/services/Cashiering/cash-readings.service';
import { WithdrawalsUIComponent } from '../withdrawals-ui/withdrawals-ui.component';
import { CashieringConfigService } from 'src/app/services/Cashiering/cashiering-config.service';
import { CashCountsService } from 'src/app/services/Cashiering/cash-counts.service';
import { exists } from 'fs';

@Component({
  selector: 'app-cash-reading-records-ui',
  templateUrl: './cash-reading-records-ui.component.html',
  styleUrls: ['./cash-reading-records-ui.component.css']
})
export class CashReadingRecordsUIComponent implements OnInit {

  cashReadings : any=[];
  cashReadingsToDeposit : any=[];
  config : any;
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  withDate          : boolean = true;
  depositStatus : string = 'UnDeposited';
  text:string = 'Cash Readings';
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
    {'Label'   : 'Deposit','Function'               : () => this.onClickDeposit(),'Disabled': true,}, 
    {'Label'   : 'WithDraw','Function'               : () => this.onClickWithDraw(),'Disabled': true,}, 
  ];  
  toolButtons2     = [
    {'Label'   : 'View Ledger','Function'        : () => this.onClickViewLedger(),'Disabled': true,}, 
    {'Label'   : 'Reading Details','Function'    : () => this.onClickViewReadingDetails(),'Disabled': true,}, 
  ];  
  contextButtons     = [
    {'Label'   : 'CashDrawer','Function'                : () => this.onClickCashDrawer(),'Disabled': true,}, 
  ];
  defaultColumns = ['actions','ReadingNo','StartDateTime', 'EndDateTime','UserFullName','StartUpCash','CashIn', 'CashOut','TotalCash', 'PhysicalCash', 'Variance','MachineName', 'RecordStatus', 'DepositStatus'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['StartUpCash','CashIn', 'CashOut','TotalCash', 'PhysicalCash', 'Variance'],
    intColumns: [],
    dateTimeColumns: ['StartDateTime', 'EndDateTime'],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  
  constructor(
    private dialog              : MatDialog,
    private cashDrawersService        : CashDrawersService,
    private cashReadingsService      : CashReadingsService,
    private dateTimesService      : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private notificationService : NotificationService,
    private cashieringConfigService : CashieringConfigService,
    private cashCountsService : CashCountsService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.text = this.data;
    this.getCashieringConfig();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }
  async getCashieringConfig(){
    this.config = await firstValueFrom(this.cashieringConfigService.getCashieringConfig());
  }

  async onClickView(){
    this.isLoading = true;
    if (this.text == "OtherPaymentTypesUI")
      this.depositStatus = "all";

    this.cashReadings = await firstValueFrom(this.cashDrawersService.getCashReadingByDateFromByDateToByDepositStatus(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      this.depositStatus,
      this.withDate
    ));
    if(this.cashReadings)
      this.isLoading = false;
    this.displayRecords();
    this.cashReadingsToDeposit = [];
  }

  displayRecords(){
    var data = this.cashReadings;
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
    this.selectedId = data.ReadingNo;
    this.selectedData = data;
  }
  onClickDeposit(){
    
    if(this.depositStatus.toLowerCase() == 'undeposited'){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '500px';
      dialogConfig.data        = (['cashreadingrecords', this.cashReadingsToDeposit, this.depositStatus.toLowerCase()]);
      this.dialog.open(DepositToUIComponent,dialogConfig).beforeClosed().subscribe(x =>{
        this.onClickView();
      });

    }else{
      this.notificationService.popupWarning("Undeposited Record","Selected Records will be Undeposited. Continue?").then(async (result) => {
        if (result.value) {
          this.cashReadingsService.depositCashReadings('NA',this.depositStatus,  this.cashReadingsToDeposit).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.onClickView();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
              this.onClickView();
            },
          })
        }
      });
    }

  }

  onClickWithDraw(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    this.dialog.open(WithdrawalsUIComponent,dialogConfig);
  }

  async onClickViewLedger(){
    var cashDrawer:any = await firstValueFrom(this.cashDrawersService.getCashDrawerByReadingNo(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data         = ([cashDrawer, 'ALL']);
    this.dialog.open(CashLedgerUIComponent,dialogConfig);

  }

 async onClickViewReadingDetails(){
    if (this.config.PrinterType.toLowerCase() == "ordinary")
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcashreading']));
    else
      url   = this.router.serializeUrl(this.router.createUrlTree(['print/posprintcashreading']));

    var cashDrawer:any =await firstValueFrom(this.cashDrawersService.getCashDrawerByReadingNo(this.selectedData.ReadingNo)); 
    var cashIns:any =await firstValueFrom(this.cashDrawersService.getTotalAmountIn(this.selectedData.ReadingNo, "CASH")); 
    var cashOuts:any =await firstValueFrom(this.cashDrawersService.getTotalAmountOut(this.selectedData.ReadingNo, "CASH")); 
    var denominations = await firstValueFrom(this.cashCountsService.getDenominationsByReadingNo(this.selectedData.ReadingNo));

    var title = 'CASH READING RECEIPT';
    this.printService.popupWindow(url, 'printcashreading', window, 800, 800);
    localStorage.setItem('cashDrawer', JSON.stringify(cashDrawer));
    localStorage.setItem('cashIns', JSON.stringify(cashIns));
    localStorage.setItem('cashOuts', JSON.stringify(cashOuts));
    localStorage.setItem('denominations', JSON.stringify(denominations));
    localStorage.setItem('Title', title);
  }

  async onClickCashDrawer(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = (['cashreadingrecords',null, this.selectedData]);
    this.dialog.open(CashDrawerUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        this.onClickView();
    });
  }

  onCheckToDeposit(data, value) {
    if (value) {
      this.cashReadingsToDeposit.push(data);
    } else {
      this.cashReadingsToDeposit = this.cashReadingsToDeposit.filter(
        (item) => item.ReadingNo !== data.ReadingNo
      );
    }
  
  }

  existInCashReadingsToDeposit(data){
    var exist:boolean = this.cashReadingsToDeposit.find(x => x.ReadingNo == data.ReadingNo);
    return exist;
  }
  
  
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcashreadings']));
    var data  = this.listData.filteredData;
    var title = 'CASH READINGS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'printcashreadings', window, 800, 800);
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
