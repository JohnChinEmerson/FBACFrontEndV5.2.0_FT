import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BranchAccessService } from 'src/app/services/Config/branch-access.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { UserAccountsService } from 'src/app/services/User/user-accounts.service';
import { HomeComponent } from '../../home.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-branch-users-ui',
  templateUrl: './branch-users-ui.component.html',
  styleUrls: ['./branch-users-ui.component.css']
})
export class BranchUsersUIComponent implements OnInit {
  branchAccess: any=[];
  branch : any;
  users: any=[];
  usersToSave:any =[];
  usersToRemove:any=[];
  selectedData    : any;
  selectedId      : number = 0;
  selectedData2    : any;
  selectedId2      : number = 0;
  searchKey       : string = "";
  searchKey2       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  listData2        : MatTableDataSource<any>;
  pageSizeOptions2 :any = this.matTableService.pageSizeOptions();
  isLoading2       : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild('paginator') paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild('paginator2') paginator2    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu2: MatMenuTrigger;
  
  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'Add','Function'            : () => this.onClickAdd(),'Disabled': true,}, 
  ];
  toolButtons2     = [
    {'Label'   : 'Remove','Function'            : () => this.onClickRemove(),'Disabled': true,}, 
  ];
  defaultColumns  = ['actions','UserFullName',];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private branchAccesssService : BranchAccessService,
    private userAccountsService : UserAccountsService,
    private dialogRef           : MatDialogRef<BranchUsersUIComponent>,
    private notificationService : NotificationService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
    
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.branch = this.data;
    await this.getBranchUsers();
    this.getUsers();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }
  async getUsers(){
    this.isLoading2 = true;
    this.users = await firstValueFrom(this.userAccountsService.getCBOUserAccountsByBranchId(this.branch.BranchId));
    if(this.branchAccess)
      this.isLoading2 = false;
    this.displayRecords1();
  }
  displayRecords1() {
    const data = this.users.filter(user =>
      !this.branchAccess.some(access => access.UserId.toString() === user.id.toString())
    );
  
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }
  
  

  async getBranchUsers(){
    this.isLoading = true;
    this.branchAccess = await firstValueFrom(this.branchAccesssService.getBranchAccessToDisplayByBranchId(this.branch.BranchId));
    if(this.branchAccess)
      this.isLoading = false;
    this.displayRecords2();
  }

  displayRecords2(){
    var data = this.branchAccess;
    this.listData2 =  new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
    this.listData2.sort = this.sort2;
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }
  applyFilter2(){
    this.matTableService.applyFilter(this.listData2, this.searchKey2);
  }

  clearSearch2(){
    this.searchKey2 =  this.matTableService.clearSearch(this.listData2);
  }

  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }
  getRecord2(data : any){
    this.selectedId2 = data.id;
    this.selectedData2 = data;
  }
  onClickAdd(){
    this.branchAccesssService.saveBranchAccess(this.usersToSave, this.branch.BranchId).subscribe({
      next:async (res)=>{
        this.notificationService.toastrSuccess(res.message);
        this.usersToSave = [];
        await this.getBranchUsers();
        this.displayRecords1();
      },
      error:(err)=> {
        this.notificationService.toastrError(err.error.message);
      },
    });
  }

  onClickRemove(){
    this.branchAccesssService.deleteBranchAccess(this.usersToRemove).subscribe({
      next:async (res)=>{
        this.notificationService.toastrSuccess(res.message);
        this.usersToRemove = [];
        await this.getBranchUsers();
        this.displayRecords1();
      },
      error:(err)=> {
        this.notificationService.toastrError(err.error.message);
      },
    });

  }

  onCheckToSave(data, value) {
    if (value) {
      this.usersToSave.push(data);
    } else {
      this.usersToSave = this.usersToSave.filter(
        (item) => item.UserFullName !== data.UserFullName
      );
    }
  }

  onCheckToRemove(data, value) {
    if (value) {
      this.usersToRemove.push(data);
    } else {
      this.usersToRemove = this.usersToRemove.filter(
        (item) => item.UserFullName !== data.UserFullName
      );
    }
  }

  onClose(){
    this.dialogRef.close();
  }


}
