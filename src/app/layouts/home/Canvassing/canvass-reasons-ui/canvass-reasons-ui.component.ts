import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { CanvassReasonsService } from 'src/app/services/Canvassing/canvass-reasons.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-canvass-reasons-ui',
  templateUrl: './canvass-reasons-ui.component.html',
  styleUrls: ['./canvass-reasons-ui.component.css']
})
export class CanvassReasonsUIComponent implements OnInit {
  reasons         : any;
  searchKey         : string = "";
  selectedData      : any;
  selectedId        : number = 0;
  pageSizeOptions   : number[] = this.matTableService.pageSizeOptions();
  listData          : MatTableDataSource<any>;
  isLoading         : boolean = false;
  
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  contextButtons = [
    { 'Label': 'Delete', 'Function'           : () => this.onClickDelete(), 'Disabled': true },
  ];

  defaultColumns  = ['ReasonName'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  type: any;
  constructor(
    private notif               : NotificationService,
    private dialogRef               : MatDialogRef<CanvassReasonsUIComponent>,
    private canvassReasonsService     : CanvassReasonsService,
    public matTableService     : MatTableService,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) { 
  }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.getCanvassReasons();
    this.canvassReasonsService.requiredRefresh.subscribe(()=>{
      this.getCanvassReasons();
    });
    this.reasons = this.data[0];
    this.type     = this.data[1];
    this.reasons = this.data[2];
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  async getCanvassReasons(){
    this.reasons = await firstValueFrom(this.canvassReasonsService.getCBOCanvassReasons());
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
    var data = this.reasons;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }
  getRecord(data : any){
    this.selectedId = data.ReasonId;
    this.selectedData = data;
  }

  onClickSave(){
    if(this.searchKey == null || this.searchKey == ""){
      return this.notif.toastrWarning('Empty Field.');
    }
    var data:any = {
      'ReasonName' :  this.searchKey,
    };
    this.canvassReasonsService.saveCanvassReason(data).subscribe({
      next:(res) => {
        this.notif.toastrSuccess(res.message);
        this.reasons = [res.reason,...this.reasons]; 
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
            this.canvassReasonsService.deleteCanvassReason(this.selectedData.ReasonId).subscribe({
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

  onClose(){
    this.dialogRef.close(this.reasons);
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
