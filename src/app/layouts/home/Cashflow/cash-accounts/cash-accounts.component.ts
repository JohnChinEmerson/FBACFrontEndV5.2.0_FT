import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { CashAccountUIComponent } from '../cash-account-ui/cash-account-ui.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CheckBookletsUIComponent } from '../check-booklets-ui/check-booklets-ui.component';
import { BranchesService } from 'src/app/services/Config/branches.service';

@Component({
  selector: 'app-cash-accounts',
  templateUrl: './cash-accounts.component.html',
  styleUrls: ['./cash-accounts.component.css']
})
export class CashAccountsComponent implements OnInit {

  cashAccounts: any=[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
 
  
  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'New','Function'            : () => this.onClickNew(),'Disabled': true,}, 
  ];
  contextButtons     = [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Delete','Function'            : () => this.onClickDelete(),'Disabled': true,}, 
    {'Label'   : 'Check Booklets','Function'            : () => this.onClickCheckBooklets(),'Disabled': true,}, 
  ];
  defaultColumns  = ['CashAccount', 'CashAccountType'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  branches : any;
  branchId : any; 
  constructor(
    private cashAccountsService : CashAccountsService,
    private toolBoxService : ToolBoxService,
    private notificationService : NotificationService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
    private dialog              : MatDialog,
    private branchesService : BranchesService,  
    
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.getCBOBranches();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.contextButtons, null, null);
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getCBOBranches(){
    this.branches = await firstValueFrom(this.branchesService.getBranchesCBONotAll());
    this.branchId = this.branches[0].BranchId;
  }
  async onClickView(){
    this.isLoading = true;
    this.cashAccounts = await firstValueFrom(this.cashAccountsService.getCashAccountsByBuiltIn2('no', this.branchId));
    if(this.cashAccounts)
      this.isLoading = false;
    this.displayRecords();
  }
  displayRecords() {
    var data= this.cashAccounts;
    this.listData = new MatTableDataSource(data);
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
    this.selectedId = data.id;
    this.selectedData = data;
  }

  onClickNew(){
    if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = (['',this.cashAccounts, this.branchId]);
    this.dialog.open(CashAccountUIComponent,dialogConfig).beforeClosed().subscribe(x=>{
      if(x){
        this.cashAccounts = x;
        this.displayRecords();
      }
    });
  }



  async onClickEdit(){
     if (!this.matTableService.checkNull(this.selectedId)) return;
    
      var cashAccount:any = await firstValueFrom(this.cashAccountsService.getCashAccountsById(this.selectedData.id));
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '600px';
      dialogConfig.data        = cashAccount;
      dialogConfig.data        = ([cashAccount,this.cashAccounts, this.branchId]);
      this.dialog.open(CashAccountUIComponent,dialogConfig).beforeClosed().subscribe(cashAccount=>{
        if(cashAccount){

        //update cashAccountsDisplay
        const cashAccountIndex = this.cashAccounts.findIndex(ca => ca.id === cashAccount.id);
        if (cashAccountIndex !== -1) {
          this.cashAccounts[cashAccountIndex] = cashAccount;  
        }
        this.displayRecords();
        }
      });
  }

  onClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
        this.cashAccountsService.deleteCashAccount(this.selectedData.id, this.branchId).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.cashAccounts = this.cashAccounts.filter(x => x.id != this.selectedData.id);
              this.displayRecords();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickCheckBooklets(){
    if (!this.matTableService.checkNull(this.selectedId)) return;


    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = ([this.selectedData, this.branchId]);
    this.dialog.open(CheckBookletsUIComponent,dialogConfig);
  }


  onContextMenu(event: MouseEvent, data: any) {
    this.getRecord(data);
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'data': data };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
}
