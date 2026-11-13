import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PopupsService } from 'src/app/services/Support/popups.service';
import { PopupConfigUIComponent } from '../popup-config-ui/popup-config-ui.component';

@Component({
  selector: 'app-popups-ui',
  templateUrl: './popups-ui.component.html',
  styleUrls: ['./popups-ui.component.css']
})
export class PopupsUIComponent implements OnInit {

  popups             : any;
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
    { 'Label': 'Edit', 'Function'           : () => this.onClickEdit(), 'Disabled': true },
  ];

  defaultColumns  = ['PopUp', 'OnOrBeforeDays'];
  mergeColumns    = this.defaultColumns;
  constructor(
    private notif               : NotificationService,
    private dialog              : MatDialog,
    private popupsService       : PopupsService,
    public matTableService     : MatTableService,
  ) { 
  }

  async ngOnInit(): Promise<void> {
    await this.getPopups();
  }

  async getPopups(){
    this.popups = await firstValueFrom(this.popupsService.getPopupConfigs());
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
    var data = this.popups;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }
  
  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  

  onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    if(this.selectedData.Editable.toLowerCase() != 'yes')
        return this.notif.toastrWarning("Edit Not Allowed.");
    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = ([this.selectedData,this.popups]);
    this.dialog.open(PopupConfigUIComponent,dialogConfig).beforeClosed().subscribe(popups => {
    if (popups) {
        this.popups = this.popups.map(detail =>
          detail.id === popups.id ? popups : detail
        );
        this.displayRecords();
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
