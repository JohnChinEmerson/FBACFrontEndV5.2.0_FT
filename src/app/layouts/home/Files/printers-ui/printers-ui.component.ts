import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PrintersService } from 'src/app/services/Files/printers.service';
import { MatTableService, ColumnTypeConfig } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { PrinterUIComponent } from '../printer-ui/printer-ui.component';
import { AssignedItemsUIComponent } from '../assigned-items-ui/assigned-items-ui.component';

// Desktop Mariosoft.Files.UI Printers2UI: kitchen/bar areas and the printer their order slips go to.
@Component({
  selector: 'app-printers-ui',
  templateUrl: './printers-ui.component.html',
  styleUrls: ['../tables-ui/tables-ui.component.css']
})
export class PrintersUIComponent implements OnInit {
  printers          : any[] = [];
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
    {'Label'   : 'Assigned Items','Function'  : () => this.onClickAssignedItems(),'Disabled': true},
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true},
  ];
  contextButtons    = [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true},
    {'Label'   : 'Assigned Items','Function'  : () => this.onClickAssignedItems(),'Disabled': true},
    {'Label'   : 'Delete','Function'          : () => this.onClickDelete(),'Disabled': true},
  ];
  defaultColumns    = ['Area','PrinterName'];
  columnTypeMap: { [key: string]: string } = {};
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  constructor(
    private dialog              : MatDialog,
    private printersService     : PrintersService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private router              : Router,
    private printService        : PrintService,
    public matTableService      : MatTableService,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    for (const col of this.defaultColumns) {
      this.columnTypeMap[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.printersService.requiredRefresh.subscribe(() => {
      this.onClickView();
    });
    this.onClickView();
  }

  async onClickView(){
    this.isLoading = true;
    try {
      this.printers = await firstValueFrom(this.printersService.getPrinters());
    } finally {
      this.isLoading = false;
    }
    this.listData = new MatTableDataSource(this.printers);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey = this.matTableService.clearSearch(this.listData);
  }

  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  isCashier(data: any){
    return data?.Area?.toLowerCase() == 'cashier';
  }

  openPrinterUI(printer: any){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data         = ([printer]);
    this.dialog.open(PrinterUIComponent, dialogConfig);
  }

  onClickNew(){
    if (!this.matTableService.CommonTransaction()) return;
    this.openPrinterUI(null);
  }

  onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.openPrinterUI(this.selectedData);
  }

  onClickAssignedItems(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    if (this.isCashier(this.selectedData))
      return this.notificationService.toastrWarning('Items cannot be assigned to the Cashier printer.');
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1100px';
    dialogConfig.data         = ([this.selectedData]);
    this.dialog.open(AssignedItemsUIComponent, dialogConfig);
  }

  onClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    if (this.isCashier(this.selectedData))
      return this.notificationService.toastrWarning('The Cashier printer cannot be deleted.');
    this.notificationService.popupWarning('Delete Printer', this.selectedData.Area + ' will be DELETED. Continue?').then((result) => {
      if (result.value) {
        this.printersService.deletePrinter(this.selectedId).subscribe({
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

  onClickPrint(){
    var url = this.router.serializeUrl(this.router.createUrlTree(['print/printdatalist']));
    localStorage.setItem('PrintDataList', JSON.stringify({
      'Title'   : 'PRINTERS',
      'Columns' : [{ 'Key': 'Area', 'Label': 'Area' }, { 'Key': 'PrinterName', 'Label': 'PrinterName' }],
      'Data'    : this.listData?.filteredData || [],
    }));
    this.printService.popupWindow(url, 'Printers', window, 800, 800);
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
