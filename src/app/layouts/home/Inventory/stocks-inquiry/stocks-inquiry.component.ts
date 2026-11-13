import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { StocksInquiryService } from 'src/app/services/Inventory/stocks-inquiry.service';
import { MatTableService, ColumnTypeConfig } from '../../../../services/mat-table.service';

@Component({
  selector: 'app-stocks-inquiry',
  templateUrl: './stocks-inquiry.component.html',
  styleUrls: ['./stocks-inquiry.component.css']
})
export class StocksInquiryComponent implements OnInit {

  btnSave                   : string = "Save";
  searchKey                 : string;
  ConfigReceiving           : any;
  loading                   : boolean = false;
  items                     : any;
  ItemName                     : string = 'All';
  pageSizeOptions: number[] = [5, 10, 25, 100];
  listData      : MatTableDataSource<any>;
  IsTrue        : boolean = false;
  StockInquiry  : any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [
    'ItemName',
    'Available',
    'Price',
    'Cost',
  ];
  Branches: any = [];
  Branch: any = [];
  
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Price', 'Cost', 'Available'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  displayedColumnsComputed: string[] = [];

  constructor(
    private router               : Router,
    private stocksInquiryService : StocksInquiryService,
    private branchesService : BranchesService,
    public matTableService : MatTableService,

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.displayedColumns);
    await this.GetBranches();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async DisplayTab(Branch){
    var sBranch = this.Branches.filter(x => x.BranchName.toLocaleLowerCase() == Branch.toLocaleLowerCase());
    this.Branch = sBranch[0];
    await this.getStockInquiryByItemNameByBranchId();
    this.displayedColumnsComputed = this.getDisplayedColumns();
  }
  
  async GetBranches(){
    var Branches =  await firstValueFrom(this.branchesService.getAllBranchesCBO());
    Branches.forEach(x => {
      this.Branches.push(x);
    });
    this.DisplayTab(this.Branches[0].BranchName)
  }

  async getStockInquiryByItemNameByBranchId(){
    this.IsTrue = true;
    this.StockInquiry  = await firstValueFrom(this.stocksInquiryService.getStockInquiryByItemNameByBranchId(this.ItemName, this.Branch.BranchId));
    if(this.StockInquiry)
      this.IsTrue = false;
    this.DisplayRecords();
  }

  applyFilter(){
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  clearSearch(){
    this.searchKey = "";
    this.applyFilter();
  }

  DisplayRecords(){
    var data = this.StockInquiry;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
  }

  getDisplayedColumns() {
    if (this.Branch?.BranchName != undefined) {
      if (this.Branch.BranchName.toLocaleLowerCase() == 'all') {
        return [
          'ItemName', 
          ...this.Branches.map(branch => branch.BranchName).filter(branchName => branchName.toLocaleLowerCase() != 'all'),
          'Total'
        ];
      } else {
        return this.displayedColumns;
      }
    } else {
      return this.displayedColumns;
    }
  }

  onClickPrint(){
    var url = this.router.serializeUrl(
      this.router.createUrlTree(['print/printstocksinquiry'])
    );
    this.popupWindow(url, 'printstocksinquiry', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(this.listData.filteredData));
    if(this.Branch?.BranchId.toLocaleLowerCase() == 'all'){
      localStorage.setItem('title', 'ALL BRANCH - STOCK INQUIRY');
      localStorage.setItem('Type', 'all');
      localStorage.setItem('Branches', JSON.stringify(this.Branches.filter(x => x.BranchId.toLowerCase() != 'all'))); // remove branch that is all
    }
    else{
        localStorage.setItem('title', this.Branch?.BranchName+' BRANCH - STOCK INQUIRY');
        localStorage.setItem('Type', 'per branch');
    }
  }

  popupWindow(url, windowName, win, w, h) {
    const y = win.top.outerHeight / 2 + win.top.screenY - (h / 2);
    const x = win.top.outerWidth / 2 + win.top.screenX - (w / 2);
    return win.open(url, windowName, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
  }

}