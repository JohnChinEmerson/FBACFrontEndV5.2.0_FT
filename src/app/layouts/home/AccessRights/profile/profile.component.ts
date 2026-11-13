import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { UserAccountsService } from 'src/app/services/User/user-accounts.service';
import { UserLogsService } from 'src/app/services/User/user-logs.service';
import { AuthService } from 'src/app/services/auth.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { ChangePasswordUIComponent } from '../change-password-ui/change-password-ui.component';
import { ColumnTypeConfig, MatTableService } from 'src/app/services/mat-table.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userLogs      :any[];
  searchKey     : string = "";
  listData      : MatTableDataSource<any>;
  defaultColumns: string[] = [
    'TransDate',
    'UserInterface',
    'Action',
    'Subject'
  ];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: ['TransDate'],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  @ViewChild(MatPaginator) paginator: MatPaginator ;
  constructor(
    private dialog            : MatDialog,
    private ul_service        : UserLogsService,
    private auth_service      : AuthService,
    private uaService         : UserAccountsService,
    private matTableService : MatTableService, 
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.FetchRecords();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  applyFilter(){
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  private async FetchRecords()
  {
    this.userLogs = await firstValueFrom(this.ul_service.getUserActivitiesByUserId(this.auth_service.LoginId))
    this.DisplayRecords();
  }

  DisplayRecords()
  {
    var data = this.userLogs;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
  }
  clearSearch(){
    this.searchKey = "";
    this.applyFilter();
  }
  selectedStatus(){
    this.DisplayRecords();
  }
 async onCreate(){
  var account = await firstValueFrom(this.uaService.getUserAccountById(this.auth_service.LoginId));

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data        = ([account, this.auth_service.BranchId]);
    this.dialog.open(EditProfileComponent,dialogConfig);
  }

  async changePassword(){
    var account:any = await firstValueFrom(this.uaService.getUserAccountById(this.auth_service.LoginId));
    var branchId    = (this.auth_service.Branch) ? this.auth_service.Branch.BranchId : 'NA';
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
      dialogConfig.data        = ([account, branchId]);
    this.dialog.open(ChangePasswordUIComponent,dialogConfig);
  }
}
