import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { MenusService } from 'src/app/services/User/menus.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SelectedMenuUIComponent } from '../selected-menu-ui/selected-menu-ui.component';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';

@Component({
  selector: 'app-menus-ui',
  templateUrl: './menus-ui.component.html',
  styleUrls: ['./menus-ui.component.css']
})
export class MenusUIComponent implements OnInit {
  Menus: any[];
  searchKey: string = "";
  listData: MatTableDataSource<any>;
  BranchId : any;
  defaultColumns: string[] = [
    'Order',
    'MenuName',
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
  constructor(
    @Inject(MAT_DIALOG_DATA) public updateData: any, // passing data here from update
    private dialog: MatDialog,
    private menuService: MenusService,
    private notif: NotificationService,
    public matTableService: MatTableService,
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.BranchId = this.updateData;
    this.FetchRecords();
    this.menuService.requiredRefresh.subscribe(x=>{
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
    this.Menus = await firstValueFrom(this.menuService.getMenus(this.BranchId));
    this.DisplayRecords();
  }

  DisplayRecords() {
    var data = this.Menus;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
  }
  clearSearch() {
    this.searchKey = "";
    this.applyFilter();
  }

  onCreate(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = (['', this.BranchId]);
    this.dialog.open(SelectedMenuUIComponent,dialogConfig);
  }

  setUpdate(data){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = ([data, this.BranchId]);
    this.dialog.open(SelectedMenuUIComponent,dialogConfig);
  }

  onDelete(id: string) {
    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
        this.menuService.deleteMenuById(id).subscribe({
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

}
