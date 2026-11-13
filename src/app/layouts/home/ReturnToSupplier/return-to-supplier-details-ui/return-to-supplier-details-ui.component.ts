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
import { PrintService } from 'src/app/services/print.service';
import { ReceivingDetailsService } from 'src/app/services/Receiving/receiving-details.service';
import { ReturnToSupplierConfigService } from 'src/app/services/ReturnToSupplier/return-to-supplier-config.service';
import { ReturnToSupplierDetailsService } from 'src/app/services/ReturnToSupplier/return-to-supplier-details.service';
import { ReturnToSupplierHeadersService } from 'src/app/services/ReturnToSupplier/return-to-supplier-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { ReturnToSupplierDetailUIComponent } from '../return-to-supplier-detail-ui/return-to-supplier-detail-ui.component';
import { RTSSerialNosUIComponent } from '../rtsserial-nos-ui/rtsserial-nos-ui.component';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-return-to-supplier-details-ui',
  templateUrl: './return-to-supplier-details-ui.component.html',
  styleUrls: ['./return-to-supplier-details-ui.component.css']
})
export class ReturnToSupplierDetailsUIComponent implements OnInit {

    returnToSupplierHeader      : any;
    returnToSupplierConfig      : any;
    returnToSupplierDetails     : any[];
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
      {'Label'   : 'SerialNos','Function'       : () => this.onClickSerialNos(),'Disabled': true,}, 
    ];
    defaultColumns      = ['TransDate','TransNo', 'SupplierName','Qty','UM', 'ItemName','Cost', 'Discount', 'Amount','RecordStatus', 'SalePaidStatus', 'ReadingNo', 'ExpiryDate', 'BatchLotNo', 'Reason'];
    columnConfig: ColumnTypeConfig = {
      decimalColumns: ['Qty','Price', 'Discount', 'Amount'],
      intColumns: [],
      dateTimeColumns: [],
      dateColumns: ['TransDate']
    };
  columnTypeMap: { [key: string]: string } = {};
    constructor(
      private dialog              : MatDialog,
      private returnToSupplierHeadersService  : ReturnToSupplierHeadersService,
      private returnToSupplierDetailsService  : ReturnToSupplierDetailsService,
      private returnToSupplierConfigService   : ReturnToSupplierConfigService,
      private receivingDetailsService      : ReceivingDetailsService,
      private dateTimesService    : DateTimesService,
      public matTableService     : MatTableService,
      private printService        : PrintService,
      private router              : Router,
      private notificationService              : NotificationService,
      private toolBoxService      : ToolBoxService,
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
      this.getReturnToSupplierConfig();
  }
     
  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  
    async getReturnToSupplierConfig(){
      this.returnToSupplierConfig = await firstValueFrom(this.returnToSupplierConfigService.getReturnToSupplierConfig());
    }
  
    async getReturnToSupplierHeader(transNo){
      this.returnToSupplierHeader = await firstValueFrom(this.returnToSupplierHeadersService.getReturnToSupplierHeaderByTransNo(transNo));
    }
  
    async onClickView(){
      this.isLoading = true;
      if(this.transNo == 'all'){
        this.returnToSupplierDetails = await firstValueFrom(this.returnToSupplierDetailsService.getReturnToSupplierDetailsByDateFromByDateTo(
          this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
          this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
        ));
      }else{
        this.returnToSupplierDetails = await firstValueFrom(this.returnToSupplierDetailsService.getReturnToSupplierDetailsByTransNo(
        this.transNo
      ));
      }
      
      if(this.returnToSupplierDetails)
        this.isLoading = false;
      this.displayRecords();
    }
  
    displayRecords(){
      var data = this.returnToSupplierDetails;
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
 
     var returnToSupplierDetail:any = await firstValueFrom(this.returnToSupplierDetailsService.getReturnToSupplierDetailById(this.selectedData.id));
     var receivingDetail:any = await firstValueFrom(this.receivingDetailsService.getReceivingDetailById(this.selectedData.RRDetailId));
 
     const dialogConfig        = new MatDialogConfig();
     dialogConfig.disableClose = true;
     dialogConfig.autoFocus    = true;
     dialogConfig.width        = '600px';
     dialogConfig.data = ([returnToSupplierDetail,receivingDetail, 'editreturntosupplierrecord']);
     this.dialog.open(ReturnToSupplierDetailUIComponent,dialogConfig).beforeClosed().subscribe(returnToSupplierDetail => {
       if(returnToSupplierDetail){
         const returnToSupplierDetailIndex = this.returnToSupplierDetails.findIndex(detail => detail.id === returnToSupplierDetail.id);
         if (returnToSupplierDetailIndex !== -1) {
           this.returnToSupplierDetails[returnToSupplierDetailIndex] = returnToSupplierDetail;  
         }
         this.displayRecords();
         this.selectedId = undefined;
       }
     
     });
   }
 
   onClickVoid(){
     if(!this.matTableService.checkNull(this.selectedId)) return;
   
     var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
     this.notificationService.popupWarning(action.toUpperCase()+" Record",this.selectedData.ItemName + " under " + this.selectedData.TransNo + " will be " + action + ". Continue?").then(async (result) => {
       if (result.value) {
           this.returnToSupplierDetailsService.updateReturnToSupplierDetailRecordStatus(this.selectedId, action).subscribe({
             next:(res)=>{
               this.notificationService.toastrSuccess(res.message);
               this.populateChanges(res.returnToSupplierDetail);
             },
             error:(err)=>{
               this.notificationService.toastrError(err.error);
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
    dialogConfig.data         = ([rTSDetail, 'returntosupplierdetails', '']);
    this.dialog.open(RTSSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(rTsDetail => {
      this.onClickView();
    });
  }
 
   populateChanges(returnToSupplierDetail){
     this.selectedId  = null;
     this.selectedData = null;
     const returnToSupplierDetailIndex = this.returnToSupplierDetails.findIndex(detail => detail.id === returnToSupplierDetail.id);
     if (returnToSupplierDetailIndex !== -1) {
       this.returnToSupplierDetails[returnToSupplierDetailIndex] = returnToSupplierDetail;  
     }
     this.displayRecords();
   } 
    onClickPrint(){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreturntosupplierdetails']));
      var data  = this.listData.filteredData;
      var title = 'RETURN TO SUPPLIER DETAILS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
      this.printService.popupWindow(url, 'ReturnToSupplierDetails', window, 800, 800);
      localStorage.setItem('Header', JSON.stringify([]));
      localStorage.setItem('Details', JSON.stringify(data));
      localStorage.setItem('ReturnToSupplierConfig', JSON.stringify(this.returnToSupplierConfig));
      localStorage.setItem('Title', title);
      localStorage.setItem('TransNo', this.transNo);
    }
  
    async onClickPrintDetails(){
      if(!this.matTableService.checkNull(this.selectedId)) return;
  
      await this.getReturnToSupplierHeader(this.selectedData.TransNo);
  
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreturntosupplierdetails']));
      var data  = this.listData.filteredData.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
      var title = 'RETURN TO SUPPLIER RECEIPT OF  - ' + this.returnToSupplierHeader.TransNo ;
      
      this.printService.popupWindow(url, 'printreturntosupplierdetails', window, 800, 800);
      localStorage.setItem('Header', JSON.stringify(this.returnToSupplierHeader));
      localStorage.setItem('Details', JSON.stringify(data));
      localStorage.setItem('ReturnToSupplierConfig', JSON.stringify(this.returnToSupplierConfig));
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
