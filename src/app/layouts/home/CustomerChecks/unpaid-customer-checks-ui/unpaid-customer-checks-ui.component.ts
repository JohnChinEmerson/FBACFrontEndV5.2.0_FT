import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CustomerChecksService } from 'src/app/services/CustomerChecks/customer-checks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-unpaid-customer-checks-ui',
  templateUrl: './unpaid-customer-checks-ui.component.html',
  styleUrls: ['./unpaid-customer-checks-ui.component.css']
})
export class UnpaidCustomerChecksUIComponent implements OnInit {
  checks :any=[];
  customer:any=[];
  ui:string;
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'Select Check','Function'            : () => this.onClickSelectCheck(),'Disabled': true,}, 

  ];
  contextButtons  =  [
  ];
  defaultColumns  = ['CheckDate','Amount','CheckNo','BankName'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['CheckDate',]
  };

  columnTypeMap: { [key: string]: string } = {};


  constructor(
    private dialog              : MatDialog,
    private dialogRef              : MatDialogRef<UnpaidCustomerChecksUIComponent>,
    private customerChecksService        : CustomerChecksService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.customer = this.data[0];
    this.ui = this.data[1];
    this.onClickView();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async onClickView(){
    this.isLoading = true;
    this.checks = await firstValueFrom(this.customerChecksService.getUnPaidCustomerChecks(this.customer.CustomerId));
    if(this.checks)
      this.isLoading = false;
    this.displayRecords();
  }

  
  displayRecords(){
    var data = this.checks;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  
  getRecord(data : any){
    this.selectedId = data.CheckId;
    this.selectedData = data;
  }



  onClickSelectCheck(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    return  this.dialogRef.close(this.selectedData);
  }

  onClose(){
    this.dialogRef.close();
  }

}
