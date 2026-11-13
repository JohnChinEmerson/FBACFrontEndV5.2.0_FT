import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SupplierPaymentDetailsService } from 'src/app/services/Payables/supplier-payment-details.service';
import { SupplierPaymentHeadersService } from 'src/app/services/Payables/supplier-payment-headers.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { SupplierPaymentDetailUIComponent } from '../supplier-payment-detail-ui/supplier-payment-detail-ui.component';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-supplier-payment-details-ui',
  templateUrl: './supplier-payment-details-ui.component.html',
  styleUrls: ['./supplier-payment-details-ui.component.css']
})
export class SupplierPaymentDetailsUIComponent implements OnInit {

  supplierPaymentHeader      : any;
   supplierPaymentDetails     : any[];
   transNo         : any;
   selectedData    : any;
   selectedId      : number = 0;
   searchKey       : string = "";
   listData        : MatTableDataSource<any>;
   pageSizeOptions :any = this.matTableService.pageSizeOptions();
   isLoading       : boolean = false;
   dateFrom        : any = new Date();
   dateTo          : any = new Date();
   @ViewChild(MatSort) sort              : MatSort;
   @ViewChild(MatPaginator) paginator    : MatPaginator;  
   @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
 
   contextMenuPosition = { x: '0px', y: '0px' };
 
   toolButtons     = [
     {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
     {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
   ];  
   toolButtons2     = [
     {'Label'   : 'Print Details','Function'  : () => this.onClickPrintDetails(),'Disabled': true,}, 
   ];  
   contextButtons      = [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Void/Open','Function'       : () => this.onClickVoid(),'Disabled': true,}, 
   ];
    defaultColumns      = ['TransDate', 'TransNo', 'SupplierName', 'SourceName', 'SourceTransNo','Amount','RecordStatus'];
    columnConfig: ColumnTypeConfig = {
      decimalColumns: ['Amount'],
      intColumns: [],
      dateTimeColumns: [],
      dateColumns: ['TransDate']
    };
    columnTypeMap: { [key: string]: string } = {};
   constructor(
     private dialog              : MatDialog,
     private supplierPaymentHeadersService  : SupplierPaymentHeadersService,
     private supplierPaymentDetailsService  : SupplierPaymentDetailsService,
     private toolBoxService      : ToolBoxService,
     private dateTimesService    : DateTimesService,
     public matTableService     : MatTableService,
     private printService        : PrintService,
     private router              : Router,
     private notificationService : NotificationService,
     private homeTs              : HomeComponent,
     @Inject(MAT_DIALOG_DATA) public data: any, 
 
   ) { }
 
   async ngOnInit(): Promise<void> {
     this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
     await this.homeTs.getButtons();
     this.toolBoxService.disableButtons(this.toolButtons, this.toolButtons2, this.contextButtons, null);
     this.dateFrom = this.data[0];
     this.dateTo   = this.data[1];
     this.transNo = this.data[2];
     this.onClickView();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }
 
   async getPaymentHeader(transNo){
     this.supplierPaymentHeader = await firstValueFrom(this.supplierPaymentHeadersService.getSupplierPaymentHeaderByTransNo(transNo));
   }
 
   async onClickView(){
     this.isLoading = true;
     if(this.transNo == 'all'){
       this.supplierPaymentDetails = await firstValueFrom(this.supplierPaymentDetailsService.getSupplierPaymentDetailsByDateFromByDateTo(
         this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
         this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
       ));
     }else{
       this.supplierPaymentDetails = await firstValueFrom(this.supplierPaymentDetailsService.getSupplierPaymentDetailsByTransNo(
       this.transNo
     ));
     }
     
     if(this.supplierPaymentDetails)
       this.isLoading = false;
     this.displayRecords();
   }
 
   displayRecords(){
     var data = this.supplierPaymentDetails;
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
     this.selectedId = data.id;
     this.selectedData = data;
   }

  async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var supplierPaymentDetail:any = await firstValueFrom(this.supplierPaymentDetailsService.getSupplierPaymentDetailById(this.selectedData.id));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([supplierPaymentDetail, 'editsupplierpaymentrecord']);
    this.dialog.open(SupplierPaymentDetailUIComponent,dialogConfig).beforeClosed().subscribe(supplierPaymentDetail => {
      if(supplierPaymentDetail){
        const supplierPaymentDetailIndex = this.supplierPaymentDetails.findIndex(detail => detail.id === supplierPaymentDetail.id);
        if (supplierPaymentDetailIndex !== -1) {
          this.supplierPaymentDetails[supplierPaymentDetailIndex] = supplierPaymentDetail;  
        }
        this.displayRecords();
        this.selectedId = undefined;
      }
    
    });
  }

  onClickVoid(){
    if(!this.matTableService.checkNull(this.selectedId)) return;
  
    var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
    this.notificationService.popupWarning(action.toUpperCase()+" Record",this.selectedData.SourceTransNo + " under " + this.selectedData.TransNo + " will be " + action + ". Continue?").then(async (result) => {
      if (result.value) {
          this.supplierPaymentDetailsService.updateSupplierPaymentDetailRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.supplierPaymentDetail);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
      }
    });
  }

  populateChanges(supplierPaymentDetail){
    this.selectedId  = null;
    this.selectedData = null;
    const supplierPaymentDetailIndex = this.supplierPaymentDetails.findIndex(detail => detail.id === supplierPaymentDetail.id);
    if (supplierPaymentDetailIndex !== -1) {
      this.supplierPaymentDetails[supplierPaymentDetailIndex] = supplierPaymentDetail;  
    }
    this.displayRecords();
  }
   onClickPrint(){
     var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsupplierpaymentdetails']));
     var data  = this.listData.filteredData;
     var title = 'SUPPLIER PAYMENT DETAILS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
     this.printService.popupWindow(url, 'PaymentDetails', window, 800, 800);
     localStorage.setItem('Header', JSON.stringify([]));
     localStorage.setItem('Details', JSON.stringify(data));
     localStorage.setItem('Title', title);
     localStorage.setItem('TransNo', this.transNo);
   }
 
   async onClickPrintDetails(){
     if(!this.matTableService.checkNull(this.selectedId)) return;
 
     await this.getPaymentHeader(this.selectedData.TransNo);
 
     var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsupplierpaymentdetails']));
     var data  = this.listData.filteredData.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
     var title = 'SUPPLIER PAYMENT RECEIPT OF  - ' + this.supplierPaymentHeader.TransNo ;
     
     this.printService.popupWindow(url, 'supplierPaymentDetails', window, 800, 800);
     localStorage.setItem('Header', JSON.stringify(this.supplierPaymentHeader));
     localStorage.setItem('Voucher', null);
     localStorage.setItem('Details', JSON.stringify(data));
     localStorage.setItem('Title', title);
     localStorage.setItem('TransNo', this.selectedData.TransNo);
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
