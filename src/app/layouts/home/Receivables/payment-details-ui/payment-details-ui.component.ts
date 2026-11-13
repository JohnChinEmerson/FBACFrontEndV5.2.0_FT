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
import { PrintService } from 'src/app/services/print.service';
import { PaymentDetailsService } from 'src/app/services/Receivables/payment-details.service';
import { PaymentHeadersService } from 'src/app/services/Receivables/payment-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { PaymentDetailUIComponent } from '../payment-detail-ui/payment-detail-ui.component';
import { NotificationService } from 'src/app/services/notification.service';
import { MultiplePaymentHeadersService } from 'src/app/services/MultiplePayments/multiple-payment-headers.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-payment-details-ui',
  templateUrl: './payment-details-ui.component.html',
  styleUrls: ['./payment-details-ui.component.css']
})
export class PaymentDetailsUIComponent implements OnInit {
  paymentHeader      : any;
  paymentDetails     : any[];
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
  defaultColumns      = ['TransDate', 'TransNo', 'CustomerName', 'SourceName', 'SourceTransNo','Amount','RecordStatus'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private paymentHeadersService  : PaymentHeadersService,
    private paymentDetailsService  : PaymentDetailsService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService    : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private notificationService : NotificationService,
    private multiplePaymentHeadersService : MultiplePaymentHeadersService,
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
    this.paymentHeader = await firstValueFrom(this.paymentHeadersService.getPaymentHeaderByTransNo(transNo));
  }

  async onClickView(){
    this.isLoading = true;
    if(this.transNo == 'all'){
      this.paymentDetails = await firstValueFrom(this.paymentDetailsService.getPaymentDetailsByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      ));
    }else{
      this.paymentDetails = await firstValueFrom(this.paymentDetailsService.getPaymentDetailsByTransNo(
      this.transNo
    ));
    }
    
    if(this.paymentDetails)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.paymentDetails;
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

    var paymentDetail:any = await firstValueFrom(this.paymentDetailsService.getPaymentDetailById(this.selectedData.id));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([paymentDetail, 'editpaymentrecord']);
    this.dialog.open(PaymentDetailUIComponent,dialogConfig).beforeClosed().subscribe(paymentDetail => {
      if(paymentDetail){
        const paymentDetailIndex = this.paymentDetails.findIndex(detail => detail.id === paymentDetail.id);
        if (paymentDetailIndex !== -1) {
          this.paymentDetails[paymentDetailIndex] = paymentDetail;  
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
          this.paymentDetailsService.updatePaymentDetailRecordStatus(this.selectedId, action).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.populateChanges(res.paymentDetail);
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
          });
      }
    });
  }

  populateChanges(paymentDetail){
    this.selectedId  = null;
    this.selectedData = null;
    const paymentDetailIndex = this.paymentDetails.findIndex(detail => detail.id === paymentDetail.id);
    if (paymentDetailIndex !== -1) {
      this.paymentDetails[paymentDetailIndex] = paymentDetail;  
    }
    this.displayRecords();
  }
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpaymentdetails']));
    var data  = this.listData.filteredData;
    var title = 'PAYMENT DETAILS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'PaymentDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify([]));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.transNo);
  }

  async onClickPrintDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    await this.getPaymentHeader(this.selectedData.TransNo);

    if(this.paymentHeader.PaymentType.toLowerCase() == 'multiple')
      var mpHeaders= await firstValueFrom(this.multiplePaymentHeadersService.getMultiplePaymentsBySourceTransCode(this.paymentHeader.TransCode));
    else
      mpHeaders = null;

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printpaymentdetails']));
    var data  = this.listData.filteredData.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'PAYMENT RECEIPT OF  - ' + this.paymentHeader.TransNo ;
    
    this.printService.popupWindow(url, 'paymentDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(this.paymentHeader));
    localStorage.setItem('MPHeader', JSON.stringify(mpHeaders));
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
