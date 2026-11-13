import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { UseForTaggingsService } from 'src/app/services/Files/use-for-taggings.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-use-for-taggings-ui',
  templateUrl: './use-for-taggings-ui.component.html',
  styleUrls: ['./use-for-taggings-ui.component.css']
})
export class UseForTaggingsUIComponent implements OnInit {

  useForTaggings             : any;
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

  defaultColumns  = ['UseFor'];
  mergeColumns    = this.defaultColumns;
  constructor(
    private notif               : NotificationService,
    private useForTaggingsService : UseForTaggingsService,
    public matTableService     : MatTableService,
    @Inject(MAT_DIALOG_DATA) public data : any 
  ) { 
  }

  ngOnInit(): void {
    this.type = this.data;
    this.getUseForTaggings();
   
  }

  async getUseForTaggings(){
    this.useForTaggings = await firstValueFrom(this.useForTaggingsService.getUseForTaggings());
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
    var data = this.useForTaggings;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }
  
  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
    this.onChangeUseFor(data);
  }

  onClickSave(){
    if(this.searchKey == null || this.searchKey == ""){
      return this.notif.toastrWarning('Empty Field.');
    }
    var data:any = {
      'UseFor' :  this.searchKey
    };
    this.useForTaggingsService.saveUseForTagging(data).subscribe({
      next:(res) => {
        this.notif.toastrSuccess(res.message);
        this.searchKey = null;
        this.getUseForTaggings();
      },
      error:(err) => {
        this.notif.toastrSuccess(err.message);
      }
    });
  }

  onClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.notif.popupWarning("Delete Record","Are you sure to delete this usefor?").then((result) => {
          if (result.value) {
            this.useForTaggingsService.deleteUseForTagging(this.selectedData.id).subscribe({
              next:(res) => {
                this.notif.toastrSuccess(res.message);
                this.getUseForTaggings();
              },
              error:(err) => {
                this.notif.toastrSuccess(err.message);
              }
            });
          }
    });
  }

  onChangeUseFor(useFor){
    localStorage.setItem('UseFor', useFor.UseFor);
    this.useForTaggingsService.requiredRefresh.next();
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
