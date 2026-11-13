import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DiscountPersonsService } from 'src/app/services/Files/discount-persons.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-discount-persons-ui',
  templateUrl: './discount-persons-ui.component.html',
  styleUrls: ['./discount-persons-ui.component.css']
})
export class DiscountPersonsUIComponent implements OnInit {

  discountPersons :any=[];
  customer:any=[];
  ui:string;
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
  ];
  contextButtons  =  [
  ];
  defaultColumns  = ['DiscountPerson','DiscountPercent'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['DiscountPercent'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private dialogRef              : MatDialogRef<DiscountPersonsUIComponent>,
    private DiscountPersonsService        : DiscountPersonsService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, // [discount names to hide]
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.onClickView();
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
    this.discountPersons = await firstValueFrom(this.DiscountPersonsService.getCBODiscountPersons());
    // Desktop DiscountPersonsUI: discounts already applied to the sale are not listed again
    var hidden: string[] = (this.data?.[0] ?? []).map(x => (x ?? '').toLowerCase());
    if(this.discountPersons && hidden.length > 0)
      this.discountPersons = this.discountPersons.filter(x => !hidden.includes((x.DiscountPerson ?? '').toLowerCase()));
    if(this.discountPersons)
      this.isLoading = false;
    this.displayRecords();
  }

  
  displayRecords(){
    var data = this.discountPersons;
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
    this.selectedId = data.id;
    this.selectedData = data;
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

  onClickSelectCheck(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    return  this.dialogRef.close(this.selectedData);
  }

  onClose(){
    this.dialogRef.close();
  }


}
