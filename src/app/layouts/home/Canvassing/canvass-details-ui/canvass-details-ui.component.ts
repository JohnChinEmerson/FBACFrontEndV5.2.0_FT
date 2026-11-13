import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
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
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { CanvassDetailUIComponent } from '../canvass-detail-ui/canvass-detail-ui.component';
import { CanvassSuppliersUIComponent } from '../canvass-suppliers-ui/canvass-suppliers-ui.component';
import { StockSupplierUIComponent } from '../stock-supplier-ui/stock-supplier-ui.component';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-canvass-details-ui',
  templateUrl: './canvass-details-ui.component.html',
  styleUrls: ['./canvass-details-ui.component.css']
})
export class CanvassDetailsUIComponent implements OnInit {
  canvassHeader      : any;
  canvassDetails     : any[];
  canvassDetailSuppliers    : any[];
  transNo         : any;
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

  dateFrom        : any = new Date();
  dateTo          : any = new Date();
  type      : string = 'canvassdetails';
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild('paginator') paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild('paginator2') paginator2    : MatPaginator;  
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
    {'Label'   : 'Add Supplier','Function'    : () => this.onClickAddSupplier(),'Disabled': true,}, 

  ];
  contextButtons2      = [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit2(),'Disabled': true,}, 
    {'Label'   : 'Remove','Function'       : () => this.onClickRemove(),'Disabled': true,}, 
  ];

  defaultColumns      = ['TransDate', 'TransNo', 'ReasonName', 'Qty', 'UM', 'ItemName', 'RecordStatus', 'ApprovedStatus'];
  defaultColumns2      = ['SupplierName', 'Cost', 'DiscountPercent', 'MinimumQty', 'TermDays', 'ContactNo', 'ApprovedStatus'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Qty', 'Cost', 'DiscountPercent', 'MinimumQty'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};

  constructor(
    private dialog              : MatDialog,
    private canvassHeadersService  : CanvassHeadersService,
    private canvassDetailsService  : CanvassDetailsService,
    private canvassDetailSuppliersService      : CanvassDetailSuppliersService,
    private stocksService       : StocksService,
    private dateTimesService    : DateTimesService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,
    @Inject(MAT_DIALOG_DATA) public data: any, 

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
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
  async getCanvassHeader(transNo){
    this.canvassHeader = await firstValueFrom(this.canvassHeadersService.getCanvassHeaderByTransNo(transNo));
  }

  async onClickView(){
    this.isLoading = true;
    if(this.transNo == 'all'){
      this.canvassDetails = await firstValueFrom(this.canvassDetailsService.getCanvassDetailsByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      ));
    }else{
      this.canvassDetails = await firstValueFrom(this.canvassDetailsService.getCanvassDetailsByTransNo(
      this.transNo
    ));
    }
    
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

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
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
    this.canvassDetailSuppliers =  await firstValueFrom(this.canvassDetailSuppliersService.getCanvassDetailSuppliersByTransDetailId(this.selectedId));
    if(this.canvassDetailSuppliers)
      this.isLoading2 = false;
    this.displayCanvassDetailSuppliers();
  } 

  displayCanvassDetailSuppliers(){
    var data = this.canvassDetailSuppliers; 
    this.selectedId2 = undefined;
    this.selectedData2 = undefined;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
  }

  async onClickAddSupplier(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

      var canvassDetail:any = await firstValueFrom(this.canvassDetailsService.getCanvassDetailById(this.selectedData.id));
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data = ([canvassDetail, 'addcanvasssuppliers']);  
      this.dialog.open(CanvassSuppliersUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        this.getCanvassDetailSuppliers();
      });
  
    }


  async onClickEdit(){
        if (!this.matTableService.checkNull(this.selectedId)) return;
    
        var stock:any = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedData.ItemId));
        var canvassDetail:any = await firstValueFrom(this.canvassDetailsService.getCanvassDetailById(this.selectedData.id));
        const dialogConfig        = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus    = true;
        dialogConfig.width        = '600px';
        dialogConfig.data = ([canvassDetail,stock, 'editcanvassrecord']);
        this.dialog.open(CanvassDetailUIComponent,dialogConfig).beforeClosed().subscribe(canvassDetail => {
          if(canvassDetail){
            const canvassDetailIndex = this.canvassDetails.findIndex(detail => detail.id === canvassDetail.id);
            if (canvassDetailIndex !== -1) {
              this.canvassDetails[canvassDetailIndex] = canvassDetail;  
            }
            this.displayRecords();
            this.selectedId = undefined;
            this.getCanvassDetailSuppliers();
          }
        
        });
      }
    
      onClickVoid(){
        if(!this.matTableService.checkNull(this.selectedId)) return;
     
        var action = this.selectedData?.RecordStatus == 'open' ? 'void' : 'open';
        this.notificationService.popupWarning(action.toUpperCase()+" Record",this.selectedData.ItemName + " under " + this.selectedData.TransNo + " will be " + action + ". Continue?").then(async (result) => {
          if (result.value) {
              this.canvassDetailsService.updateCanvassDetailRecordStatus(this.selectedId, action).subscribe({
                next:(res)=>{
                  this.notificationService.toastrSuccess(res.message);
                  this.populateChanges(res.canvassDetail);
                },
                error:(err)=>{
                  this.notificationService.toastrError(err.error);
                },
              });
          }
        });
      }
    
      populateChanges(canvassDetail){
        this.selectedId  = null;
        this.selectedData = null;
        const canvassDetailIndex = this.canvassDetails.findIndex(detail => detail.id === canvassDetail.id);
        if (canvassDetailIndex !== -1) {
          this.canvassDetails[canvassDetailIndex] = canvassDetail;  
        }
        this.displayRecords();
        this.getCanvassDetailSuppliers();
      }

      async onClickEdit2(){
        if (!this.matTableService.checkNull(this.selectedId2)) return;
    
        var stock:any = await firstValueFrom(this.stocksService.getItemByItemId(this.selectedData.ItemId));
        var canvassDetailSupplier:any = await firstValueFrom(this.canvassDetailSuppliersService.getCanvassDetailSupplierById(this.selectedId2));
        const dialogConfig        = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus    = true;
        dialogConfig.width        = '600px';
        dialogConfig.data = ([stock,this.selectedData, 'updatestocksupplierfromcanvasstransaction', canvassDetailSupplier]);  
        this.dialog.open(StockSupplierUIComponent,dialogConfig).beforeClosed().subscribe(x => {
          if(x){
            this.getCanvassDetailSuppliers();
          }
        });
    
      }
    
      onClickRemove(){
        if (!this.matTableService.checkNull(this.selectedId2)) return;
    
        this.notificationService.popupWarning("Delete Record",this.selectedData2.SupplierName+ " will be remove. Continue?").then((result) => {
          if (result.value) {
            this.canvassDetailSuppliersService.deleteCanvassDetailSuppliersById(this.selectedData2.id).subscribe({
                next:(res)=>{
                  this.notificationService.toastrSuccess(res.message);
                  this.canvassDetailSuppliers = this.canvassDetailSuppliers.filter(x => x.id != this.selectedData2.id);
                  this.displayCanvassDetailSuppliers();
                },
                error:(err)=>{
                  this.notificationService.toastrError(err.error);
                },
            });
          }
        });
    
      }
    async onClickPrint(){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcanvassdetails']));
      var data:any = await firstValueFrom(this.canvassDetailsService.getCanvassDetailsWithCanvassDetailSuppliersByDateFromByDateTo(
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
        this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
      ));
      // var data  = this.listData.filteredData;

      var title = 'CANVASS DETAILS FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
      this.printService.popupWindow(url, 'printcanvassdetails', window, 800, 800);
      localStorage.setItem('Header', JSON.stringify([]));
      localStorage.setItem('Details', JSON.stringify(data));
      localStorage.setItem('Title', title);
      localStorage.setItem('TransNo', this.transNo);
    }

    async onClickPrintDetails(){
      if(!this.matTableService.checkNull(this.selectedId)) return;

      await this.getCanvassHeader(this.selectedData.TransNo);

      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcanvassdetails']));
      var data:any = await firstValueFrom(this.canvassDetailsService.getCanvassDetailsWithCanvassDetailSuppliersByTransNo(this.selectedData.TransNo));
      // var data  = this.listData.filteredData.filter(x =>x.TransNo == this.selectedData.TransNo && x.RecordStatus == 'open');
      var title = 'CANVASS RECEIPT OF  - ' + this.canvassHeader.TransNo ;
      
      this.printService.popupWindow(url, 'printcanvassdetails', window, 800, 800);
      localStorage.setItem('Header', JSON.stringify(this.canvassHeader));
      localStorage.setItem('Details', JSON.stringify(data));
      localStorage.setItem('Title', title);
      localStorage.setItem('TransNo', this.selectedData.TransNo);
    }
  
    onContextMenu(event: MouseEvent, data: any,type:string) {
      this.type = type;
      if(data){
        if(type == 'canvassdetails'){
          this.getRecord(data);
        }else{
          this.getRecord2(data);
        }
      }
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenu.menuData = { 'data': data };
        this.contextMenu.menu.focusFirstItem('mouse');
        this.contextMenu.openMenu();
      
    }
}
