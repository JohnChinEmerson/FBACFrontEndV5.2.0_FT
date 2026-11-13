import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ExpensePayeesService } from 'src/app/services/Expenses/expense-payees.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { ExpensePayeeUIComponent } from '../expense-payee-ui/expense-payee-ui.component';

@Component({
  selector: 'app-expense-payees-ui',
  templateUrl: './expense-payees-ui.component.html',
  styleUrls: ['./expense-payees-ui.component.css']
})
export class ExpensePayeesUIComponent implements OnInit {

  expensePayees       : any[] = [];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = '';
  pageSizeOptions : number[] = this.matTableService.pageSizeOptions();
  listData        : MatTableDataSource<any>;
  isLoading       : boolean = false;

  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons   = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'New','Function'             : () => this.onClickNew(),'Disabled': true,}, 
    // {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
    
  ];

  contextButtons = [
    { 'Label': 'Edit', 'Function'             : () => this.onClickEdit(), 'Disabled': true },
    { 'Label': 'Delete', 'Function'           : () => this.onClickDelete(), 'Disabled': true },
  ];

  defaultColumns  = ['PayeeName','Address', 'ContactNo','TermDays', 'PayeeTIN', 'BusinessStyle'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private expensePayeesService    : ExpensePayeesService,
    private notificationService : NotificationService,
    private router              : Router,
    private toolBoxService      : ToolBoxService,
    private printService        : PrintService,
    public matTableService     : MatTableService,
    private homeTs              : HomeComponent,
  ) {}

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


  async onClickView() {
    this.isLoading = true;
    this.expensePayees = await firstValueFrom(this.expensePayeesService.getPayeesToDisplay());
    this.isLoading = false;
    this.displayRecords();
  }

  applyFilter() {
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch() {
    this.searchKey = this.matTableService.clearSearch(this.listData);
  }

  displayRecords() {
    this.listData = new MatTableDataSource(this.expensePayees);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  getRecord(data: any) {
    this.selectedId = data.PayeeId;
    this.selectedData = data;
  }

  onClickNew() {
      if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = (['','expense', this.expensePayees]);
    this.dialog.open(ExpensePayeeUIComponent, dialogConfig).beforeClosed().subscribe(expensePayees => {
       this.onClickView();
    });
  }
  async onClickEdit() {
    if (!this.matTableService.checkNull(this.selectedId)) return;
    const expensePayee = await firstValueFrom(this.expensePayeesService.getPayeeByPayeeId(this.selectedData.PayeeId));
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = ([expensePayee,'expense']);
    this.dialog.open(ExpensePayeeUIComponent, dialogConfig).beforeClosed().subscribe(expensePayee => {
      this.onClickView();
    });
  }

  onClickDelete() {
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning('Delete Payee', 'Are you sure to delete this expensePayee?').then(result => {
      if (result.value) {
        this.expensePayeesService.deletePayee(this.selectedData.PayeeId).subscribe({
          next:(res)=>{
            this.notificationService.toastrSuccess(res.message);
            this.expensePayees = this.expensePayees.filter(x => x.PayeeId != this.selectedData.PayeeId);
            this.displayRecords();
          },
          error:(err)=>{
            this.notificationService.toastrError(err.error);
          },
        });
      }
    });
  }

 

  onClickPrint() {
    const url = this.router.serializeUrl(this.router.createUrlTree(['print/printexpensePayees']));
    const data = this.listData.filteredData;
    this.printService.popupWindow(url, 'Payees', window, 800, 800);
    localStorage.setItem('Payees', JSON.stringify(data));
    localStorage.setItem('Title', 'CUSTOMERS');
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
