import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CanvassDetailSuppliersService } from 'src/app/services/Canvassing/canvass-detail-suppliers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { PrintService } from 'src/app/services/print.service';
import { POTransactionService } from 'src/app/services/Purchasing/potransaction.service';
import { NotificationService } from '../../../../services/notification.service';
import { HomeComponent } from '../../home.component';
import { ToolBoxService } from 'src/app/services/tool-box.service';
@Component({
  selector: 'app-canvass-for-poui',
  templateUrl: './canvass-for-poui.component.html',
  styleUrls: ['./canvass-for-poui.component.css']
})
export class CanvassForPOUIComponent implements OnInit {
  suppliers       : any=[];
  supplierItems   : any = [];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  selectedData2    : any;
  selectedId2      : number = 0;
  searchKey2       : string = "";
  listData2        : MatTableDataSource<any>;
  pageSizeOptions2 :any = this.matTableService.pageSizeOptions();
  isLoading2       : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild(MatPaginator) paginator2    : MatPaginator;  
  contextMenuPosition = { x: '0px', y: '0px' };
  contextButtons     = [
    {'Label'   : 'Load','Function'            : () => this.onClickLoad(),'Disabled': true,}, 
  ]; 
  defaultColumns      = ['SupplierName'];
  defaultColumns2      = ['ItemName', 'UM', 'Cost', 'DiscountPercent', 'Qty'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Cost', 'DiscountPercent', 'Qty'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

  transCode: any;
  supplierId: any;
  action: any;
  constructor(
      private dialog              : MatDialog,
      private canvassDetailSuppliersService      : CanvassDetailSuppliersService,
      private pOTransactionService      : POTransactionService,
      public matTableService     : MatTableService,
      private dialogRef        : MatDialogRef<CanvassForPOUIComponent>,
      private notificationService              : NotificationService,
      private toolBoxService      : ToolBoxService,
      private homeTs              : HomeComponent,
      @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    await this.homeTs.getButtons();
     this.toolBoxService.disableButtons(null, null, this.contextButtons, null);
    this.transCode = this.data[0];
    this.supplierId = this.data[1];
    this.action = this.data[2];
    this.getSuppliers();
  }
   private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getSuppliers(){
    this.isLoading = true;
    this.suppliers = await firstValueFrom(this.canvassDetailSuppliersService.getCBOApprovedSuppliersForPO());
    this.isLoading = false;
    this.displayRecords();
    if(this.suppliers.lenght > 0){
      this.selectedId = this.suppliers[0].SupplierId;
      this.getsupplierItems();
    }
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
    this.getsupplierItems();
  }

  getRecord2(data : any){
    this.selectedId2 = data.ItemId;
    this.selectedData2 = data;
  }
  
  async getsupplierItems(){
    this.isLoading2 = true;
    this.supplierItems = await firstValueFrom(this.canvassDetailSuppliersService.getApprovedSupplierItemsBySupplierIdForPO(this.selectedId));
    this.isLoading2 = false;
    this.displaysupplierItems();
  }

  displaysupplierItems(){
    var data = this.supplierItems; 
    this.selectedId2 = undefined;
    this.selectedData2 = undefined;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator;
  }

  onClickLoad(){
    var data:any = {
      'supplierId' : this.selectedId,
      'supplierItems' : this.supplierItems,
      'transCode' : this.transCode,
      'action' : this.action,
    };
    this.pOTransactionService.loadCanvass(data).subscribe({
      next :(res) =>{
        this.notificationService.toastrSuccess(res.message);
        this.dialogRef.close(res);
      },  
      error :(err)=>{
        this.notificationService.toastrError(err.error.message);
      },
    });
  }

  onContextMenu(event: MouseEvent, data: any) {
    if(this.contextButtons.length > 0){
      this.getRecord(data);
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}
