import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { CustomerUIComponent } from '../customer-ui/customer-ui.component';
import { UploadCustomersUIComponentComponent } from '../upload-customers-uicomponent/upload-customers-uicomponent.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers       : any[] = [];
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
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
    {'Label'   : 'Upload Customers','Function'           : () => this.onClickUploadCustomers(),'Disabled': true,}, 
    {'Label'   : 'Export Customers','Function'    : () => this.onClickExportCustomers(),'Disabled': true,}, 
    
  ];

  contextButtons = [
    { 'Label': 'Edit', 'Function'             : () => this.onClickEdit(), 'Disabled': true },
    { 'Label': 'Delete', 'Function'           : () => this.onClickDelete(), 'Disabled': true },
  ];

  defaultColumns  = ['CustomerId','CustomerName','Address', 'ContactNo','TermDays', 'CustomerTIN', 'BusinessStyle', 'PriceCategory', 'DiscountPerson', 'DiscountId'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['DiscountPercent','CreditLimit','UsableRebate'],
    intColumns: ['TermDays'],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private customersService    : CustomersService,
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
    this.customers = await firstValueFrom(this.customersService.getCustomersToDisplay());
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
    this.listData = new MatTableDataSource(this.customers);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  getRecord(data: any) {
    this.selectedId = data.CustomerId;
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
    dialogConfig.data = (['','customers', this.customers]);
    this.dialog.open(CustomerUIComponent, dialogConfig).beforeClosed().subscribe(customers => {
      if(customers){
        this.customers = customers;
        this.displayRecords();
      }
    });
  }
  async onClickEdit() {
    if (!this.matTableService.checkNull(this.selectedId)) return;
    const customer = await firstValueFrom(this.customersService.getCustomerByCustomerId(this.selectedData.CustomerId));
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = ([customer,'customers']);
    this.dialog.open(CustomerUIComponent, dialogConfig).beforeClosed().subscribe(customer => {
      if (customer) {
        this.customers = this.customers.map(detail =>
          detail.CustomerId === customer.CustomerId ? customer : detail
        );
        this.displayRecords();
      }
    });
  }

  onClickDelete() {
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning('Delete Customer', 'Are you sure to delete this customer?').then(result => {
      if (result.value) {
        this.customersService.deleteCustomer(this.selectedData.CustomerId).subscribe({
          next:(res)=>{
            this.notificationService.toastrSuccess(res.message);
            this.customers = this.customers.filter(x => x.CustomerId != this.selectedData.CustomerId);
            this.displayRecords();
          },
          error:(err)=>{
            this.notificationService.toastrError(err.error);
          },
        });
      }
    });
  }
  onClickUploadCustomers(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(UploadCustomersUIComponentComponent,dialogConfig).beforeClosed().subscribe(x=>{
      this.onClickView();
    })
  }
 
  onClickExportCustomers(){
    var exportCustomers = this.listData?.filteredData
    if (exportCustomers.length > 0) {
      const columnsToExport = ['CustomerName','Address','ContactNo','CustomerTIN','BeginningRebate'];

      const filteredExcel = exportCustomers.map(row =>
        columnsToExport.reduce((acc, column) => {
          acc[column] = row[column];
          return acc;
        }, {})
      );
    
      if (filteredExcel.length === 0) {
        return this.notificationService.toastrWarning('No records found.');
      }
    
      const workSheet = XLSX.utils.json_to_sheet(filteredExcel);
      const workBook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
      var filename = 'customers.xlsx';

      XLSX.writeFile(
        workBook,
        filename
      );
    } else {
      return this.notificationService.toastrWarning('No records found.');
    }
  }

  onClickPrint() {
    const url = this.router.serializeUrl(this.router.createUrlTree(['print/printcustomers']));
    const data = this.listData.filteredData;
    this.printService.popupWindow(url, 'Customers', window, 800, 800);
    localStorage.setItem('Customers', JSON.stringify(data));
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
