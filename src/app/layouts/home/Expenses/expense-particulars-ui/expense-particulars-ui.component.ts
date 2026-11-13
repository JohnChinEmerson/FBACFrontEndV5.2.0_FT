import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ExpenseParticularsService } from 'src/app/services/Expenses/expense-particulars.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { ExpenseParticularUIComponent } from '../expense-particular-ui/expense-particular-ui.component';

@Component({
  selector: 'app-expense-particulars-ui',
  templateUrl: './expense-particulars-ui.component.html',
  styleUrls: ['./expense-particulars-ui.component.css']
})
export class ExpenseParticularsUIComponent implements OnInit {
  expenseParticulars       : any[] = [];
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

  defaultColumns  = ['ParticularName','Category','Amount'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private expenseParticularsService    : ExpenseParticularsService,
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
    this.expenseParticulars = await firstValueFrom(this.expenseParticularsService.getParticularsToDisplay());
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
    this.listData = new MatTableDataSource(this.expenseParticulars);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  getRecord(data: any) {
    this.selectedId = data.ParticularId;
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
    dialogConfig.data = (['','expense', this.expenseParticulars]);
    this.dialog.open(ExpenseParticularUIComponent, dialogConfig).beforeClosed().subscribe(expenseParticulars => {
       this.onClickView();
    });
  }
  async onClickEdit() {
    if (!this.matTableService.checkNull(this.selectedId)) return;
    const expenseParticular = await firstValueFrom(this.expenseParticularsService.getParticularByParticularId(this.selectedData.ParticularId));
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = ([expenseParticular,'expense']);
    this.dialog.open(ExpenseParticularUIComponent, dialogConfig).beforeClosed().subscribe(expenseParticular => {
      this.onClickView();
    });
  }

  onClickDelete() {
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning('Delete Particular', 'Are you sure to delete this expenseParticular?').then(result => {
      if (result.value) {
        this.expenseParticularsService.deleteParticular(this.selectedData.ParticularId).subscribe({
          next:(res)=>{
            this.notificationService.toastrSuccess(res.message);
            this.expenseParticulars = this.expenseParticulars.filter(x => x.ParticularId != this.selectedData.ParticularId);
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
    const url = this.router.serializeUrl(this.router.createUrlTree(['print/printexpenseParticulars']));
    const data = this.listData.filteredData;
    this.printService.popupWindow(url, 'Particulars', window, 800, 800);
    localStorage.setItem('Particulars', JSON.stringify(data));
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
