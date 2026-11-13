import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom, filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { StockAdjustmentDetailsService } from 'src/app/services/StockAdjustments/stock-adjustment-details.service';
import { StockTransferReportService } from 'src/app/services/StockAdjustments/stock-transfer-report.service';

@Component({
  selector: 'app-stock-transfer-report',
  templateUrl: './stock-transfer-report.component.html',
  styleUrls: ['./stock-transfer-report.component.css']
})
export class StockTransferReportComponent implements OnInit {

  adjustmentReports       : any;
  searchKey               : string = "";
  listData                : MatTableDataSource<any>;
  pageSizeOptions         : any = this.matTableService.pageSizeOptions();
  isLoading               : boolean = false;
  adjustmentTypes         : any =['stockin', 'stockout'];
  adjustmentType          : string = 'stockout';
  dateFrom           : any = (new Date);
  dateTo             : any = (new Date);
  branchId                : string;
  branches                : any=[];
  selectedId              : string;
  selectedData            : any;
  selectedBranch          : any=[];
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
    {'Label'   : 'Print Details','Function'           : () => this.onClickPrintDetails(),'Disabled': true,}, 
  ];
  contextButtons  =  [];
  defaultColumns  = ['TransDate','TransNo', 'ReasonName', 'BranchName', 'ReportAs', 'LoadStatus','TotalAmount'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalAmount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  
  constructor(
    private dateTimesService                      : DateTimesService,
    private stockTransferReportService            : StockTransferReportService,
    private stockAdjustmentDetailsService         : StockAdjustmentDetailsService,
    private router                                : Router,
    private branchService                         : BranchesService,
    private authService                           : AuthService,
    private notificationService                   : NotificationService,
    private dialog                                : MatDialog,
    public matTableService                                : MatTableService,
    private printService                                : PrintService,
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.GetBranches();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async GetBranches(){
    this.branches = await firstValueFrom(this.branchService.getBranchesCBOExcept());
     this.branches = this.branches .filter(branch => branch.BranchId !== 'NA');
    this.branchId = this.branches[0].BranchId;
  }

  
  async onClickView(){
    if(this.branchId == this.authService.Branch.BranchId)
        return this.notificationService.toastrWarning('Invalid BranchName.');

    this.isLoading = true;
    this.adjustmentReports = await firstValueFrom(this.stockTransferReportService.getStockTransferReportByFromBranchIdByTransDateFromByTransDateToByAdjustmentType(
                                              this.branchId,
                                              this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
                                              this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
                                              this.adjustmentType,
                                              )
                                          );
    if(this.adjustmentReports)
      this.isLoading = false;
    this.displayRecords();
  }


  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }


  displayRecords(){
    var data          = this.adjustmentReports;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
  }

  getRecord(data : any){
    this.selectedId = data.TransNo;
    this.selectedData = data;
  }
  getTotal(column){
    let sum = 0;
    this.listData?.filteredData.forEach(x => {
            sum += +x[column];
    });
    return sum;
  }

  async onClickPrintDetails(){
      if(!this.matTableService.checkNull(this.selectedId)) return;


      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstocktransferdetails']));
      var data  = await firstValueFrom(this.stockAdjustmentDetailsService.getStockTransferDetailsByTransNo(this.selectedId, this.adjustmentType));

      if(this.adjustmentType.toLowerCase() == 'stockout'){
        var title = this.selectedData.AdjustmentType.toUpperCase()+'  TRANSFER RECEIPT OF  - ' + this.selectedId +' TO '+ this.selectedData.BranchName.toUpperCase() ;

      }else{
        var title = this.selectedData.AdjustmentType.toUpperCase()+'  TRANSFER RECEIPT OF  - ' + this.selectedId +' FROM '+ this.selectedData.BranchName.toUpperCase() ;
      }
      
      this.printService.popupWindow(url, 'printstocktransferdetails', window, 800, 800);
      localStorage.setItem('Header', JSON.stringify(this.selectedData));
      localStorage.setItem('Details', JSON.stringify(data));
      localStorage.setItem('Title', title);
      localStorage.setItem('TransNo', this.selectedData.TransNo);
  }

  async onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printstocktransferreceipts']));
    var data  = this.listData.filteredData;
    var branch = this.branches.find(x => x.BranchId == this.branchId);
    if(this.adjustmentType.toLowerCase() == 'stockout'){
      var title = this.adjustmentType.toUpperCase()+' TO '+ branch.BranchName.toUpperCase()+' FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;

    }else{
       title = this.adjustmentType.toUpperCase()+' FROM '+ branch.BranchName.toUpperCase()+' FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    }
    this.printService.popupWindow(url, 'printstocktransferreceipts', window, 800, 800);
    localStorage.setItem('Headers', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }


}
