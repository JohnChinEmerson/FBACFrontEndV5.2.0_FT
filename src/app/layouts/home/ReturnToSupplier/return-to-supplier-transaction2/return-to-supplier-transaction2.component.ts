import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { SuppliersService } from 'src/app/services/Files/suppliers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { ReceivingDetailsService } from 'src/app/services/Receiving/receiving-details.service';
import { ReturnToSupplierConfigService } from 'src/app/services/ReturnToSupplier/return-to-supplier-config.service';
import { ReturnToSupplierDetailsService } from 'src/app/services/ReturnToSupplier/return-to-supplier-details.service';
import { ReturnToSupplierHeadersService } from 'src/app/services/ReturnToSupplier/return-to-supplier-headers.service';
import { ReturnToSupplierTransactionService } from 'src/app/services/ReturnToSupplier/return-to-supplier-transaction.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { LoadItemsForReturnToSupplierUIComponent } from '../load-items-for-return-to-supplier-ui/load-items-for-return-to-supplier-ui.component';
import { ReturnToSupplierDetailUIComponent } from '../return-to-supplier-detail-ui/return-to-supplier-detail-ui.component';
import { ReturnToSupplierHeaderUIComponent } from '../return-to-supplier-header-ui/return-to-supplier-header-ui.component';
import { ReturnToSupplierPendingTransactionsUIComponent } from '../return-to-supplier-pending-transactions-ui/return-to-supplier-pending-transactions-ui.component';
import { RTSSerialNosUIComponent } from '../rtsserial-nos-ui/rtsserial-nos-ui.component';

@Component({
  selector: 'app-return-to-supplier-transaction2',
  templateUrl: './return-to-supplier-transaction2.component.html',
  styleUrls: ['./return-to-supplier-transaction2.component.css']
})
export class ReturnToSupplierTransaction2Component implements OnInit {
  receivingDetails          : any=[];
  suppliers                 : any=[];
  supplierId                : string = 'CASH';
  receivingDetailId         : string ="";
  selectedItem              : any;
  selectedRowIndex          : number = 0;
  selectedSupplier          : any;
  previousSupplierId        : any;  
  qty                       :  number;

  returnToSupplierDetails     : any=[];
  returnToSupplierHeader      : any=[];

  listData1                   : MatTableDataSource<any>;
  searchKey1                  : string;
  isLoading1                  : boolean = false;
  
  listData2                   : MatTableDataSource<any>;
  searchKey2                  : string;
  isLoading2                  : boolean = false;

  rightClickType              : string = 'returntosupplierdetails';
  transCode                   : string  = null;
  totalAmount                 : number = 0;
  selectedId                  : string;
  selectedData                : any;
  returnToSupplierConfig      : any=[];
  disableSave                 : boolean = false;
  dateFrom                    : any = new Date();
  dateTo                      : any = new Date();
  withDate                    : boolean = false;
  defaultColumns  = ['TransDate','TransNo', 'ItemName','UM','Qty','Cost','Discount', 'Amount'];
  defaultColumns2: any[] = [
    'Qty',
    'UM',
    'ItemName',
    'Cost',
    'Discount',
    'Amount',
    'Reason',
  ];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Cost','Discount', 'Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
    @ViewChild('qtyInput') qtyInputRef: ElementRef;
    @ViewChild('paginator1') paginator1: MatPaginator;
    @ViewChild('paginator2') paginator2: MatPaginator;
    @ViewChild('dataTable', { static: false }) dataTable!: ElementRef;
    @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
    @ViewChildren('rowElement', { read: ElementRef }) rows!: QueryList<ElementRef>;
    @ViewChild('tableContainer', { static: true }) tableContainer!: ElementRef;
    toggleButtons     = [
      {'Label'   : 'SAVE TRANSACTION-F4','Function'    : () => this.onClickSaveTransaction(),'Disabled': true,}, 
    ];

    toggleButtons2     = [
      {'Label'   : 'GO','Function'             : () => this.getSupplierReceivingDetails(),'Disabled': true,}, 
    ];
    contextButtons1 = [
    ];
    contextButtons2  =  [
      {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
      {'Label'   : 'Remove','Function'          : () => this.onClickRemove(),'Disabled': true,}, 
      {'Label'   : 'Remove All','Function'      : () => this.onClickRemoveAll(),'Disabled': true,}, 
      {'Label'   : 'SerialNos','Function'       : () => this.onClickSerialNos(),'Disabled': true,}, 
      {'Label'   : 'Save As Pending','Function' : () => this.onClickSaveAsPending(),'Disabled': true,}, 
      {'Label'   : 'Show Pending','Function'    : () => this.onClickShowPending(),'Disabled': true,}, 
    ];
    constructor(
      private dialog          : MatDialog,
      private receivingDetailsService    : ReceivingDetailsService,
      private suppliersService     : SuppliersService,
      private returnToSupplierTransactionService      : ReturnToSupplierTransactionService,
      private returnToSupplierHeadersService      : ReturnToSupplierHeadersService,
      private returnToSupplierDetailsService      : ReturnToSupplierDetailsService,
      private returnToSupplierConfigService     : ReturnToSupplierConfigService,
      private notif           : NotificationService,
      private auth_service    : AuthService,
      private toolBoxService : ToolBoxService,
      public matTableService : MatTableService,
      private numbersService : NumbersService,
      private dateTimesService : DateTimesService,
      private stringHelperService : StringHelperService,
      private homeTs : HomeComponent,
      private notificationService : NotificationService,
      private viewContainerRef : ViewContainerRef,
      
    ) { }
  
  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
      this.getSuppliers();
      this.getReturnToSupplierConfig();
      await this.homeTs.getButtons();
      this.toolBoxService.disableButtons(this.toggleButtons, this.toggleButtons2, this.contextButtons2, null);
      this.getReturnToSupplierDetails();
      
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  
    async getSuppliers(){
      this.suppliers = await firstValueFrom(this.suppliersService.getCBOSuppliers());
      this.suppliers.push(this.stringHelperService.withCASHSupplierCBO());
    }
  
    async getReturnToSupplierConfig(){
      this.returnToSupplierConfig = await firstValueFrom(this.returnToSupplierConfigService.getReturnToSupplierConfig());
    }
  
    async getTransCode(){
      this.transCode = null;   // Desktop: no number until the first line is saved (it then gets its temporary TransNo)
    }
  
    async getReturnToSupplierDetails(){
      this.isLoading2 = true;
      try{
        this.returnToSupplierHeader = await firstValueFrom(this.returnToSupplierHeadersService.getReturnToSupplierHeaderByRecordStatusByInputBy('ongoing',this.auth_service.User));

        if (!this.returnToSupplierHeader) {
          this.returnToSupplierDetails = [];
          this.supplierId = 'CASH';
          this.transCode = null;
        }
        else{
          this.returnToSupplierDetails = await firstValueFrom(this.returnToSupplierDetailsService.getReturnToSupplierDetailsByTransCode(this.returnToSupplierHeader.TransCode));
          this.supplierId = this.returnToSupplierHeader.SupplierId;
          this.transCode = this.returnToSupplierHeader.TransCode;
        }
      }
      finally{
        this.isLoading2 = false;
        this.displayReturnToSupplierDetails();
      }
    } 

    // async getReturnToSupplierDetails(){
    //   if(this.transCode == null){
    //     await this.getTransCode();
    //   }
    //   this.isLoading2 = true;
    //   this.returnToSupplierHeader  = await firstValueFrom(this.returnToSupplierHeadersService.getReturnToSupplierHeaderByTransCode(this.transCode));
    //   this.returnToSupplierDetails =  await firstValueFrom(this.returnToSupplierDetailsService.getReturnToSupplierDetailsByTransCode(this.transCode));
  
    //   if(this.returnToSupplierHeader){
    //     if(this.returnToSupplierHeader.SupplierId){
    //       if(this.supplierId  != 'CASH'){
    //         this.supplierId = this.supplierId
    //       }else{
    //         this.supplierId = this.returnToSupplierHeader.SupplierId
    //       }
    //     }
    //   }else{
    //     this.supplierId = 'CASH';
    //   }
      
    //   if(this.returnToSupplierDetails)
    //     this.isLoading2 = false;
    //   this.displayReturnToSupplierDetails();
    // } 
  
    async getSupplierReceivingDetails(){
      this.isLoading1 = true;
        this.receivingDetails = await firstValueFrom(this.receivingDetailsService.getReceivingDetailsForReturnToSupplierByDateFromByDateToBySupplierIdWDate(
          this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
          this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
          this.supplierId,
          this.withDate
        ));

         if(this.returnToSupplierDetails.length != 0){
        this.receivingDetails= this.receivingDetails.filter(y =>
          this.returnToSupplierDetails.every(x => x.RRDetailId !== y.id)
      );
    }

      this.isLoading1 = false;
      this.displayReceivingDetails();
    }
  
    displayReceivingDetails(){
      var data = this.receivingDetails; 
      this.resetSearchBoxes();
      this.listData1 = new MatTableDataSource(data);
      this.listData1.paginator = this.paginator1;
      this.searchInput.nativeElement.focus();
    }
  
    displayReturnToSupplierDetails(){
      var data = this.returnToSupplierDetails; 
      this.totalAmount = 0;
      if(data.length > 0){
        data.forEach(x => {
          this.totalAmount += +x.Amount;
        });
      }
      this.selectedId = undefined;
      this.selectedData = undefined;
      this.listData2 = new MatTableDataSource(data);
      this.listData2.paginator = this.paginator2;
  
      this.getSupplierReceivingDetails();
    }
  
  
  
  getRecord2(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  getRecord1(data : any){
    this.receivingDetailId = data.id;
    this.selectedItem = data;

    const filtered = this.listData1?.filteredData;
    if (filtered) {
      const index = filtered.findIndex((item: any) => item.id === data.id);
      if (index !== -1) {
        this.selectedRowIndex = index;
      }
    }
  }

  getFirstRecordItem() {
    const data = this.listData1?.filteredData[0];
    if (data) {
      this.getRecord1(data);
    }
  }

  getFirstRecord() {
    const data = this.listData1?.filteredData[0];
    if (data) {
      const index = this.listData1.data.findIndex((x: any) => x.id === data.id);
      this.selectedRowIndex = index;
      this.getRecord1(data);

      setTimeout(() => {
          if (this.searchInput) {
            this.searchInput.nativeElement.blur();
          }
          const table = document.querySelector('mat-table') as HTMLElement;
          if (table) {
            table.focus();
          } else {
            console.warn('mat-table not found in DOM');
          }
        }, 100);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    const data = this.listData1?.filteredData;
    if (!data || data.length === 0) return;

    if (event.key === 'ArrowDown') {
      this.selectedRowIndex = (this.selectedRowIndex + 1) % data.length;
      this.getRecord1(data[this.selectedRowIndex]);
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.selectedRowIndex = (this.selectedRowIndex - 1 + data.length) % data.length;
      this.getRecord1(data[this.selectedRowIndex]);
      event.preventDefault();
    }

    // Scroll logic (same as before)
    setTimeout(() => {
      const rowElems = this.rows?.toArray();
      const selectedRow = rowElems?.[this.selectedRowIndex];
      if (selectedRow) {
        const rowElement = selectedRow.nativeElement;
        const container = this.tableContainer.nativeElement;

        const rowTop = rowElement.offsetTop;
        const rowBottom = rowTop + rowElement.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        if (rowTop < containerTop || rowBottom > containerBottom) {
          rowElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }

  async onFocusQty(){
    if(this.transCode == null){
      await this.getTransCode();
    }

    this.selectedItem.TransCode = this.transCode;
    this.selectedItem.SupplierId = this.supplierId;

    this.saveToReturnToSupplierHeaders();
  }

    saveToReturnToSupplierHeaders()
    {
        this.returnToSupplierTransactionService.saveToReturnToSupplierHeaders(this.selectedItem.id, this.transCode, this.supplierId, this.selectedItem.Cost, 'open').subscribe({
          next: (res)=>{
            this.transCode = res.returnToSupplierDetail?.TransNo ?? this.transCode;  // the first line gets the temporary TransNo
            this.notif.toastrSuccess(res.message);
            this.returnToSupplierDetails = [ res.returnToSupplierDetail,...this.returnToSupplierDetails]; 
            this.displayReturnToSupplierDetails();
            this.resetSearchBoxes();
          },
          error: (err)=>{
            this.notif.toastrError(err.error.message);
            this.receivingDetailId = undefined;
          }
        }); 
    }
  
    async PopupQtyUI2(receivingDetail)
    {
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '600px';
      dialogConfig.data = (['',receivingDetail, 'additemreturntosuppliertransaction']);
      this.dialog.open(ReturnToSupplierDetailUIComponent,dialogConfig).beforeClosed().subscribe(returnToSupplierDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(returnToSupplierDetail) ? returnToSupplierDetail[0] : returnToSupplierDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
        if(returnToSupplierDetail){
          this.returnToSupplierDetails = [ returnToSupplierDetail,...this.returnToSupplierDetails]; 
          this.displayReturnToSupplierDetails();
          this.resetSearchBoxes();
        }
      
      });
    }
    
    async onClickSaveTransaction(){
    if (!this.matTableService.CommonTransaction()) {
      return;
    }
      if(this.returnToSupplierDetails.length == 0)
        return this.notificationService.toastrWarning('Empty Transaction');
  
      var supplier:any = await firstValueFrom(this.suppliersService.getSupplierBySupplierId(this.supplierId));
      var refundable:any = await firstValueFrom(this.returnToSupplierDetailsService.computeReturnToSupplierRefundable(this.transCode));
      this.disableSave = true;
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data = ([supplier,this.returnToSupplierHeader, this.transCode, this.totalAmount, 'open','savereturntosuppliertransaction', refundable]);
      this.dialog.open(ReturnToSupplierHeaderUIComponent,dialogConfig).beforeClosed().subscribe(async x => {
        if(x){
          await this.getTransCode();
          this.returnToSupplierHeader = null;
          this.supplierId = 'CASH';
          this.returnToSupplierDetails= [];
          this.displayReturnToSupplierDetails();
        }
      });
      
    }
  
   async onClickEdit(){
      if (!this.matTableService.checkNull(this.selectedId)) return;
      
      var returnToSupplierDetail:any = await firstValueFrom(this.returnToSupplierDetailsService.getReturnToSupplierDetailById(this.selectedData.id));
      var receivingDetail:any = await firstValueFrom(this.receivingDetailsService.getReceivingDetailById(this.selectedData.RRDetailId));
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '600px';
      dialogConfig.data = ([returnToSupplierDetail,receivingDetail, 'updatereturntosuppliertransaction']);
      this.dialog.open(ReturnToSupplierDetailUIComponent,dialogConfig).beforeClosed().subscribe(returnToSupplierDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(returnToSupplierDetail) ? returnToSupplierDetail[0] : returnToSupplierDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
        if(returnToSupplierDetail){
          const returnToSupplierDetailIndex = this.returnToSupplierDetails.findIndex(detail => detail.id === returnToSupplierDetail.id);
          if (returnToSupplierDetailIndex !== -1) {
            this.returnToSupplierDetails[returnToSupplierDetailIndex] = returnToSupplierDetail;  
          }
          this.displayReturnToSupplierDetails();
        } 
      });
    }
  
    onClickRemove(){
      if (!this.matTableService.checkNull(this.selectedId)) return;
      this.notificationService.popupWarning("Delete Record",this.selectedData.ItemName+ " will be remove. Continue?").then((result) => {
        if (result.value) {
          this.returnToSupplierTransactionService.deleteReturnToSupplierDetailById(this.selectedData.id).subscribe({
              next:(res)=>{
                this.notificationService.toastrSuccess(res.message);
                this.returnToSupplierDetails = this.returnToSupplierDetails.filter(x => x.id != this.selectedData.id);
                this.displayReturnToSupplierDetails();
              },
              error:(err)=>{
                this.notificationService.toastrError(err.error.message);
              },
          });
        }
      });
    }
  
    onClickRemoveAll(){
      if(this.returnToSupplierDetails.length == 0)
        return this.notificationService.toastrWarning('Empty Transaction');

      this.notificationService.popupWarning("Delete Record","All Items will be REMOVED. Continue?").then((result) => {
        if (result.value) {
          this.returnToSupplierTransactionService.deleteReturnToSupplierDetailsByTransCode(this.transCode).subscribe({
              next:(res)=>{
                this.notificationService.toastrSuccess(res.message);
                this.returnToSupplierDetails = [];
                this.displayReturnToSupplierDetails();
              },
              error:(err)=>{
                this.notificationService.toastrError(err.error.message);
              },
          });
        }
      });
    }
    
  async onClickSerialNos(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var rTSDetail:any = await firstValueFrom(this.returnToSupplierDetailsService.getReturnToSupplierDetailById(this.selectedId));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([rTSDetail, 'returntosuppliertransaction', '']);
    dialogConfig.viewContainerRef = this.viewContainerRef; 
    this.dialog.open(RTSSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(rTsDetail => {
      if (!this.transCode) this.transCode = (Array.isArray(rTsDetail) ? rTsDetail[0] : rTsDetail)?.TransNo ?? null;  // the first line gets the temporary TransNo
      this.getReturnToSupplierDetails();
    });
  }
  
    onClickSaveAsPending(){
      if(this.returnToSupplierDetails.length == 0)
        return this.notificationService.toastrWarning('Empty Transaction');

      this.notificationService.popupWarning("Pending ReturnToSupplier","All Items will be save as pending. Continue?").then((result) => {
        if (result.value) {
          this.returnToSupplierTransactionService.saveAsPendingReturnToSupplierByTransCode(this.transCode).subscribe({
              next:(res)=>{
                this.notificationService.toastrSuccess(res.message);
                this.transCode = null;
                this.returnToSupplierHeader = null;   // Save As Pending: start a new transaction (the saved one stays in Show Pending, Desktop)
                this.returnToSupplierDetails = [];
                this.displayReturnToSupplierDetails();
              },
              error:(err)=>{
                this.notificationService.toastrError(err.error);
              },
          });
        }
      });
    }
  
    onClickShowPending(){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data        = this.transCode;
      dialogConfig.viewContainerRef = this.viewContainerRef; 
      this.dialog.open(ReturnToSupplierPendingTransactionsUIComponent,dialogConfig).beforeClosed().subscribe(res => {
        if(res){
          this.transCode = res.transCode; 
          this.returnToSupplierDetails = res.returnToSupplierDetails; 
          this.returnToSupplierHeader = res.returnToSupplierHeader; 
          this.supplierId = res.returnToSupplierHeader.SupplierId; 
          this.displayReturnToSupplierDetails();
        }
      });
    }
  
  
  
  
    onClickLoadItems(){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1500px';
      dialogConfig.data         = ([this.transCode, this.supplierId,this.returnToSupplierDetails, 'returntosuppliertransaction']);
      this.dialog.open(LoadItemsForReturnToSupplierUIComponent,dialogConfig).beforeClosed().subscribe(returnToSupplierDetails => {
      if (!this.transCode) this.transCode = (Array.isArray(returnToSupplierDetails) ? returnToSupplierDetails[0] : returnToSupplierDetails)?.TransNo ?? null;  // the first line gets the temporary TransNo
        this.returnToSupplierDetails = returnToSupplierDetails; 
        this.displayReturnToSupplierDetails();
      });
    }
  
  
    updateElementReturnToSupplierDetail(event: any, id, Column){
      if(Column == 'DiscountType'){
        var Value = event.checked;
        if(Value == true){
          Value = 'percent';
        }else{
          Value = 'amount';
        }
      }else{
        var Value = event.target.value ;
        if (!this.numbersService.isNumber(Value)) {
          return this.notif.toastrWarning(Value+' is not a number.');
        } 
      }
      this.returnToSupplierTransactionService.updateElementReturnToSupplierDetail(id, Column, Value).subscribe({
        next:(res) =>{
          this.notif.toastrSuccess(res.message);
  
          //update returnToSupplierDetailsDisplay
          const returnToSupplierDetailIndex = this.returnToSupplierDetails.findIndex(detail => detail.id === id);
          if (returnToSupplierDetailIndex !== -1) {
            this.returnToSupplierDetails[returnToSupplierDetailIndex] = res.returnToSupplierDetail;  
          }
          this.displayReturnToSupplierDetails();
        },
        error:(err) => {
          this.notif.toastrError(err.error.message);
        },
      });
    }
  
    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;
    contextMenuPosition = { x: '0px', y: '0px' };
    onContextMenu(event: MouseEvent, data: any, type) {
      this.rightClickType = type;
      if(data)
       if(type == 'returntosupplierdetails'){
          this.getRecord2(data);
        }else{
          this.getRecord1(data);
        }
      
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenu.menuData = { 'data': data };
        this.contextMenu.menu.focusFirstItem('mouse');
        this.contextMenu.openMenu();
    }
  
    applyFilter(){
      this.matTableService.applyFilter(this.listData1, this.searchKey1);
    }
  
    clearSearch(){
      this.searchKey1 =  this.matTableService.clearSearch(this.listData1);
    }
    
    async applyFilter2(){
      this.matTableService.applyFilter(this.listData1, this.searchKey1);
      this.selectedItem = this.listData1.filteredData[0];
  
      if(!this.selectedItem || this.selectedItem == undefined){
        this.getFirstRecord();
        return this.notificationService.toastrWarning("Item Not Found.");
      }
      this.onFocusQty();
    }
  
    resetSearchBoxes(){
      this.receivingDetailId = undefined;
      this.qty = undefined;
      this.selectedItem = undefined;
      this.searchKey1 = undefined;
      this.searchInput.nativeElement.focus();
      if(this.listData1?.filteredData){
        this.clearSearch();
      }
    }

@HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {

   if (event.key === 'F4') {
    event.preventDefault();
    this.onClickSaveTransaction();
  }
  
}
  getTotal(column){
    let sum = 0;
    this.listData2?.filteredData.forEach(x => {
            sum += +x[column];
    });
    return sum;
  }


}
