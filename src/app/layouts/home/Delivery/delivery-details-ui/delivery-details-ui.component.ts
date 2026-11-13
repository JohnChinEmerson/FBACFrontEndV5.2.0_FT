import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { DeliveryConfigService } from 'src/app/services/Delivery/delivery-config.service';
import { DeliveryDetailsService } from 'src/app/services/Delivery/delivery-details.service';
import { DeliveryHeadersService } from 'src/app/services/Delivery/delivery-headers.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { DeliveryDetailUIComponent } from '../delivery-detail-ui/delivery-detail-ui.component';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-delivery-details-ui',
  templateUrl: './delivery-details-ui.component.html',
  styleUrls: ['./delivery-details-ui.component.css']
})
export class DeliveryDetailsUIComponent implements OnInit {

  deliveryHeader      : any;
  deliveryConfig      : any;
  deliveryDetails     : any[];
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
  defaultColumns = ['TransDate','TransNo', 'CustomerName','Qty','UM', 'ItemName','Price', 'Discount', 'Amount','RecordStatus', 'ExpiryDate', 'BatchLotNo'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty','Price', 'Discount', 'Amount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private deliveryHeadersService  : DeliveryHeadersService,
    private deliveryDetailsService  : DeliveryDetailsService,
    private deliveryConfigService   : DeliveryConfigService,
    private saleDetailsService      : SaleDetailsService,
    private toolBoxService      : ToolBoxService,
    private dateTimesService    : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private notificationService              : NotificationService,
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
    this.getDeliveryConfig();
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getDeliveryConfig(){
    this.deliveryConfig = await firstValueFrom(this.deliveryConfigService.getDeliveryConfig());
  }

  async getDeliveryHeader(transNo){
    this.deliveryHeader = await firstValueFrom(this.deliveryHeadersService.getDeliveryHeaderByTransNo(transNo));
  }

  async onClickView(){
    this.isLoading = true;
    if(this.transNo == 'all'){
      this.deliveryDetails = await firstValueFrom(this.deliveryDetailsService.getDeliveryDetailsByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      ));
    }else{
      this.deliveryDetails = await firstValueFrom(this.deliveryDetailsService.getDeliveryDetailsByTransNo(
      this.transNo
    ));
    }
    
    if(this.deliveryDetails)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.deliveryDetails;
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
    
        var saleDetail:any = await firstValueFrom(this.saleDetailsService.getSaleDetailById(this.selectedData.SaleDetailId));
        var deliveryDetail:any = await firstValueFrom(this.deliveryDetailsService.getDeliveryDetailById(this.selectedData.id));
    
        
        const dialogConfig        = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus    = true;
        dialogConfig.width        = '600px';
        dialogConfig.data = ([deliveryDetail,saleDetail, 'editdeliveryrecord']);
        this.dialog.open(DeliveryDetailUIComponent,dialogConfig).beforeClosed().subscribe(deliveryDetail => {
          if(deliveryDetail){
            const deliveryDetailIndex = this.deliveryDetails.findIndex(detail => detail.id === deliveryDetail.id);
            if (deliveryDetailIndex !== -1) {
              this.deliveryDetails[deliveryDetailIndex] = deliveryDetail;  
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
              this.deliveryDetailsService.updateDeliveryDetailRecordStatus(this.selectedId, action).subscribe({
                next:(res)=>{
                  this.notificationService.toastrSuccess(res.message);
                  this.populateChanges(res.deliveryDetail);
                },
                error:(err)=>{
                  this.notificationService.toastrError(err.error);
                },
              });
          }
        });
      }
    
      populateChanges(deliveryDetail){
        this.selectedId  = null;
        this.selectedData = null;
        const deliveryDetailIndex = this.deliveryDetails.findIndex(detail => detail.id === deliveryDetail.id);
        if (deliveryDetailIndex !== -1) {
          this.deliveryDetails[deliveryDetailIndex] = deliveryDetail;  
        }
        this.displayRecords();
      }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printdeliverydetails']));
    var data  = this.listData.filteredData;
    var title = 'DELIVERY DETAILS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
    this.printService.popupWindow(url, 'DeliveryDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify([]));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('DeliveryConfig', JSON.stringify(this.deliveryConfig));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', this.transNo);
  }

  async onClickPrintDetails(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    await this.getDeliveryHeader(this.selectedData.TransNo);

    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printdeliverydetails']));
    var data  = this.listData.filteredData.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
    var title = 'DELIVERY RECEIPT OF  - ' + this.deliveryHeader.TransNo ;
    
    this.printService.popupWindow(url, 'deliveryDetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(this.deliveryHeader));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('DeliveryConfig', JSON.stringify(this.deliveryConfig));
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
