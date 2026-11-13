import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { SelectedMenuUIComponent } from '../selected-menu-ui/selected-menu-ui.component';
import { SubMenuButtonsService } from 'src/app/services/User/sub-menu-buttons.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';

@Component({
  selector: 'app-sub-menu-buttons-ui',
  templateUrl: './sub-menu-buttons-ui.component.html',
  styleUrls: ['./sub-menu-buttons-ui.component.css']
})
export class SubMenuButtonsUIComponent implements OnInit {
  SubMenuButtons: any[];
  searchKey: string = "";
  listData: MatTableDataSource<any>;
  BranchId : any;
  defaultColumns: string[] = [
    'SubMenuButtonName',
    'actions'
  ];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSizeOptions : any = this.matTableService.pageSizeOptions();
  SubMenu: any;
  Menu: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public updateData: any, // passing data here from update
    private subMenuButtonsService: SubMenuButtonsService,
    private notif: NotificationService,
    public matTableService: MatTableService,
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.SubMenu = this.updateData[0];
    this.Menu = this.updateData[1];
    this.BranchId = this.updateData[2];
    this.FetchRecords();
    this.subMenuButtonsService.requiredRefresh.subscribe(x=>{
      this.FetchRecords();
    })
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  private async FetchRecords() {
    this.SubMenuButtons = await firstValueFrom(this.subMenuButtonsService.getSubMenuButtonsBySubMenuId(this.SubMenu.id, this.BranchId));
    this.DisplayRecords();
  }

  DisplayRecords() {
    var data = this.SubMenuButtons;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
  }
  clearSearch() {
    this.searchKey = "";
    this.applyFilter();
  }

  onClickSave(){
    if(!this.searchKey)
      return this.notif.toastrWarning('Empty Field.');
    if(this.searchKey == '')
      return this.notif.toastrWarning('Empty Field.');

    var data:any = {
      'SubMenuButtonName' : this.searchKey,
      'SubMenuId': this.SubMenu.id,
      'SubMenuName': this.SubMenu.SubMenuName,
      'MenuId': this.Menu.id,
      'MenuName': this.Menu.MenuName,
    };

    this.subMenuButtonsService.saveEditSubMenuButton(data, this.BranchId).subscribe({
        next:(res)=>{
          this.searchKey = undefined;
          this.notif.toastrSuccess(res.message);
            this.FetchRecords();
        },
        error:(err)=>{
          this.notif.toastrError(err.error);
        },
    });
  }
  onDelete(id: string) {
    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
        this.subMenuButtonsService.deleteSubMenuButtonById(id).subscribe({
            next:(res)=>{
              this.notif.toastrSuccess(res.message);
              this.FetchRecords();
            },
            error:(err)=>{
              this.notif.toastrError(err.error);
            },
        });
      }
    });
  }
}
