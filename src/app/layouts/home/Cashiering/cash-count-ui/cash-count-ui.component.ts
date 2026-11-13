import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CashCountsService } from '../../../../services/Cashiering/cash-counts.service';
import { firstValueFrom } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from '../../../../services/notification.service';
import { SaleConfigAccessRightsService } from 'src/app/services/Sales/sale-config-access-rights.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cash-count-ui',
  templateUrl: './cash-count-ui.component.html',
  styleUrls: ['./cash-count-ui.component.css']
})
export class CashCountUIComponent implements OnInit {
  cashDrawer      : any=[];
  denominations   : any=[];
  isLoading       : boolean;
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  saleConfigAccessright: any=[];
  showTotalCashCount : boolean = false;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'Save','Function'                : () => this.onClickSave(),'Disabled': true,}, 
  ];  

  contextButtons     = [
  ];
  defaultColumns     = ['Amount','Denomination', 'Qty' ];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Amount','Denomination', 'Qty'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialogRef : MatDialogRef<CashCountUIComponent>,
    private cashCountsService : CashCountsService,
    public matTableService : MatTableService,
    private notificationService : NotificationService,
    private saleConfigAccessRightsService     : SaleConfigAccessRightsService,
    private auth_service : AuthService, 
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
   await this.getsaleConfigAccessRightsService();
    this.cashDrawer = this.data;
    this.getDenominations();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }
  
  async getsaleConfigAccessRightsService(){
    this.saleConfigAccessright = await firstValueFrom(this.saleConfigAccessRightsService.getSaleConfigAccessRightByAccessRightName(this.auth_service.UserAccount.AccessRightName));
    this.showTotalCashCount = (this.saleConfigAccessright.HideTotalCashCount || '').toLowerCase() == 'no';
  }
  async getDenominations(){
    this.isLoading = true;
    this.denominations = await firstValueFrom(this.cashCountsService.getDenominationsByReadingNo(this.cashDrawer.ReadingNo));
    if(this.denominations)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.denominations;
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
    this.selectedId = data.Denomination;
    this.selectedData = data;
  }

  onKeyupEnter(event, data)
  {
   this.listData?.filteredData.forEach(x => {
      if(x.Denomination == data.Denomination ){
        x.Qty = event.target.value;
        x.Amount =( +x.Qty * +x.Denomination)
      }
    });
  }

  onClickSave(){
    this.cashCountsService.updateDenominationsByReadingNo(this.cashDrawer.ReadingNo, this.listData.filteredData).subscribe({
      next:(res)=>{
        this.notificationService.toastrSuccess(res.message);
        this.dialogRef.close();
      },
      error:(err)=> {
        this.notificationService.toastrError(err.error.message);
      },
    });
  }

  getTotal(column){
    let sum = 0;
    this.listData?.filteredData.forEach(x => {
      sum += +x[column];
    });
    return sum;
  }

}
