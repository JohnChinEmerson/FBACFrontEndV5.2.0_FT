import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { TablesService } from 'src/app/services/Files/tables.service';
import { MatTableService, ColumnTypeConfig } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';

// Desktop Mariosoft.Files.UI TableCategory (same layout as ItemTypesUI)
@Component({
  selector: 'app-table-categorys-ui',
  templateUrl: './table-categorys-ui.component.html',
  styleUrls: ['./table-categorys-ui.component.css']
})
export class TableCategorysUIComponent implements OnInit {
  tableCategorys    : any;
  searchKey         : string = "";
  selectedData      : any;
  selectedId        : number = 0;
  pageSizeOptions   : number[] = this.matTableService.pageSizeOptions();
  listData          : MatTableDataSource<any>;

  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  contextButtons = [
    { 'Label': 'Delete', 'Function' : () => this.onClickDelete(), 'Disabled': true },
  ];

  defaultColumns  = ['TableCategory'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};

  constructor(
    private notif           : NotificationService,
    private tablesService   : TablesService,
    public matTableService  : MatTableService,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) { }

  ngOnInit(): void {
    for (const col of this.defaultColumns) {
      this.columnTypeMap[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    this.getTableCategorys();
  }

  async getTableCategorys(){
    this.tableCategorys = await firstValueFrom(this.tablesService.getTableCategorys());
    this.listData = new MatTableDataSource(this.tableCategorys);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  applyFilter() {
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch() {
    this.searchKey = this.matTableService.clearSearch(this.listData);
  }

  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  onClickSave(){
    if (this.searchKey == null || this.searchKey.trim() == "") {
      return this.notif.toastrWarning('Empty Field.');
    }
    this.tablesService.saveTableCategory({ 'TableCategory': this.searchKey.trim() }).subscribe({
      next:(res) => {
        this.notif.toastrSuccess(res.message);
        this.searchKey = null;
        this.getTableCategorys();
      },
      error:(err) => {
        this.notif.toastrError(err.error.message);
      }
    });
  }

  onClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notif.popupWarning("Delete Record", this.selectedData.TableCategory + " will be DELETED. Continue?").then((result) => {
      if (result.value) {
        this.tablesService.deleteTableCategory(this.selectedData.id).subscribe({
          next:(res) => {
            this.notif.toastrSuccess(res.message);
            this.selectedId = 0;
            this.getTableCategorys();
          },
          error:(err) => {
            this.notif.toastrError(err.error.message);
          }
        });
      }
    });
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
