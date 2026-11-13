import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TablesService } from 'src/app/services/Files/tables.service';
import { FileConfigsService } from 'src/app/services/Files/file-configs.service';
import { MatTableService, ColumnTypeConfig } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { TableUIComponent } from '../table-ui/table-ui.component';
import { TableCategorysUIComponent } from '../table-categorys-ui/table-categorys-ui.component';

// Desktop Mariosoft.Files.UI TablesUI
@Component({
  selector: 'app-tables-ui',
  templateUrl: './tables-ui.component.html',
  styleUrls: ['./tables-ui.component.css']
})
export class TablesUIComponent implements OnInit {
  tables            : any[] = [];
  tableCategorys    : any[] = [];
  tableCategory     : string = 'All';
  multipleTable     : boolean = false;
  selectedData      : any;
  searchKey         : string = "";
  selectedId        : number = 0;
  pageSizeOptions   : any = this.matTableService.pageSizeOptions();
  listData          : MatTableDataSource<any>;
  isLoading         : boolean = false;

  @ViewChild(MatSort) sort                : MatSort;
  @ViewChild(MatPaginator) paginator      : MatPaginator;
  @ViewChild(MatMenuTrigger) contextMenu  : MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons       = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true},
    {'Label'   : 'New','Function'             : () => this.onClickNew(),'Disabled': true},
    {'Label'   : 'Table Categories','Function': () => this.onClickTableCategorys(),'Disabled': true},
    {'Label'   : 'Delete All','Function'      : () => this.onClickDeleteAll(),'Disabled': true},
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true},
  ];
  contextButtons    = [
    {'Label'   : 'Delete','Function'          : () => this.onClickDelete(),'Disabled': true},
  ];
  defaultColumns    = ['TableName','TableCategory','SequenceNo'];
  columnTypeMap: { [key: string]: string } = {};
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: ['SequenceNo'],
    dateTimeColumns: [],
    dateColumns: []
  };

  constructor(
    private dialog              : MatDialog,
    private tablesService       : TablesService,
    private fileConfigsService  : FileConfigsService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private router              : Router,
    private printService        : PrintService,
    public matTableService      : MatTableService,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    var config = await firstValueFrom(this.fileConfigsService.getFileConfig());
    this.multipleTable = config?.MultipleTable?.toLowerCase() == 'yes';
    await this.loadTableCategorys();
    this.tablesService.requiredRefresh.subscribe(() => {
      this.onClickView();
    });
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async loadTableCategorys(){
    var categorys: any = await firstValueFrom(this.tablesService.getTableCategorys());
    this.tableCategorys = [{ 'TableCategory': 'All' }, ...categorys];
  }

  async onClickView(){
    this.isLoading = true;
    try {
      var category = this.multipleTable ? this.tableCategory : 'All';
      this.tables = await firstValueFrom(this.tablesService.getTablesByTableCategory(category));
    } finally {
      this.isLoading = false;
    }
    this.displayRecords();
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey = this.matTableService.clearSearch(this.listData);
  }

  displayRecords(){
    this.listData = new MatTableDataSource(this.tables);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  onClickNew(){
    if (!this.matTableService.CommonTransaction()) return;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data         = ([this.multipleTable, this.tableCategory]);
    this.dialog.open(TableUIComponent, dialogConfig);
  }

  onClickTableCategorys(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data         = ([]);
    this.dialog.open(TableCategorysUIComponent, dialogConfig).afterClosed().subscribe(() => {
      this.loadTableCategorys();
    });
  }

  onClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning('Delete Table', this.selectedData.TableName + ' will be DELETED. Continue?').then((result) => {
      if (result.value) {
        this.tablesService.deleteTable(this.selectedId).subscribe({
          next:(res) => {
            this.notificationService.toastrSuccess(res.message);
            this.selectedId = 0;
          },
          error:(err) => {
            this.notificationService.toastrError(err.error.message);
          }
        });
      }
    });
  }

  // Desktop TablesUI.btnDeleteAll_Click: deletes every table currently listed
  onClickDeleteAll(){
    var rows = this.listData?.filteredData || [];
    if (rows.length == 0) return this.notificationService.toastrWarning('No records to be Deleted.');
    this.notificationService.popupWarning('Delete All', rows.length + ' table(s) will be DELETED. Continue?').then((result) => {
      if (result.value) {
        this.tablesService.deleteTables(rows.map(x => x.id)).subscribe({
          next:(res) => {
            this.notificationService.toastrSuccess(res.message);
          },
          error:(err) => {
            this.notificationService.toastrError(err.error.message);
          }
        });
      }
    });
  }

  onClickPrint(){
    var url = this.router.serializeUrl(this.router.createUrlTree(['print/printdatalist']));
    localStorage.setItem('PrintDataList', JSON.stringify({
      'Title'   : 'TABLES' + (this.multipleTable && this.tableCategory != 'All' ? ' - ' + this.tableCategory.toUpperCase() : ''),
      'Columns' : [{ 'Key': 'TableName', 'Label': 'TableName' }, { 'Key': 'TableCategory', 'Label': 'TableCategory' }],
      'Data'    : this.listData?.filteredData || [],
    }));
    this.printService.popupWindow(url, 'Tables', window, 800, 800);
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
