import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { MenusService } from 'src/app/services/User/menus.service';
import { SubMenusService } from 'src/app/services/User/sub-menus.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { MenusUIComponent } from '../menus-ui/menus-ui.component';
import { SelectedSubMenuUIComponent } from '../selected-sub-menu-ui/selected-sub-menu-ui.component';
import { SubMenuButtonsUIComponent } from '../sub-menu-buttons-ui/sub-menu-buttons-ui.component';
import { HomeComponent } from '../../home.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user-menus',
  templateUrl: './user-menus.component.html',
  styleUrls: ['./user-menus.component.css']
})
export class UserMenusComponent implements OnInit {
  Menus: any[];
  searchKey: string = "";
  pageSizeOptions   :any = this.matTableService.pageSizeOptions();
  listData: MatTableDataSource<any>;
  MenuId:string;
  selectedId:string;
  selectedData: any;

  SubMenus  : any;
  SelectedMenu: any;
  isLoading : boolean = false;

  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'New Menu','Function'        : () => this.onClickNew(),'Disabled': true,}, 
    {'Label'   : 'New SubMenu','Function'     : () => this.onClickAddSubMenu(),'Disabled': true,}, 
  ];
  contextButtons  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Delete','Function'          : () => this.onClickDelete(),'Disabled': true,}, 
    {'Label'   : 'Add Button','Function'      : () => this.onClickButtons(),'Disabled': true,}, 
  ];
  defaultColumns  = ['Order',  'SubMenuName', 'RouteName'];
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
    private dialog            : MatDialog,
    private menuService       : MenusService,
    private subMenusService   : SubMenusService,
    private notif             : NotificationService,
    private branchesService    : BranchesService,
    public auth               : AuthService,
    public toolBoxService     : ToolBoxService,
    public matTableService   : MatTableService,
    private homeTs            : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.getCBOBranches();
    await this.homeTs.getButtons();
    this.onClickView();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.menuService.requiredRefresh.subscribe(x=>{
      this.onClickView();
    });
    this.subMenusService.requiredRefresh.subscribe(x=>{
      this.onClickGetSubMenu(this.SelectedMenu);
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

  async onClickView() {
    this.isLoading = true;
    this.Menus = await firstValueFrom(this.menuService.getMenus(this.branchId));
    this.isLoading = false;
    this.MenuId = this.Menus[0].id;
    this.onClickGetSubMenu(this.Menus[0]);
  }

  displayRecords() {
    var data = this.SubMenus;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
  }
  selectedStatus() {
    this.displayRecords();
  }
  onClickNew() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = this.branchId;
    this.dialog.open(MenusUIComponent,dialogConfig);
  }
  onClickAddSubMenu(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data         = (['', this.SelectedMenu, this.branchId]);
    this.dialog.open(SelectedSubMenuUIComponent,dialogConfig);
  }
  onClickEdit() {
    if (!this.matTableService.checkNull(this.selectedId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data         = ([this.selectedData, this.SelectedMenu, this.branchId]);
    this.dialog.open(SelectedSubMenuUIComponent,dialogConfig);
  }
  onClickDelete() {
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.notif.popupWarning("Delete Record","Are you sure to delete this record ?").then((result) => {
      if (result.value) {
        this.subMenusService.deleteSubMenuById(this.selectedId).subscribe({
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

  onClickButtons() {
    if (!this.matTableService.checkNull(this.selectedId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data         = ([this.selectedData, this.SelectedMenu, this.branchId]);
    this.dialog.open(SubMenuButtonsUIComponent,dialogConfig);
  }
  async onClickGetSubMenu(data){
    this.SubMenus = await firstValueFrom(this.subMenusService.getSubMenusByMenuId(this.MenuId, this.branchId));
    this.SelectedMenu = data;
    this.displayRecords();
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
