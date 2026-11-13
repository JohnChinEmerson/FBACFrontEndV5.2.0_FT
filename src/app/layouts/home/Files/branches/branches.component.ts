import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { _url } from 'src/global-variables';
import { HomeComponent } from '../../home.component';
import { BranchUsersUIComponent } from '../branch-users-ui/branch-users-ui.component';
import { BranchUIComponent } from '../branch-ui/branch-ui.component';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {
  branches           : any[];
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
  ];

  contextButtons  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Delete','Function'          : () => this.onClickDelete(),'Disabled': true,}, 
    {'Label'   : 'Users','Function'           : () => this.onClickUsers(),'Disabled': true,}, 
  ];
  defaultColumns  = ['BranchName'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private branchesService        : BranchesService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  async onClickView(){
    this.isLoading = true;
    this.branches = await firstValueFrom(this.branchesService.getBranchesToDisplay());
    if(this.branches)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.branches;
    this.listData =  new MatTableDataSource(data);
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
    this.selectedId = data.BranchId;
    this.selectedData = data;
  }

  async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data         = this.selectedData;
    this.dialog.open(BranchUIComponent, dialogConfig).beforeClosed().subscribe(x => {
        this.onClickView();
    });
  }

  onClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record","Are you sure to delete this recrd?").then((result) => {
      if (result.value) {
        this.branchesService.deleteBranch(this.selectedData.BranchId).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.onClickView();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClickUsers(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = this.selectedData;
    this.dialog.open(BranchUsersUIComponent,dialogConfig);
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
