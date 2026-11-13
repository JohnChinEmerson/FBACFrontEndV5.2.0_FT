import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { CashierAccessRightsService } from '../../../../services/Cashiering/cashier-access-rights.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { HomeComponent } from '../../home.component';
import { firstValueFrom } from 'rxjs';
import { UserAccountsService } from 'src/app/services/User/user-accounts.service';

@Component({
  selector: 'app-cashiering-access-rights',
  templateUrl: './cashiering-access-rights.component.html',
  styleUrls: ['./cashiering-access-rights.component.css']
})
export class CashieringAccessRightsComponent implements OnInit {
  cashierAccessRight: any=[];
  users: any=[];
  usersToSave:any =[];
  cashiersToRemove:any=[];
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
  defaultColumns  = ['actions','UserFullName'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};

  constructor(
    private cashierAccessRightsService : CashierAccessRightsService,
    private userAccountsService : UserAccountsService,
    private toolBoxService : ToolBoxService,
    private notificationService : NotificationService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, null, null);
    await this.getCashiers();
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
    this.users = await firstValueFrom(this.userAccountsService.getCBOUserAccounts());
    if(this.cashierAccessRight)
      this.isLoading2 = false;
    this.displayRecords1();
  }
  displayRecords1() {
    const data = this.users.filter(user =>
      !this.cashierAccessRight.some(access => access.UserId === user.id)
    );
  
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }
  
  

  async getCashiers(){
    this.isLoading = true;
    this.cashierAccessRight = await firstValueFrom(this.cashierAccessRightsService.getCashierAccessRights());
    if(this.cashierAccessRight)
      this.isLoading = false;
    this.displayRecords2();
  }

  displayRecords2(){
    var data = this.cashierAccessRight;
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
    this.cashierAccessRightsService.saveCashierAccessRights(this.usersToSave).subscribe({
      next:async (res)=>{
        this.notificationService.toastrSuccess(res.message);
        this.usersToSave = [];
        await this.getCashiers();
        this.displayRecords1();
      },
      error:(err)=> {
        this.notificationService.toastrError(err.error.message);
      },
    });
  }

  onClickRemove(){
    this.cashierAccessRightsService.deleteCashierAccessRights(this.cashiersToRemove).subscribe({
      next:async (res)=>{
        this.notificationService.toastrSuccess(res.message);
        this.cashiersToRemove = [];
        await this.getCashiers();
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
      this.cashiersToRemove.push(data);
    } else {
      this.cashiersToRemove = this.cashiersToRemove.filter(
        (item) => item.UserFullName !== data.UserFullName
      );
    }
  }

  onClose(){
    this.toolBoxService.onHome();
  }


}
