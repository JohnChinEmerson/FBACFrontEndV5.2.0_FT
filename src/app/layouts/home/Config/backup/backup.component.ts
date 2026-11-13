import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { BackupService } from 'src/app/services/Config/backup.service';
import { DateTimesService } from 'src/app/services/date-times.service';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.css']
})
export class BackupComponent implements OnInit {

  backups         : any[]= [];
  selectedData      : any;
  searchKey         : string = "";
  selectedId        : number = 0;
  pageSizeOptions   : any = this.matTableService.pageSizeOptions();
  listData          : MatTableDataSource<any>;
  isLoading         : boolean = false;
  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  @ViewChild(MatSort) sort                : MatSort;
  @ViewChild(MatPaginator) paginator      : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu  : MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons       =[
    {'Label'   : 'View','Function'                  : () => this.OnClickView(),'Disabled': true}, 
    {'Label'   : 'Backup','Function'      : () => this.OnClickBackup(),'Disabled': true}, 

  ];
  contextButtons    = [
    {'Label'   : 'Download','Function'            : () => this.OnClickDownload(),'Disabled': true}, 
  ];
  defaultColumns    = ['BackupDate','BackupName'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog            : MatDialog,
    private backupsService    : BackupService,
    private notificationService : NotificationService,
    private toolBoxService    : ToolBoxService,
    private router            : Router,
    private dateTimesService      : DateTimesService,
    public matTableService   : MatTableService,
    private homeTs            : HomeComponent,
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


  async OnClickView(){
    this.isLoading = true;
    this.backups = await firstValueFrom(this.backupsService.getBackupsByTransDateFromByTransDateTo(
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
      this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
    ));
    if(this.backups)
    this.isLoading = false;
    this.displayRecords();
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  displayRecords(){
    var data = this.backups;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  OnClickBackup() {
      this.toolButtons[1].Label    = 'Database Backup Ongoing...';
      this.toolButtons[1].Disabled = false;  // disable while running

      this.backupsService.backupDatabase().subscribe({
          next: (res) => {
              this.notificationService.toastrSuccess(res.message);
              this.OnClickView();
              this.toolButtons[1].Label    = 'Backup';
              this.toolButtons[1].Disabled = true; // re-enable
          },
          error: (err) => {
              this.notificationService.toastrError(err.error.message);
              this.toolButtons[1].Label    = 'Backup';
              this.toolButtons[1].Disabled = true; // re-enable on error too
          },
      });
  }

  OnClickDownload() {
      if (!this.matTableService.checkNull(this.selectedId)) return;

      this.contextButtons[0].Label    = 'Downloading...';
      this.contextButtons[0].Disabled = false;  // ❌ disables the button

      this.backupsService
          .downloadBackup(this.selectedData.BackupName)
          .subscribe({
              next: (blob: Blob) => {
                  const url = window.URL.createObjectURL(blob);
                  const a   = document.createElement('a');
                  a.href     = url;
                  a.download = this.selectedData.BackupName;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);

                  this.contextButtons[0].Label    = 'Download';
                  this.contextButtons[0].Disabled = true;  // ✅ re-enables the button
              },
              error: (err) => {
                  this.notificationService.toastrError(err.error?.message ?? 'Download failed.');
                  this.contextButtons[0].Label    = 'Download';
                  this.contextButtons[0].Disabled = true;  // ✅ re-enables on error too
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
