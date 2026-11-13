import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CanvassDetailSuppliersService } from 'src/app/services/Canvassing/canvass-detail-suppliers.service';
import { CanvassDetailsService } from 'src/app/services/Canvassing/canvass-details.service';
import { CanvassHeadersService } from 'src/app/services/Canvassing/canvass-headers.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-canvass-for-approval',
  templateUrl: './canvass-for-approval.component.html',
  styleUrls: ['./canvass-for-approval.component.css']
})
export class CanvassForApprovalComponent implements OnInit {
  canvassHeaders    : any=[];
  transNo           : string;
  canvassDetails    : any=[];
  canvassDetailSuppliers : any=[];
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
  toolButtons     = [
    {'Label'   : 'Approve','Function'            : () => this.onClickApprove(),'Disabled': true,}, 
  ]; 
  contextButtons      = [
    {'Label'   : 'Approve/Disapproved','Function'            : () => this.onClickApproveCanvassDetailSupplier(),'Disabled': true,}, 
  ];
  defaultColumns      = ['Qty', 'UM', 'ItemName', 'ApprovedStatus'];
  defaultColumns2      = ['SupplierName', 'Cost', 'DiscountPercent', 'MinimumQty', 'TermDays', 'ContactNo', 'ApprovedStatus'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty', 'Cost', 'DiscountPercent', 'MinimumQty'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  constructor(
      private dialog              : MatDialog,
      private canvassHeadersService  : CanvassHeadersService,
      private canvassDetailsService  : CanvassDetailsService,
      private canvassDetailSuppliersService      : CanvassDetailSuppliersService,
      private notificationService    : NotificationService,
      public matTableService     : MatTableService,
      private printService        : PrintService,
      private router              : Router,
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.getCanvassHeaders();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getCanvassHeaders(){
    this.canvassHeaders = await firstValueFrom(this.canvassHeadersService.getCBOCanvassHeaderForApproval());
    this.canvassHeaders .forEach(x => {
      x.ReceiptLabel = x.TransNo+' - '+x.ReasonName;
    });
    this.transNo = this.canvassHeaders[0].TransNo;
    this.getCanvassDetails();
  }

  async getCanvassDetails(){
    this.isLoading = true;
    this.canvassDetails = await firstValueFrom(this.canvassDetailsService.getCanvassDetailsByTransNoForApproval(this.transNo));
    if(this.canvassDetails)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.canvassDetails;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
    this.getCanvassDetailSuppliers();
  }
  getRecord2(data : any){
    this.selectedId2 = data.id;
    this.selectedData2 = data;
  }

  async getCanvassDetailSuppliers(){
    this.isLoading2 = true;
    if(this.selectedId != undefined){
      this.canvassDetailSuppliers =  await firstValueFrom(this.canvassDetailSuppliersService.getCanvassDetailSuppliersByTransDetailId(this.selectedId));
    }else{
      this.canvassDetailSuppliers =  [];
    }
    if(this.canvassDetailSuppliers)
      this.isLoading2 = false;
    this.displayCanvassDetailSuppliers();
  } 

  displayCanvassDetailSuppliers(){
    var data = this.canvassDetailSuppliers; 
    this.selectedId2 = undefined;
    this.selectedData2 = undefined;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator;
  }

  onChangeCanvassHeader(){
    this.getCanvassDetails();
    this.getCanvassDetailSuppliers();
  }


  onClickApprove(){
    if(!this.matTableService.CommonTransaction()){
      return;
    }
    this.canvassHeadersService.approveCanvassHeaderbyTransNo(this.transNo).subscribe({
      next:(res)=>{
        this.notificationService.toastrSuccess(res.message);
        this.transNo = null;
        this.getCanvassHeaders();
        this.canvassDetails = [];
        this.displayRecords();
        this.canvassDetailSuppliers = [];
        this.displayCanvassDetailSuppliers();
      },
      error:(err)=>{
        this.notificationService.toastrError(err.error.message);
      },
    });
  }

  onClickApproveCanvassDetailSupplier(){
    if(!this.matTableService.checkNull(this.selectedId2)) return;
    var action = this.selectedData2?.ApprovedStatus.toLowerCase() == 'approved' ? 'Disapproved' : 'Approved';

    this.canvassDetailSuppliersService.updateCanvassDetailSupplierApprovedStatus(this.selectedId2, action).subscribe({
      next:(res)=>{
        this.notificationService.toastrSuccess(res.message);
        this.getCanvassDetails();
        this.getCanvassDetailSuppliers();
      },
      error:(err)=>{
        this.notificationService.toastrError(err.error.message);
      },
    });

  }

   
  onContextMenu(event: MouseEvent, data: any) {
    if(this.contextButtons.length > 0){
      this.getRecord2(data);
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}
