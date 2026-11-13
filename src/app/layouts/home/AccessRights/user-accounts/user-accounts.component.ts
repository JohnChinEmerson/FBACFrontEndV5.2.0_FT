import { Component, OnInit, ViewChild } from '@angular/core';
import { UserAccountsService } from 'src/app/services/User/user-accounts.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { ChangePasswordUIComponent } from '../change-password-ui/change-password-ui.component';
import { SelectedUserAccountUIComponent } from '../selected-user-account-ui/selected-user-account-ui.component';
import { MatSort } from '@angular/material/sort';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-user-accounts',
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.css']
})
export class UserAccountsComponent implements OnInit {
  UserAccounts  : any[];
  searchKey     : string = "";
  selectedId    : number = 0;
  selectedData  : any;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  listData      : MatTableDataSource<any>;
  isLoading     : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'New','Function'             : () => this.onClickNew(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];
  contextButtons  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Delete','Function'          : () => this.onClickDelete(),'Disabled': true,}, 
    {'Label'   : 'Reset Password','Function'  : () => this.onClickResetPassword(),'Disabled': true,}, 
    {'Label'   : 'Change Password','Function' : () => this.onClickChangePassword(),'Disabled': true,}, 
    
  ];
  defaultColumns  = ['Username',  'UserFullName', 'AccessRightName', 'Edition', 'ComputerName','LastLogin'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: ['LastLogin'],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};

  branches : any;
  branchId : any; 
  constructor(
    private dialog          : MatDialog,
    private user_service    : UserAccountsService,
    private notif           : NotificationService,
    private branch_service    : BranchesService,
    public auth              : AuthService,
    private homeTs              : HomeComponent,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private router : Router,
    private printService : PrintService,
    private branchesService : BranchesService,  
  ) { }


  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.getCBOBranches();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.user_service.requiredRefresh.subscribe(()=>{
      this.onClickView();
    });
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
    this.UserAccounts = await firstValueFrom(this.user_service.getUserAccountsToDisplay(this.branchId));
    if(this.UserAccounts)
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
    var data      = this.UserAccounts;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
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
    dialogConfig.width        = '500px';
    dialogConfig.data        = (['', this.branchId]);
    this.dialog.open(SelectedUserAccountUIComponent,dialogConfig);
  }

  async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var account:any = await firstValueFrom(this.user_service.getUserAccountById(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = ([account, this.branchId]);
    this.dialog.open(SelectedUserAccountUIComponent,dialogConfig);
  }

  onClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
        this.user_service.deleteUserAccountById(this.selectedId, this.branchId).subscribe({
            next:(res)=>{
              this.notif.toastrSuccess(res.message);
            },
            error:(err)=>{
              this.notif.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickResetPassword(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.notif.popupWarning("Reset Password","Are you sure to reset password to username ?").then((result) => {
      if (result.value) {
        this.user_service.resetPasswordById(this.selectedId, this.branchId).subscribe({
            next:(res)=>{
              this.notif.toastrSuccess(res.message);
            },
            error:(err)=>{
              this.notif.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickPrint(){
    var url = this.router.serializeUrl(
      this.router.createUrlTree(['print/printuseraccounts'])
    );
    var data:any = this.listData.filteredData;
    this.printService.popupWindow(url, 'UserAccounts', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', 'USER ACCOUNTS');
  }

  async onClickChangePassword(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var account:any = await firstValueFrom(this.user_service.getUserAccountById(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = ([account, this.branchId]);
    this.dialog.open(ChangePasswordUIComponent,dialogConfig);
  }

  
  onContextMenu(event: MouseEvent, data: any) {
      event.preventDefault();
      this.getRecord(data);
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
  }
}
