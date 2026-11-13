import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SuppliersService } from 'src/app/services/Files/suppliers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { SupplierUIComponent } from '../supplier-ui/supplier-ui.component';
import { UploadSuppliersUIComponentComponent } from '../upload-suppliers-uicomponent/upload-suppliers-uicomponent.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {
  suppliers         : any[]= [];
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

  toolButtons       =[
    {'Label'   : 'View','Function'            : () => this.OnClickView(),'Disabled': true}, 
    {'Label'   : 'New','Function'             : () => this.OnClickNew(),'Disabled': true}, 
    {'Label'   : 'Print','Function'           : () => this.OnClickPrint(),'Disabled': true}, 
    {'Label'   : 'Upload Suppliers','Function'           : () => this.onClickUploadSuppliers(),'Disabled': true,}, 
    {'Label'   : 'Export Suppliers','Function'    : () => this.onClickExportSuppliers(),'Disabled': true,}, 

  ];
  contextButtons    = [
    {'Label'   : 'Edit','Function'            : () => this.OnClickEdit(),'Disabled': true}, 
    {'Label'   : 'Delete','Function'          : () => this.OnClickDelete(),'Disabled': true}, 
  ];
  defaultColumns    = ['SupplierId','SupplierName','ContactNo','ContactPerson','SupplierTIN', 'BusinessStyle','Address','TermDays'];
  columnTypeMap: { [key: string]: string } = {};
  
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: ['TermDays'],
    dateTimeColumns: [],
    dateColumns: []
  };
  constructor(
    private dialog            : MatDialog,
    private suppliersService  : SuppliersService,
    private notificationService : NotificationService,
    private toolBoxService    : ToolBoxService,
    private router            : Router,
    private printService      : PrintService,
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
    this.suppliers = await firstValueFrom(this.suppliersService.getSuppliersToDisplay());
    if(this.suppliers)
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
    var data = this.suppliers;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  getRecord(data : any){
    this.selectedId = data.SupplierId;
    this.selectedData = data;
  }

  OnClickNew(){
      if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = (['', 'suppliers', this.suppliers]);
    this.dialog.open(SupplierUIComponent,dialogConfig).beforeClosed().subscribe(suppliers => {
      if(suppliers){
        this.suppliers = suppliers;
        this.displayRecords();
      }
    });
  }

  async OnClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    var supplier:any = await firstValueFrom(this.suppliersService.getSupplierBySupplierId(this.selectedData.SupplierId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = ([supplier, 'suppliers']);
    this.dialog.open(SupplierUIComponent,dialogConfig).beforeClosed().subscribe(supplier => {
      if (supplier) {
        this.suppliers = this.suppliers.map(detail =>
          detail.SupplierId === supplier.SupplierId ? supplier : detail
        );
        this.displayRecords();
      }
    });
  }

  OnClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Record","Are you sure to delete this supplier?").then((result) => {
      if (result.value) {
        this.suppliersService.deleteSupplier(this.selectedData.SupplierId).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.suppliers = this.suppliers.filter(x => x.SupplierId != this.selectedData.SupplierId);
              this.displayRecords();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

    onClickUploadSuppliers(){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '500px';
      this.dialog.open(UploadSuppliersUIComponentComponent,dialogConfig).beforeClosed().subscribe(x=>{
        this.OnClickView();
      })
    }

  onClickExportSuppliers(){
    var exportItems = this.listData?.filteredData
    if (exportItems.length > 0) {
      const columnsToExport = ['SupplierName','Address','ContactNo','SupplierTIN'];

      const filteredExcel = exportItems.map(row =>
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
      var filename = 'suppliers.xlsx';

      XLSX.writeFile(
        workBook,
        filename
      );
    } else {
      return this.notificationService.toastrWarning('No records found.');
    }
  }

  OnClickPrint(){
    var url = this.router.serializeUrl(this.router.createUrlTree(['print/printsuppliers']));
    var data = this.listData.filteredData;
    this.printService.popupWindow(url, 'Suppliers', window, 800, 800);
    localStorage.setItem('Suppliers', JSON.stringify(data));
    localStorage.setItem('Title', 'SUPPLIERS');
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
