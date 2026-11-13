import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CashflowStatementsService } from 'src/app/services/Accounting/cashflow-statements.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';
import { CashflowLedgerUIComponent } from '../cashflow-ledger-ui/cashflow-ledger-ui.component';

@Component({
  selector: 'app-cashflow-statements',
  templateUrl: './cashflow-statements.component.html',
  styleUrls: ['./cashflow-statements.component.css']
})
export class CashflowStatementsComponent implements OnInit {
 selectedId    :any;
   selectedData  : any;
   selectedAccountTitle : string;
   title      : string;
   isLoading     : boolean = false;
   loaded : boolean = false;
   dateFrom        : any = new Date();
   dateTo          : any = new Date();
   contextMenuPosition = { x: '0px', y: '0px' };
 
   toolButtons     = [
     {'Label'   : 'View','Function'           : () => this.onClickView(),'Disabled': true,}, 
     {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
   ];
   contextButtons  =  [];
   defaultColumns  = ['AccountTitle','PreviousAmount',  'Amount', 'EndingAmount'];
   mergeColumns    = this.defaultColumns;
   incomeStatements: any[];
   branches : any;
   branchId : any;
   constructor(
     private dialog          : MatDialog,
     private cashflowStatementsService    : CashflowStatementsService,
     public matTableService           : MatTableService,
     private dateTimesService           : DateTimesService,
     private router : Router,
     private printService : PrintService,
    private branchesService : BranchesService,  
   ) { }
 
   async ngOnInit(): Promise<void> {
    await this.getCBOBranches();
   }
   async getCBOBranches(){
    this.branches = await firstValueFrom(this.branchesService.getBranchesCBO());
    this.branchId = this.branches[0].BranchId;
  }
   async onClickView() {
    this.isLoading = true;
    this.loaded = false;
    this.incomeStatements = await firstValueFrom(
      this.cashflowStatementsService.getCashflowStatementsByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
        this.branchId
      )
    );

    this.isLoading = false;
    this.displayRecords();
  }
  
   displayRecords(){
    this.title  = this.getBranchName()+' - '+'CASHFLOW STATEMENTS FROM '+ this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) +' TO '+this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo));
    this.loaded = true;
   }
 

   getRecord(data : any, show){
    if(!data.Type ){
      this.selectedData = data;
      this.selectedAccountTitle = data.AccountTitle;
      if(show){
        var popUpData:any = {
          'AccountTitle' : this.selectedAccountTitle, 
          'DateFrom' :this.dateFrom , 
          'DateTo' :this.dateTo,
          'Source' : 'financial statements' 
        };
        this.cashflowLedger(popUpData);
      }
    }
   }

   
   onDBLClick(data){
    this.getRecord(data, true);
   }
   cashflowLedger(popUpData){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '2000px';
      dialogConfig.data        = popUpData;
      this.dialog.open(CashflowLedgerUIComponent,dialogConfig);
   }
   getBranchName(){
    var branch = this.branches.find(x => x.BranchId.toLowerCase() == this.branchId.toLowerCase());
    return branch.BranchName.toUpperCase()+' BRANCH';
   }

   async onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcashflowstatements']));
    this.printService.popupWindow(url, 'printcashflowstatements', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(this.incomeStatements));
    localStorage.setItem('Title', this.title);
   }

}
