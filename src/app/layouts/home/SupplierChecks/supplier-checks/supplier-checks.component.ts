import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { ColumnTypeConfig, MatTableService } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { firstValueFrom } from 'rxjs';
import { SupplierChecksService } from 'src/app/services/SupplierChecks/supplier-checks.service';
import { SupplierCheckHeadersService } from 'src/app/services/SupplierChecks/supplier-check-headers.service';
import { SupplierCheckUIComponent } from '../supplier-check-ui/supplier-check-ui.component';

@Component({
  selector: 'app-supplier-checks',
  templateUrl: './supplier-checks.component.html',
  styleUrls: ['./supplier-checks.component.css']
})
export class SupplierChecksComponent implements OnInit {
    years :any; 
    months :any; 
    supplierChecksToDeposit:any=[];
    year :any = new Date().getFullYear();
    month:any =new Date().getMonth()+1; 
    checkStatus: any = [
      { value: 'Unreleased', label: 'Unreleased Checks' },
      { value: 'Released',   label: 'Released Checks' },
      { value: 'Cleared',    label: 'Cleared Checks' }
    ];
    status: string = 'Unreleased';
    btnDepositText: string = 'Release';
    supplierChecks : any;
    selectedId: any;
    selectedData: any;
    searchKey       : string = "";
    listData        : MatTableDataSource<any>;
    pageSizeOptions :any = this.matTableService.pageSizeOptions();
    isLoading       : boolean = false;
  
    @ViewChild(MatSort) sort              : MatSort;
    @ViewChild(MatPaginator) paginator    : MatPaginator;  
    @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  
    contextMenuPosition = { x: '0px', y: '0px' };
    toolButtons     = [
      {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
      {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
      {'Label'   : 'New','Function'           : () => this.onClickNew(),'Disabled': true,}, 
      {'Label'   : 'Release / Unrelease','Function'           : () => this.onClickDeposit(),'Disabled': true,}, 
    ];
    contextButtons     = [
      {'Label'   : 'Check All','Function'                : () => this.onClickCheckAll(),'Disabled': true,}, 
      {'Label'   : 'Edit','Function'                : () => this.onClickEdit(),'Disabled': true,}, 
      {'Label'   : 'Delete','Function'                : () => this.onClickDelete(),'Disabled': true,}, 
    ];
    dateColumns  = [];
    defaultColumns  = ['TransDate', 'CheckDate','SupplierName','Amount' ,'CheckNo','CashAccount', 'TransName', 'CheckStatus', 'PaidStatus'];
    defaultColumns2      = ['actions','TransDate', 'CheckDate','SupplierName','Amount' ,'CheckNo','CashAccount', 'TransName', 'CheckStatus', 'PaidStatus'];
    columnConfig: ColumnTypeConfig = {
      decimalColumns: ['Amount'],
      intColumns: [],
      dateTimeColumns: [],
      dateColumns: ['TransDate', 'CheckDate']
    };

    columnTypeMap: { [key: string]: string } = {};
    columnTypeMap2: { [key: string]: string } = {};

    
    constructor(
      private helperService : HelperService,
      private supplierChecksService : SupplierChecksService,
      private supplierCheckHeadersService : SupplierCheckHeadersService,
      private dialog : MatDialog,
      private notificationService : NotificationService,
      private toolBoxService      : ToolBoxService,
      public matTableService     : MatTableService,
      private printService        : PrintService,
      private router              : Router,
      private homeTs              : HomeComponent,
    ) { }
  
    async ngOnInit(): Promise<void> {
      this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
      this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
      await this.homeTs.getButtons();
      this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
      this.getYears();
      this.getMonths();
      
    }

    private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
      const map: { [key: string]: string } = {};
      for (const col of columns) {
        map[col] = this.matTableService.getColumnType(col, this.columnConfig);
      }
      return map;
    }

    async getMonths(){
      this.months = await firstValueFrom(this.helperService.getMonthsWithValue());
    }
  
    async getYears(){
      this.years = await firstValueFrom(this.helperService.getYears());
    }
  
    async onClickView(){
      this.isLoading = true;
      this.supplierChecks = await firstValueFrom(this.supplierChecksService.getSupplierChecksByStatusByYearByMonth(this.status, this.year, this.month));
      if(this.supplierChecks)
        this.isLoading = false;
      this.displayRecords();
    }
  
    displayRecords(){
      var data = this.supplierChecks;
      data.forEach(x => {
        x.uniqueId = x.SupplierCheckId+'-'+x.CheckNo;
      });

      this.supplierChecksToDeposit = [];
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
      this.selectedId = data.SupplierCheckId+'-'+data.CheckNo;
      this.selectedData = data;
    }

  emptyTable(){
    this.listData = new MatTableDataSource([]);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;

    if(this.status.toLowerCase() == 'released')
      this.btnDepositText = 'Unrelease';
    else
      this.btnDepositText = 'Release';
  }
  
    getTotal(column){
      let sum = 0;
      this.listData?.filteredData.forEach(x => {
              sum += +x[column];
      });
      return sum;
    }
    
    onClickNew(){
        if (!this.matTableService.CommonTransaction()) {
        return;
      }
      const dialogConfig        = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus    = true;
       dialogConfig.width        = '600px';
       dialogConfig.data = (['', 'supplierchecks',this.status, this.supplierChecks]);
       this.dialog.open(SupplierCheckUIComponent,dialogConfig).beforeClosed().subscribe(supplierChecks => {
        if(supplierChecks){
          if(this.status.toLowerCase() == 'unpaid'){
            this.supplierChecks = supplierChecks;
            this.displayRecords();
          }
        }
       });
    }

   

  onClickDeposit(){
    if(this.supplierChecksToDeposit.length <= 0){
      return this.notificationService.toastrWarning("Please select check(s).");
    }
    var action = this.status.toLowerCase() == 'cleared' ? 'Unclear' : 'Clear';
    this.notificationService.popupWarning(action + " Supplier Check","Selected record(s) will be " + action.toLowerCase() + "ed. Continue?").then((result) => {
      if(result.value){
        this.supplierChecksService
          .depositSupplierChecks(this.status, this.supplierChecksToDeposit)
          .subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.onClickView();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
              this.onClickView();
            }
          });
      }
    });
  }
    onClickCheckAll(){
      this.supplierChecksToDeposit = this.listData.filteredData;
    }

    onClickEdit(){
      if(!this.matTableService.checkNull(this.selectedId)) return;
      
      if(this.selectedData.PaidStatus.toLowerCase() == 'paid')
        return this.notificationService.toastrWarning(" Check already paid to " + this.selectedData.TransNo + " " + this.selectedData.TransName+". Kindly goto the transaction to edit.");
      else{
        const dialogConfig        = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus    = true;
        dialogConfig.width        = '600px';
        dialogConfig.data = ([this.selectedData, 'supplierChecks',this.status, this.supplierChecks]);
        this.dialog.open(SupplierCheckUIComponent,dialogConfig).beforeClosed().subscribe(x => {
          if(x){
            this.populateChanges(x);
          }
        });
      }
    }

    populateChanges(customerCheck) {
      this.selectedId = null;
      this.selectedData = null;
      const customerCheckIndex = this.supplierChecks.findIndex(detail => detail.SupplierCheckId === customerCheck.SupplierCheckId);

      if (customerCheckIndex !== -1) {
        this.supplierChecks[customerCheckIndex] = customerCheck;  
      }
      this.displayRecords();
    }
    

    onClickDelete(){
      if(!this.matTableService.checkNull(this.selectedId)) return;
      
      if(this.selectedData.PaidStatus.toLowerCase() == 'paid')
        return this.notificationService.toastrWarning(" Check already paid to " + this.selectedData.TransNo + " " + this.selectedData.TransName+". Remove it first from the payment transaction.");
      else{
        this.notificationService.popupWarning('Delete Supplier', 'Are you sure to delete this supplier?').then(result => {
          if (result.value) {
            this.supplierCheckHeadersService.deleteSupplierCheck(this.selectedData.SupplierCheckId).subscribe({
              next:(res)=>{
                this.notificationService.toastrSuccess(res.message);
                this.supplierChecks = this.supplierChecks.filter(x => x.SupplierCheckId != this.selectedData.SupplierCheckId);
                this.displayRecords();
              },
              error:(err)=>{
                this.notificationService.toastrError(err.error);
              },
            });
          }
        });
      }
    }

    onCheckToDeposit(data, value) {
      if (value) {
        this.supplierChecksToDeposit.push(data);
      } else {
        this.supplierChecksToDeposit = this.supplierChecksToDeposit.filter(
          (item) => item.uniqueId !== data.uniqueId
        );
      }
    
    }
    existInSupplierChecksToDeposit(data){
      var exist:boolean = this.supplierChecksToDeposit.find(x => x.uniqueId == data.uniqueId );
      return exist;
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

    async onClickPrint(){
      var url     = this.router.serializeUrl(this.router.createUrlTree(['print/printsupplierchecks']));
      var data    = this.listData.filteredData;
      var title   =  this.status.toUpperCase()+' CHECKS FOR '+this.month+'/'+this.year;
      this.printService.popupWindow(url, 'printsupplierChecks', window, 800, 800);
      localStorage.setItem('Data', JSON.stringify(data)); 
      localStorage.setItem('Title', title);
    }

    getDisplayColumns(){
      if(this.status.toLowerCase() == 'unpaid')
          return this.defaultColumns;
      else
        return this.defaultColumns2;

    }
}
