import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, forkJoin } from 'rxjs';
import { ItemsService } from 'src/app/services/Files/items.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { BarcodeUIComponent } from '../barcode-ui/barcode-ui.component';
import { PrintService } from 'src/app/services/print.service';
import { Router } from '@angular/router';
import { MultipleUMsService } from 'src/app/services/Files/multiple-ums.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-barcode-items-ui',
  templateUrl: './barcode-items-ui.component.html',
  styleUrls: ['./barcode-items-ui.component.css']
})
export class BarcodeItemsUIComponent implements OnInit {

  itemsWBarcode         : any[];
  itemsNoBarcode       : any[];
  multupleUMs: any[];
  multupleUMsitemsNoBarcode       : any[];
  isLoading               : boolean = false;
  pageSizeOptions1        : number[] = this.matTableService.pageSizeOptions();
  listData1               : MatTableDataSource<any>;
  searchKey1              : string = "";
  pageSizeOptions2        : number[] = this.matTableService.pageSizeOptions();
  listData2               : MatTableDataSource<any>;
  searchKey2              : string = "";
  selectedData            : any;
  selectedId              : any;
  selectedUM              : any;
  selectedItemIds         : any = [];
  items                   : any=[]
  @ViewChild(MatSort) sort1              : MatSort;
  @ViewChild('paginator1') paginator1    : MatPaginator;
  @ViewChild(MatMenuTrigger) contextMenu1: MatMenuTrigger;

  @ViewChild(MatSort) sort2              : MatSort;
  @ViewChild('paginator2') paginator2    : MatPaginator;
  @ViewChild(MatMenuTrigger) contextMenu2: MatMenuTrigger;

  defaultColumns  = ['ItemName', 'UM', 'Barcode'];
  defaultColumns2  = ['ItemName', 'UM', 'Barcode',];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};


  toolButtons1     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Add','Function'             : () => this.onClickAdd(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrintNoBarcode(),'Disabled': true,}, 
  ];

  toolButtons2     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Remove','Function'          : () => this.onClickRemove(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrintWBarcode(),'Disabled': true,}, 
     ...(this.authService.Branch?.BranchId === 'b01'
    ? [{
        Label: 'Update Branch Barcodes',
        Function: () => this.OnClickUpdateBranchBarcode(),
        Disabled: true
      }]
    : [])
  ];

  contextButtons = [
    { 'Label': 'Remove', 'Function'         : () => this.onClickRemove(), 'Disabled': true },
  ];

  constructor(
    private dialog                  : MatDialog,
    private itemsService            : ItemsService,
    private multipleUMsService            : MultipleUMsService,
    private notif                   : NotificationService,
    public matTableService         : MatTableService,
    private printService         : PrintService,
    private router         : Router,
    public authService          : AuthService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.onClickView();
    this.itemsService.requiredRefresh.subscribe(()=>{
      this.onClickView();
    });
    this.multipleUMsService.requiredRefresh.subscribe(()=>{
      this.onClickView();
    });
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  async onClickView(){
    this.isLoading  = true;
    this.items      = await firstValueFrom(this.itemsService.getItemsToBarcoding());
    this.multupleUMs      = await firstValueFrom(this.multipleUMsService.getMultipleUMsItemsToBarcoding());

    this.items.forEach(x => {
      x.IsBaseUM = 'yes';
    });
    this.multupleUMs.forEach(x => {
      x.IsBaseUM = 'no';
    });

    this.items = [
      ...this.items,
      ...this.multupleUMs
    ].sort((a, b) => a.ItemName.localeCompare(b.ItemName));

    if(this.items)
      this.isLoading  = false;
    this.onClickNoBarcode();
    this.onClickWBarcode();
  }
  
  async onClickWBarcode(){
    this.isLoading         = true;
    this.itemsWBarcode    = this.items.filter(x=> x.Barcode.toLowerCase() != 'na');

    if(this.itemsWBarcode)
      this.isLoading        = false;
    this.displayRecords2();
  }

  async onClickNoBarcode(){
    this.isLoading            = true;
    this.itemsNoBarcode    = this.items.filter(x=> x.Barcode.toLowerCase() == 'na');
    if(this.itemsNoBarcode)
    this.isLoading            = false;
    this.displayRecords();
  }

  applyFilter1(){
    this.matTableService.applyFilter(this.listData1, this.searchKey1);
  }
  
  clearSearch1(){
    this.searchKey1 = this.matTableService.clearSearch(this.listData1);
  }
  applyFilter2(){
    this.matTableService.applyFilter(this.listData2, this.searchKey2);
  }
  
  clearSearch2(){
    this.searchKey2 = this.matTableService.clearSearch(this.listData2);
  }

  displayRecords(){
    var data        = this.itemsNoBarcode;
    this.listData1 = new MatTableDataSource(data);
    this.listData1.paginator = this.paginator1;
  }

  displayRecords2(){
    var data        = this.itemsWBarcode;
    this.listData2 = new MatTableDataSource(data);
    this.listData2.paginator = this.paginator2;
  }

  getRecord(data : any){
    this.selectedId = data.ItemId;
    this.selectedUM = data.UM;
    this.selectedData = data;
  }
  
  
  onClickAdd(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data         = this.selectedData;
    this.dialog.open(BarcodeUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.onClickView();
    });
  }

  onClickRemove(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notif.popupWarning("Remove Barcode","Are you sure to set Barcode to 'NA'?").then((result) => {
      if (result.value) {
      if(this.selectedData.IsBaseUM.toLowerCase() == 'yes'){
          this.itemsService.updateBarcode(this.selectedData.ItemId, 'na').subscribe({
            next:(res)=>{
              this.selectedItemIds  = [];
              this.notif.toastrSuccess(res.message);
              this.onClickView();
            },
            error:(err)=> {
              this.notif.toastrError(err.error);
            },
          });
      }else{
        this.multipleUMsService.updateMultipleUMBarcode(this.selectedData.ItemId,this.selectedData.UM, 'na').subscribe({
            next:(res)=>{
              this.selectedItemIds  = [];
              this.notif.toastrSuccess(res.message);
              this.onClickView();
            },
            error:(err)=> {
              this.notif.toastrError(err.error);
            },
          });
      }

      }
    });
    
  }

  onClickPrintNoBarcode(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printbarcodeitems']));
    var data  = this.listData1.filteredData;
    this.printService.popupWindow(url, 'Items', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', 'NO BARCODE ITEMS');
  }

  onClickPrintWBarcode(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printbarcodeitems']));
    var data  = this.listData2.filteredData;
    this.printService.popupWindow(url, 'Items', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', 'WITH BARCODE ITEMS');
  }

  OnClickUpdateBranchBarcode() {
    return this.notif
      .popupWarning("Update Branch Barcode", "Are you sure to update barcodes of other branches?")
      .then((result) => {
        if (!result.isConfirmed) return;

        const requests = this.listData2.filteredData
          .map((item) => {
            const um = item.IsBaseUM.toLowerCase() === 'yes' ? 'all' : item.UM;
            return this.itemsService.updateBranchBarcode(item.ItemName, um);
          });

        if (requests.length === 0) return;

        forkJoin(requests).subscribe({
          next: () => {
            this.notif.toastrSuccess("All branch barcodes updated successfully.");
            this.onClickView();
          },
          error: (err) => {
            this.notif.toastrError(err.error?.message ?? "An error occurred during update.");
          },
        });
      });
  }

  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(event: MouseEvent, data: any) {
    this.getRecord(data);
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
  } 
}
