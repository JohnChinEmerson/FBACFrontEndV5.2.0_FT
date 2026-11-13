import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CashLedgersService } from 'src/app/services/Cashiering/cash-ledgers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-cash-ledger-ui',
  templateUrl: './cash-ledger-ui.component.html',
  styleUrls: ['./cash-ledger-ui.component.css']
})
export class CashLedgerUIComponent implements OnInit {
  cashDrawer: any=[];
  cashierLedgers: any=[];
  paymentType: string;
  paymentTypes : any= ['CASH', 'BANK DEPOSIT', 'CHECK','CHARGE', 'ALL'];
  lblReadingNo: string;
  lblCashier: string;
  paymentTypeEnabled: boolean;
  isLoading : boolean;
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
  ];  

  contextButtons     = [
  ];

  defaultColumns    = ['InputDate','TransNo', 'TransName', 'Description','PaymentType', 'FundSource','AmountIn','AmountOut', 'RunningTotal' ];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['AmountIn','AmountOut', 'RunningTotal' ],
    intColumns: [],
    dateTimeColumns: ['InputDate'],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private cashLedgerService : CashLedgersService,
    public matTableService : MatTableService,
    private router : Router, 
    private printService : PrintService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.cashDrawer = this.data[0];
    this.paymentType = this.data[1];
    this.lblReadingNo = "ReadingNo : " + this.cashDrawer.ReadingNo;
    this.lblCashier = "Cashier : " + this.cashDrawer.UserFullName;
    this.paymentTypeEnabled = this.paymentType.toLowerCase() != "cash";
    this.onClickView();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
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


  async onClickView()
  {
    this.isLoading = true;
    this.cashierLedgers = await firstValueFrom(this.cashLedgerService.getReceiptsByReadingNoByPaymentTypeByRecordStatusByAmountColumn(this.cashDrawer.ReadingNo, this.paymentType, "open", "all"));
    if(this.cashierLedgers)
      this.isLoading = false;
    this.displayRecords();
  }

  
  displayRecords(){
    var data = this.cashierLedgers;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }


  getTotal(column){
    let sum = 0;
    this.listData?.filteredData.forEach((x, index, array)=> {
      sum += +x[column];
      if (column === 'RunningTotal' && index === array.length - 1) {
        sum = x[column];
      }
    });
    return sum;
  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcashierledger']));
    var data  = this.listData.filteredData;
    var title = 'ReadingNo '+this.cashDrawer.ReadingNo+'    -    Cashier '+this.cashDrawer.UserFullName+'    -    PaymentType '+this.paymentType +'    -    StartUpCash '+ this.cashDrawer.StartUpCash ;
    this.printService.popupWindow(url, 'PrintCashierLedger', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

}
