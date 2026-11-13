import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AccessRightsService } from 'src/app/services/User/access-rights.service';
import { NotificationService } from 'src/app/services/notification.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { AuthService } from 'src/app/services/auth.service';
import { not } from '@angular/compiler/src/output/output_ast';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { AccessRightMenusService } from 'src/app/services/User/access-right-menus.service';
import { AccessRightSubMenusService } from 'src/app/services/User/access-right-sub-menus.service';
import { Router } from '@angular/router';
import { AccessRightSubMenuButtonsService } from 'src/app/services/User/access-right-sub-menu-buttons.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { AddAccessRightComponent } from '../add-access-right/add-access-right.component';
import { AddAccessRightMenusUIComponent } from '../add-access-right-menus-ui/add-access-right-menus-ui.component';
import { AddAccessRightSubMenusUIComponent } from '../add-access-right-sub-menus-ui/add-access-right-sub-menus-ui.component';
import { AddAccessRightSubMenuButtonsUIComponent } from '../add-access-right-sub-menu-buttons-ui/add-access-right-sub-menu-buttons-ui.component';

@Component({
  selector: 'app-access-rights',
  templateUrl: './access-rights.component.html',
  styleUrls: ['./access-rights.component.css']
})
export class AccessRightsComponent implements OnInit {
  accessRightsMenus: any[];
  accessRightsSubMenus: any[];
  searchKey: string = "";
  searchKey2: string = "";
  searchKey3: string = "";
  accessRightId: any;
  recordStatus: string;
  selectedRowIndex: any;
  selectedData: any = {
    MenuId: 'NA'
  };
  listData: MatTableDataSource<any>;
  listData2: MatTableDataSource<any>;
  listData3: MatTableDataSource<any>;

  defaultColumns: string[] = [
    'MenuName',
  ];
  defaultColumns2: string[] = [
    'SubMenuName',
  ];
  defaultColumns3: string[] = [
    'SubMenuButtonName',
  ];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  columnTypeMap3: { [key: string]: string } = {};
  
  accessRights: any[];
  branches : any;
  branchId : any; 
  pageSizeOptions: any = this.matTableService.pageSizeOptions();
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;
  selectedSubMenuId: any;
  selectedSubMenu: any;
  accessRightsSubMenuButtons: any;
  DeleteType: string;
  selectedSubMenuButtonId: any;
  selectedSubMenuButton: any;
  constructor(
    private dialog: MatDialog,
    private acmService: AccessRightMenusService,
    private acsmService: AccessRightSubMenusService,
    private acsmbService: AccessRightSubMenuButtonsService,
    private notif: NotificationService,
    private acService: AccessRightsService,
    private branchesService    : BranchesService,
    public auth              : AuthService,
    public toolBoxService              : ToolBoxService,
    public matTableService : MatTableService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.columnTypeMap3 = this.buildColumnTypeMap(this.defaultColumns3);
    await this.getCBOBranches();
    await this.LoadAccessRights();
    this.acService.requiredRefresh.subscribe(() => {
      this.LoadAccessRights();
    })

    this.acmService.requiredRefresh.subscribe(x => {
      this.GetAccessRightMenus();
    })
    this.acsmService.requiredRefresh.subscribe(() => {
      this.LoadSubMenus();
    })
    this.acsmbService.requiredRefresh.subscribe(() => {
      this.LoadSubMenuButtons();
    })
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


  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  applyFilter2() {
    this.listData2.filter = this.searchKey2.trim().toLocaleLowerCase();
  }

  applyFilter3() {
    this.listData3.filter = this.searchKey3.trim().toLocaleLowerCase();
  }
 async LoadAccessRights() {
    this.accessRights = await firstValueFrom(this.acService.getCBOAccessRightsAll(this.branchId));
    this.accessRightId = this.accessRights[0].id;
    this.GetAccessRightMenus();
  }

 async GetAccessRightMenus() {
    this.accessRightsMenus = await firstValueFrom(this.acmService.getAccessRightMenusByAccessRightId(this.accessRightId, this.branchId));
    this.DisplayRecords();

    this.selectedRowIndex = null;

    this.listData2 = new MatTableDataSource([]);
    this.listData2.paginator = this.paginator2;

    this.listData3 = new MatTableDataSource([]);
    this.listData3.paginator = this.paginator3;

  }
  async LoadSubMenus() {
    this.accessRightsSubMenus = await firstValueFrom(this.acsmService.getAccessRightSubMenusByAccessRightIdByMenuId(this.accessRightId,this.selectedData.MenuId, this.branchId));
    this.DisplayRecords2();

    this.listData3 = new MatTableDataSource([]);
    this.listData3.paginator = this.paginator3;
  }

  async LoadSubMenuButtons() {
    this.accessRightsSubMenuButtons = await firstValueFrom(this.acsmbService.getAccessRightSubMenuButtonsByAccessRightIdBySubMenuId(this.accessRightId,this.selectedSubMenu.SubMenuId, this.branchId));
    this.DisplayRecords3();
  }
  DisplayRecords() {
    var data = this.accessRightsMenus;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator1;
  }
  DisplayRecords2() {
    var data = this.accessRightsSubMenus.filter(x => x.MenuId === this.selectedData.MenuId && x.AccessRightId === this.selectedData.AccessRightId);
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
  }

  DisplayRecords3() {
    var data = this.accessRightsSubMenuButtons.filter(x => x.SubMenuId === this.selectedSubMenu.SubMenuId && x.AccessRightId === this.selectedSubMenu.AccessRightId);
    this.listData3 = new MatTableDataSource(data);
    this.listData3.paginator = this.paginator3;
  }
  clearSearch() {
    this.searchKey = "";
    this.applyFilter();
  }
  clearSearch2() {
    this.searchKey2 = "";
    this.applyFilter2();
  }
  clearSearch3() {
    this.searchKey3 = "";
    this.applyFilter3();
  }
  selectedStatus() {
    this.GetAccessRightMenus();
    this.DisplayRecords();
  }
  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = this.branchId;
    this.dialog.open(AddAccessRightComponent, dialogConfig);
  }
  addMenu() {
    if (this.accessRightId == undefined) {
      return this.notif.toastrWarning('No AccessRight Selected.');
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = ([this.accessRightId, this.branchId]); // passing data here
    this.dialog.open(AddAccessRightMenusUIComponent, dialogConfig);
  }
  selectedRow(data: any) {
    this.selectedRowIndex = data.MenuId;
    this.selectedData = data;
    this.LoadSubMenus();
  }
  selectedRow2(data: any) {
    this.selectedSubMenuId = data.SubMenuId;
    this.selectedSubMenu = data;
    this.LoadSubMenuButtons();
  }

  selectedRow3(data: any) {
    this.selectedSubMenuButtonId = data.SubMenuButtonId;
    this.selectedSubMenuButton = data;
  }

  setUpdate(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = data; // passing data here
    this.dialog.open(AddAccessRightComponent, dialogConfig);
  }

  onDeleteAccessRightMenu(id: string) {
    this.notif.popupWarning("Delete Record", "Are you sure you want to delete this record?").then((result) => {
      if (result.isConfirmed) {
             this.acmService.deleteAccessRightMenuById(id).subscribe({
            next: (res) => {
              this.notif.toastrSuccess(res.message);
            },
            error: (e) => {
              this.notif.toastrWarning(e.error.message);
            }
          })
      }
    });
  }
  onDeleteAccessRightSubMenu(id: string) {
    this.notif.popupWarning("Delete Record", "Are you sure you want to delete this record?").then((result) => {
      if (result.isConfirmed) {
             this.acsmService.deleteAccessRightSubMenuById(id).subscribe({
            next: (res) => {
              this.notif.toastrSuccess(res.message);
            },
            error: (e) => {
              this.notif.toastrWarning(e.error.message);
            }
          })
      }
    });
  }
  onDeleteAccessRightSubMenuButton(id: string) {
    this.notif.popupWarning("Delete Record", "Are you sure you want to delete this record?").then((result) => {
      if (result.isConfirmed) {
             this.acsmbService.deleteAccessRightSubMenuButtonById(id).subscribe({
            next: (res) => {
              this.notif.toastrSuccess(res.message);
            },
            error: (e) => {
              this.notif.toastrWarning(e.error.message);
            }
          })
      }
    });
  }
  addSubMenu(){
    if(!this.selectedRowIndex){
      return this.notif.toastrWarning('No Menu Selected!');
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = ([this.selectedData, this.branchId]);
    this.dialog.open(AddAccessRightSubMenusUIComponent, dialogConfig);
  }

  addSubMenuButton(){
    if(!this.selectedSubMenuId){
      return this.notif.toastrWarning('No SubMenu Selected!');
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = ([this.selectedSubMenu, this.branchId]);
    this.dialog.open(AddAccessRightSubMenuButtonsUIComponent, dialogConfig);
  }


  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(event: MouseEvent, data: any, type) {
      event.preventDefault();
      this.DeleteType = type;
      if(this.DeleteType == 'menu'){
          this.selectedRow(data);
      }
      if(this.DeleteType == 'submenu'){
        this.selectedRow2(data);
      }
      if(this.DeleteType == 'button'){
        this.selectedRow3(data);
      }
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
  }


}
