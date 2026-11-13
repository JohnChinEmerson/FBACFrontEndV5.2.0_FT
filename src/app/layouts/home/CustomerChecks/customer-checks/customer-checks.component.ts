import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CustomerChecksService } from 'src/app/services/CustomerChecks/customer-checks.service';
import { HelperService } from 'src/app/services/helper.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { CustomerCheckUIComponent } from '../customer-check-ui/customer-check-ui.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CheckHeadersService } from 'src/app/services/CustomerChecks/check-headers.service';
import { DepositToUIComponent } from '../../Cashiering/deposit-to-ui/deposit-to-ui.component';
import { CCheckDepositToUIComponent } from '../ccheck-deposit-to-ui/ccheck-deposit-to-ui.component';

@Component({
  selector: 'app-customer-checks',
  templateUrl: './customer-checks.component.html',
  styleUrls: ['./customer-checks.component.css']
})
export class CustomerChecksComponent implements OnInit {
    years :any; 
    months :any; 
    customerChecksToDeposit:any=[];
    year :any = new Date().getFullYear();
    month:any =new Date().getMonth()+1; 
    checkStatus:any = ['UnPaid', 'UnDeposited', 'Deposited'];
    status:string = 'UnPaid';
    btnDepositText : string = 'Deposit';
    customerChecks : any;
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
      {'Label'   : 'Deposit / Undeposit','Function'           : () => this.onClickDeposit(),'Disabled': true,}, 
    ];
    contextButtons     = [
      {'Label'   : 'Check All','Function'                : () => this.onClickCheckAll(),'Disabled': true,}, 
      {'Label'   : 'Edit','Function'                : () => this.onClickEdit(),'Disabled': true,}, 
      {'Label'   : 'Delete','Function'                : () => this.onClickDelete(),'Disabled': true,}, 
    ];
    dateColumns  = [];
    defaultColumns  = ['TransDate', 'CheckDate','CustomerName','Amount' ,'CheckNo','BankName', 'TransName', 'CheckStatus', 'PaidStatus'];
    defaultColumns2      = ['actions','TransDate', 'CheckDate','CustomerName','Amount' ,'CheckNo','BankName', 'TransName', 'CheckStatus', 'PaidStatus'];
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
      private customerChecksService : CustomerChecksService,
      private checkHeadersService : CheckHeadersService,
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
      this.customerChecks = await firstValueFrom(this.customerChecksService.getCustomerChecksByStatusByYearByMonth(this.status, this.year, this.month));
      if(this.customerChecks)
        this.isLoading = false;
      this.displayRecords();
    }
  
    displayRecords(){
      var data = this.customerChecks;
      data.forEach(x => {
        x.uniqueId = x.CheckId+'-'+x.CheckNo;
      });

      this.customerChecksToDeposit = [];
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
      this.selectedId = data.CheckId+'-'+data.CheckNo;
      this.selectedData = data;
    }

    emptyTable(){
      this.listData =  new MatTableDataSource([]);
      this.listData.paginator = this.paginator;
      this.listData.sort = this.sort;
      if(this.status.toLowerCase() == 'deposited')
          this.btnDepositText = 'Undeposit';
      else
        this.btnDepositText = 'Deposit';
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
       dialogConfig.data = (['', 'customerchecks',this.status, this.customerChecks]);
       this.dialog.open(CustomerCheckUIComponent,dialogConfig).beforeClosed().subscribe(customerChecks => {
        if(customerChecks){
          if(this.status.toLowerCase() == 'unpaid'){
            this.customerChecks = customerChecks;
            this.displayRecords();
          }
        }
       });
    }

   

    onClickDeposit(){
      if(this.btnDepositText.toLowerCase() == 'deposit'){
            const dialogConfig        = new MatDialogConfig();
            dialogConfig.disableClose = true;
            dialogConfig.autoFocus    = true;
            dialogConfig.width        = '500px';
            dialogConfig.data        = (['customerchecks', this.customerChecksToDeposit, 'deposit']);
            this.dialog.open(CCheckDepositToUIComponent,dialogConfig).beforeClosed().subscribe(x =>{
              this.onClickView();
            });
      
          }else{
            this.notificationService.popupWarning("Undeposited Record","Selected Records will be Undeposited. Continue?").then(async (result) => {
              if (result.value) {
                this.customerChecksService.depositCustomerChecks(null,this.status,  this.customerChecksToDeposit).subscribe({
                  next:(res)=>{
                    this.notificationService.toastrSuccess(res.message);
                    this.onClickView();
                  },
                  error:(err)=>{
                    this.notificationService.toastrError(err.error);
                    this.onClickView();
                  },
                })
              }
            });
          }
    }

    onClickCheckAll(){
      this.customerChecksToDeposit = this.listData.filteredData;
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
        dialogConfig.data = ([this.selectedData, 'customerchecks',this.status, this.customerChecks]);
        this.dialog.open(CustomerCheckUIComponent,dialogConfig).beforeClosed().subscribe(x => {
          if(x){
            this.populateChanges(x);
          }
        });
      }
     
    }

    populateChanges(customerCheck) {
      this.selectedId = null;
      this.selectedData = null;
      const customerCheckIndex = this.customerChecks.findIndex(detail => detail.CheckId === customerCheck.CheckId);

      if (customerCheckIndex !== -1) {
        this.customerChecks[customerCheckIndex] = customerCheck;  
      }
      this.displayRecords();
    }
    

    onClickDelete(){
      if(!this.matTableService.checkNull(this.selectedId)) return;
      
      if(this.selectedData.PaidStatus.toLowerCase() == 'paid')
        return this.notificationService.toastrWarning(" Check already paid to " + this.selectedData.TransNo + " " + this.selectedData.TransName+". Remove it first from the payment transaction.");
      else{
        this.notificationService.popupWarning('Delete Customer', 'Are you sure to delete this customer?').then(result => {
          if (result.value) {
            this.checkHeadersService.deleteCustomerCheck(this.selectedData.CheckId).subscribe({
              next:(res)=>{
                this.notificationService.toastrSuccess(res.message);
                this.customerChecks = this.customerChecks.filter(x => x.CheckId != this.selectedData.CheckId);
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
        this.customerChecksToDeposit.push(data);
      } else {
        this.customerChecksToDeposit = this.customerChecksToDeposit.filter(
          (item) => item.uniqueId !== data.uniqueId
        );
      }
    
    }
    existInCustomerChecksToDeposit(data){
      var exist:boolean = this.customerChecksToDeposit.find(x => x.uniqueId == data.uniqueId );
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
      var url     = this.router.serializeUrl(this.router.createUrlTree(['print/printcustomerchecks']));
      var data    = this.listData.filteredData;
      var title   =  this.status.toUpperCase()+' CHECKS FOR '+this.month+'/'+this.year;
      this.printService.popupWindow(url, 'printcustomerchecks', window, 800, 800);
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
