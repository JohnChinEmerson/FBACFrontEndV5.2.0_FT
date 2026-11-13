import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { PopupsService } from 'src/app/services/Support/popups.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { UserAccountsService } from 'src/app/services/User/user-accounts.service';
import { HomeComponent } from '../../home.component';
import { PopupAccessRightsService } from 'src/app/services/Support/popup-access-rights.service';
import { PopupsUIComponent } from '../popups-ui/popups-ui.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-access-rights-ui',
  templateUrl: './popup-access-rights-ui.component.html',
  styleUrls: ['./popup-access-rights-ui.component.css']
})
export class PopupAccessRightsUIComponent implements OnInit {
  popups: any=[];
  popupId: string;
  popupAccessRights: any=[];
  users: any=[];
  usersToSave:any =[];
  popupsToRemove:any=[];
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
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild(MatPaginator) paginator2    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu2: MatMenuTrigger;
  
  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'Add Users','Function'            : () => this.onClickAdd(),'Disabled': true,}, 
    {'Label'   : 'Popups','Function'            : () => this.onClickPopups(),'Disabled': true,}, 
  ];
  toolButtons2     = [
    {'Label'   : 'Remove Users','Function'            : () => this.onClickRemove(),'Disabled': true,}, 
  ];
  defaultColumns  = ['UserFullName'];
  addedColumns      = ['actions'];
  mergeColumns    = this.addedColumns.concat(this.defaultColumns);
  constructor(
    private popupsService : PopupsService,
    private dialog              : MatDialog,
    private popupAccessRightsService : PopupAccessRightsService,
    private userAccountsService : UserAccountsService,
    private toolBoxService : ToolBoxService,
    private notificationService : NotificationService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, null, null);
    await this.getPopUpConfigs();
  }
  async getUsers(){
    this.isLoading2 = true;
    this.users = await firstValueFrom(this.userAccountsService.getCBOUserAccounts());
    if(this.popups)
      this.isLoading2 = false;
    this.displayRecords1();
  }
  displayRecords1() {
    const data = this.users.filter(user =>
      !this.popupAccessRights.some(access => access.UserId === user.id)
    );
  
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }
  
  async getPopUpConfigs(){
    this.isLoading = true;
    this.popups = await firstValueFrom(this.popupsService.getPopupConfigs());
    if(this.popups)
      this.isLoading = false;
    this.displayRecords2();
  }

  async getPopUpAccessRights(){
    this.isLoading = true;
    this.popupAccessRights = await firstValueFrom(this.popupAccessRightsService.getPopupAccessRightsByPopupId(this.popupId));
    if(this.popupAccessRights)
      this.isLoading = false;
    this.displayRecords2();

    await this.getUsers();
  }

  displayRecords2(){
    var data = this.popupAccessRights;
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
    if(this.usersToSave.length == 0)
        return this.notificationService.toastrWarning("No Check Records.");

    this.popupAccessRightsService.savePopupAccessRights(this.popupId, this.usersToSave).subscribe({
      next:async (res)=>{
        this.notificationService.toastrSuccess(res.message);
        this.usersToSave = [];
        await this.getPopUpAccessRights();
        this.displayRecords1();
      },
      error:(err)=> {
        this.notificationService.toastrError(err.error.message);
      },
    });
  }

  onClickRemove(){
     if(this.popupsToRemove.length == 0)
        return this.notificationService.toastrWarning("No Check Records.");

    this.popupAccessRightsService.deletePopupAccessRights(this.popupsToRemove).subscribe({
      next:async (res)=>{
        this.notificationService.toastrSuccess(res.message);
        this.popupsToRemove = [];
        await this.getPopUpAccessRights();
        this.displayRecords1();
      },
      error:(err)=> {
        this.notificationService.toastrError(err.error.message);
      },
    });

  }

  onClickPopups(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(PopupsUIComponent,dialogConfig);
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
      this.popupsToRemove.push(data);
    } else {
      this.popupsToRemove = this.popupsToRemove.filter(
        (item) => item.UserFullName !== data.UserFullName
      );
    }
  }
  
  onClose(){
    this.toolBoxService.onHome();
  }
}
