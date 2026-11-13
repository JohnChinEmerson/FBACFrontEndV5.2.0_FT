import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { ItemCategorysService } from 'src/app/services/Files/item-categorys.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-item-categorys-ui',
  templateUrl: './item-categorys-ui.component.html',
  styleUrls: ['./item-categorys-ui.component.css']
})
export class ItemCategorysUIComponent implements OnInit {
  categorys         : any;
  searchKey         : string = "";
  selectedData      : any;
  selectedId        : number = 0;
  pageSizeOptions   : number[] = this.matTableService.pageSizeOptions();
  listData          : MatTableDataSource<any>;
  isLoading         : boolean = false;
  type              : string;
  
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  contextButtons = [
    { 'Label': 'Delete', 'Function'           : () => this.onClickDelete(), 'Disabled': true },
  ];

  defaultColumns  = ['Category'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private notif               : NotificationService,
    private itemCategorysService     : ItemCategorysService,
    public matTableService     : MatTableService,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) { 
  }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.type = this.data;
    this.getCategorys();
    this.itemCategorysService.requiredRefresh.subscribe(()=>{
      this.getCategorys();
    });
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  async getCategorys(){
    this.categorys = await firstValueFrom(this.itemCategorysService.getCategorys());
    this.displayRecords();
  }

  applyFilter() {
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch() {
    this.searchKey = this.matTableService.clearSearch(this.listData);
  }

  displayRecords()
  {
    var data = this.categorys;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }
  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
    this.onChangeCategory(data);
  }

  onClickSave(){
    if(this.searchKey == null || this.searchKey == ""){
      return this.notif.toastrWarning('Empty Field.');
    }
    var data:any = {
      'Category' :  this.searchKey
    };
    this.itemCategorysService.saveCategory(data).subscribe({
      next:(res) => {
        this.notif.toastrSuccess(res.message);
        this.searchKey = null;
      },
      error:(err) => {
        this.notif.toastrSuccess(err.message);
      }
    });
  }

  onClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
          if (result.value) {
            this.itemCategorysService.deleteCategory(this.selectedData.id).subscribe({
              next:(res) => {
                this.notif.toastrSuccess(res.message);
              },
              error:(err) => {
                this.notif.toastrSuccess(err.message);
              }
            });
          }
    });
  }

  onChangeCategory(category){
    localStorage.setItem('Category', category.Category);
    this.itemCategorysService.requiredRefresh.next();
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
