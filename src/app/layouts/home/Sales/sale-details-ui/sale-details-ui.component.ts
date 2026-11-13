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
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { SaleDetailUIComponent } from '../sale-detail-ui/sale-detail-ui.component';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { AuthService } from 'src/app/services/auth.service';
import { MachinePermitsService } from 'src/app/services/Config/machine-permits.service';
import { VendorPermitsService } from 'src/app/services/Config/vendor-permits.service';
import { MultiplePaymentHeadersService } from 'src/app/services/MultiplePayments/multiple-payment-headers.service';
import { SaleSerialNosUIComponent } from '../sale-serial-nos-ui/sale-serial-nos-ui.component';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-sale-details-ui',
  templateUrl: './sale-details-ui.component.html',
  styleUrls: ['./sale-details-ui.component.css']
})
export class SaleDetailsUIComponent implements OnInit {

  saleHeader      : any;
  saleConfig      : any;
  saleDetails     : any[];
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
    {'Label'   : 'Print POS','Function'  : () => this.onClickPrintPOS(),'Disabled': true,}, 
  ];  
  contextButtons      = [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Void/Open','Function'       : () => this.onClickVoid(),'Disabled': true,}, 
    {'Label'   : 'SerialNos','Function'       : () => this.onClickSerialNos(),'Disabled': true,}, 
  ];
  defaultColumns      = ['TransDate','TransNo', 'CustomerName','UM', 'ItemName','Qty','Price', 'Discount', 'Amount','RecordStatus', 'PaidStatus', 'ReadingNo', 'ExpiryDate', 'BatchLotNo'];
  
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Price', 'Discount', 'Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private saleHeadersService  : SaleHeadersService,
    private saleDetailsService  : SaleDetailsService,
    private saleConfigService   : SaleConfigService,
    private stocksService       : StocksService,
    private dateTimesService    : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private notificationService : NotificationService,
    private machinePermitsService : MachinePermitsService,
    private vendorPermitsService : VendorPermitsService,
    private multiplePaymentHeadersService : MultiplePaymentHeadersService,
    private auth_service : AuthService,
    private homeTs : HomeComponent,
    private toolBoxService : ToolBoxService,
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
    this.getSaleConfig();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  async getSaleConfig(){
    this.saleConfig = await firstValueFrom(this.saleConfigService.getSaleConfig());
  }

  async getSaleHeader(transNo){
    this.saleHeader = await firstValueFrom(this.saleHeadersService.getSaleHeaderByTransNo(transNo));
  }

  async onClickView(){
    this.isLoading = true;
    if(this.transNo == 'all'){
      this.saleDetails = await firstValueFrom(this.saleDetailsService.getSaleDetailsByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      ));
    }else{
      this.saleDetails = await firstValueFrom(this.saleDetailsService.getSaleDetailsByTransNo(
      this.transNo
    ));
    }
    
    if(this.saleDetails)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.saleDetails;
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
  
      var stock:any = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedData.ItemId));
      var saleDetail:any = await firstValueFrom(this.saleDetailsService.getSaleDetailById(this.selectedData.id));
  
      
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '600px';
      dialogConfig.data = ([saleDetail,stock, 'editsalerecord']);
      this.dialog.open(SaleDetailUIComponent,dialogConfig).beforeClosed().subscribe(saleDetail => {
        if(saleDetail){
          const saleDetailIndex = this.saleDetails.findIndex(detail => detail.id === saleDetail.id);
          if (saleDetailIndex !== -1) {
            this.saleDetails[saleDetailIndex] = saleDetail;  
          }
          this.displayRecords();
          this.selectedId = undefined;
        }
      
      });
    }
  
    onClickVoid(){
      if(!this.matTableService.checkNull(this.selectedId)) return;
      
      if (this.auth_service.Edition.toLowerCase()=="pos/bir")
        {
            return this.notificationService.toastrWarning(" Void Not Allowed.");
        }

      var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
      this.notificationService.popupWarning(action.toUpperCase()+" Record",this.selectedData.ItemName + " under " + this.selectedData.TransNo + " will be " + action + ". Continue?").then(async (result) => {
        if (result.value) {
            this.saleDetailsService.updateSaleDetailRecordStatus(this.selectedId, action).subscribe({
              next:(res)=>{
                this.notificationService.toastrSuccess(res.message);
                this.populateChanges(res.saleDetail);
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
  
      var sDetail:any = await firstValueFrom(this.saleDetailsService.getSaleDetailById(this.selectedId));
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([sDetail, 'saledetails', '']);
      this.dialog.open(SaleSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(saleDetail => {
        this.onClickView();
      });
    }
  
    populateChanges(saleDetail){
      this.selectedId  = null;
      this.selectedData = null;
      const saleDetailIndex = this.saleDetails.findIndex(detail => detail.id === saleDetail.id);
      if (saleDetailIndex !== -1) {
        this.saleDetails[saleDetailIndex] = saleDetail;  
      }
      this.displayRecords();
    }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsaledetails']));
    var data  = this.listData.filteredData;
    var title = 'SALE DETAILS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'SaleDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify([]));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('SaleConfig', JSON.stringify(this.saleConfig));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.transNo);
  }

  async onClickPrintDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    await this.getSaleHeader(this.selectedData.TransNo);

    if(this.saleHeader.PaymentType.toLowerCase() == 'multiple')
      var mpHeaders= await firstValueFrom(this.multiplePaymentHeadersService.getMultiplePaymentsBySourceTransCode(this.saleHeader.TransNo));
    else
      mpHeaders = null;

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printsaledetails']));
    var data  = this.listData.filteredData.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'SALES INVOICE OF  - ' + this.saleHeader.TransNo ;
    
    this.printService.popupWindow(url, 'saleDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(this.saleHeader));
    localStorage.setItem('MPHeader', JSON.stringify(mpHeaders));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('SaleConfig', JSON.stringify(this.saleConfig));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.selectedData.TransNo);
  }

  async onClickPrintPOS(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    // Desktop SaleDetailsUI.PrintReceipt: re-print (VOID watermark when voided; not after a sales return on BIR)
    try {
      var receipt:any = await firstValueFrom(this.saleHeadersService.getSaleReceiptForPrint(this.selectedData.TransNo));
    } catch (err:any) {
      return this.notificationService.toastrError(err.error?.message);
    }
    var bir = (receipt.saleHeader.BIRRegistered || '').toLowerCase() == "yes";
    var url = this.router.serializeUrl(this.router.createUrlTree([bir ? 'print/printposbir' : 'print/printpos']));
    localStorage.setItem('Header', JSON.stringify(receipt.saleHeader));
    localStorage.setItem('Details', JSON.stringify(receipt.saleDetails));
    localStorage.setItem('Discounts', JSON.stringify(receipt.discountApplications));
    localStorage.setItem('machinePermit', JSON.stringify(receipt.machinePermit));
    localStorage.setItem('vendorPermit', JSON.stringify(receipt.vendorPermit));
    localStorage.setItem('Config', JSON.stringify(this.saleConfig));
    localStorage.setItem('ReceiptType', 'sale');
    localStorage.setItem('Reprint', 'true');
    localStorage.setItem('Title', bir ? 'SALES INVOICE' : 'SALES RECEIPT');
    this.printService.popupWindow(url, 'POSPrint', window, 1000, 700);
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
