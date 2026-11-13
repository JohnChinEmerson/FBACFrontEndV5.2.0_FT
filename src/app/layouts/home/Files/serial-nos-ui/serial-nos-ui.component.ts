import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { ItemsService } from 'src/app/services/Files/items.service';
import { SerialNosService } from 'src/app/services/Inventory/serial-nos.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-serial-nos-ui',
  templateUrl: './serial-nos-ui.component.html',
  styleUrls: ['./serial-nos-ui.component.css']
})
export class SerialNosUIComponent implements OnInit {
  
  stock           : any=[];
  loading         : boolean = false;
  type            : string; 
  serialNos       : any;
  warrantyDate    : any = new Date();
  withDate        : boolean = false;
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
    {'Label'   : 'Add','Function'  : () => this.onClickAdd(),'Disabled': true,}, 
  ];  
  contextButtons  =  [
    {'Label'   : 'Delete','Function'          : () => this.onClickDelete(),'Disabled': true,}, 
  ];
  defaultColumns  = ['SerialNo','WarrantyDate'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<SerialNosUIComponent>,
    private itemService                 : ItemsService,
    private serialNosService        : SerialNosService,
    private notif                       : NotificationService,
    public matTableService : MatTableService, 
    private dateTimesService : DateTimesService, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    if (this.data) {
      this.stock = this.data[0];
      this.type = this.data[1];
    }
    this.getSerialNosByItemIdByRecordStatus();
    this.serialNosService.requiredRefresh.subscribe(()=>{
      this.getSerialNosByItemIdByRecordStatus();
    });
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getSerialNosByItemIdByRecordStatus(){
    this.loading = true;
    this.serialNos = await firstValueFrom(this.serialNosService.getSerialNosByItemIdByRecordStatus(this.stock.ItemId, 'open'));
    if(this.serialNos)
      this.loading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.serialNos;
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

  onClickDelete(){
     if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
        this.serialNosService.deleteSerialNo(this.selectedId).subscribe({
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
 
  onClickAdd(){
    if (!this.searchKey || this.searchKey == "" ) 
      return this.notif.toastrWarning("Please Input SerialNo.");

    var data:any = {
      'stock' : this.stock, 
      'serialNo' : this.searchKey, 
      'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
      'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
    };
    this.serialNosService.saveSerialNos(data).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.resetForm();
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
      },
    });
  }

  resetForm(){
    this.searchKey = '';
  }

  onClose(){
    this.dialogRef.close();
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
