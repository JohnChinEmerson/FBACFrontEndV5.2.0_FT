import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BalanceSheetService } from 'src/app/services/Accounting/balance-sheet.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { PrintService } from 'src/app/services/print.service';
import { GeneralLedgerUIComponent } from '../general-ledger-ui/general-ledger-ui.component';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.css']
})
export class BalanceSheetComponent implements OnInit {
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
      private balanceSheetService    : BalanceSheetService,
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
      this.balanceSheetService.getBalanceSheetByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
        this.branchId
      )
    );

    this.isLoading = false;
    this.displayRecords();
  }
  
   displayRecords(){
    this.title  = this.getBranchName()+' - '+'BALANCE SHEET FROM '+ this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) +' TO '+this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo));
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
        this.generalLedger(popUpData);
      }
    }
   }
   getBranchName(){
    var branch = this.branches.find(x => x.BranchId.toLowerCase() == this.branchId.toLowerCase());
    return branch.BranchName.toUpperCase()+' BRANCH';
   }
   onDBLClick(data){
    this.getRecord(data, true);
   }
   generalLedger(popUpData){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '2000px';
      dialogConfig.data        = popUpData;
      this.dialog.open(GeneralLedgerUIComponent,dialogConfig);
   }


   async onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printbalancesheet']));
    this.printService.popupWindow(url, 'printbalancesheet', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(this.incomeStatements));
    localStorage.setItem('Title', this.title);
   }

}
