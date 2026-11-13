import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TrialBalanceService } from 'src/app/services/Accounting/trial-balance.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialBalanceComponent implements OnInit {
   searchKey     : string = "";
   selectedId    :any;
   selectedData  : any;
   pageSizeOptions :any = this.matTableService.pageSizeOptions();
   listData      : MatTableDataSource<any>;
   isLoading     : boolean = false;
   indexTables      : any;
   dateFrom        : any = new Date();
   dateTo          : any = new Date();
   @ViewChild(MatSort) sort              : MatSort;
   @ViewChild(MatPaginator) paginator    : MatPaginator;  
   @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
 
   contextMenuPosition = { x: '0px', y: '0px' };
 
   toolButtons     = [
     {'Label'   : 'View','Function'           : () => this.onClickView(),'Disabled': true,}, 
     {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
   ];
   contextButtons  =  [];
   defaultColumns  = ['AccountTitle','Debit',  'Credit'];
   columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Debit',  'Credit'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};

   entries: any[];
   branches : any;
   branchId : any; 
   constructor(
     private dialog          : MatDialog,
     private trialBalanceService    : TrialBalanceService,
     public matTableService           : MatTableService,
     private dateTimesService           : DateTimesService,
     private router : Router,
     private printService : PrintService,
    private branchesService : BranchesService,  
     
   ) { }
 
   async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.getCBOBranches();
   }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

   async getCBOBranches(){
    this.branches = await firstValueFrom(this.branchesService.getBranchesCBO());
    this.branchId = this.branches[0].BranchId;
  }
   async onClickView() {
    this.isLoading = true;
    this.entries = await firstValueFrom(
      this.trialBalanceService.getTrialBalanceEntryByIndexTableByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
        this.branchId
      )
    );

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
     var data      = this.entries;
     this.listData = new MatTableDataSource(data);
     this.listData.paginator = this.paginator;
     this.listData.sort = this.sort;
   }
 
   getRecord(data : any){
     this.selectedId = data.TransNo+'-'+data.Description+'-'+data.Credit+'-'+data.Debit;
     this.selectedData = data;
   }
 
   getTotal(column){
     let sum = 0;
     this.listData?.filteredData.forEach(x => {
       sum += +x[column] ? +x[column] : 0;
     });
     return sum;
   }
   getBranchName(){
    var branch = this.branches.find(x => x.BranchId.toLowerCase() == this.branchId.toLowerCase());
    return branch.BranchName.toUpperCase()+' BRANCH';
   }
   onDBLClick(data){
    
   }
 
   async onClickPrint(){
     var url = this.router.serializeUrl(
       this.router.createUrlTree(['print/printtrialbalance'])
     );
     var data:any = this.listData.filteredData;
      var title = this.getBranchName()+' - '+'TRIAL BALANCE FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
     this.printService.popupWindow(url, 'printtrialbalance', window, 800, 800);
     localStorage.setItem('Data', JSON.stringify(data));
     localStorage.setItem('Title', title);
   }
 
 
   
   onContextMenu(event: MouseEvent, data: any) {
     if(this.contextButtons.length > 0){
       event.preventDefault();
       this.getRecord(data);
       this.contextMenuPosition.x = event.clientX + 'px';
       this.contextMenuPosition.y = event.clientY + 'px';
       this.contextMenu.menuData = { 'data': data };
       this.contextMenu.menu.focusFirstItem('mouse');
       this.contextMenu.openMenu();
     }
     
   }

}
