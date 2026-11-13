import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { ItemPriceCategorysService } from 'src/app/services/Files/item-price-categorys.service';
import { PriceCategorysService } from 'src/app/services/Files/price-categorys.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PriceCategoryUIComponent } from '../price-category-ui/price-category-ui.component';
import { NumbersService } from 'src/app/services/numbers.service';
import { MultipleUMsService } from 'src/app/services/Files/multiple-ums.service';

@Component({
  selector: 'app-item-price-categorys-ui',
  templateUrl: './item-price-categorys-ui.component.html',
  styleUrls: ['./item-price-categorys-ui.component.css']
})
export class ItemPriceCategorysUIComponent implements OnInit {

  btnText           : string = "Save";
  itemPriceCategorys      : any;
  priceCategorys      : any;
  item      : any;
  selectedData      : any;
  searchKey         : string = "";
  selectedId        : number = 0;
  loading           : boolean = false;
  pageSizeOptions   : number[] = this.matTableService.pageSizeOptions();
  listData          : MatTableDataSource<any>;
  isLoading         : boolean = false;
  type              : string;
  lblCost            : string;
  lblAveCost            : string;
  text            : string;
  unitMeasures                   : any=[];
  UM : string;
  price : number = 0;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  contextButtons = [
    { 'Label': 'Delete', 'Function'           : () => this.onClickDelete(), 'Disabled': true },
  ];

  defaultColumns  = ['PriceCategory','Price', 'MinimumQty'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Price', 'MinimumQty'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog                      : MatDialog,
    private dialogRef                      : MatDialogRef<ItemPriceCategorysUIComponent>,
    private priceCategorysService       : PriceCategorysService,
    private itemPriceCategorysService   : ItemPriceCategorysService,
    private notif                 : NotificationService,
    private numbersService                 : NumbersService,
    public matTableService       : MatTableService,
    private multipleUMsService    : MultipleUMsService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    if (this.data) {
      this.item = this.data[0];
      this.type = this.data[1];
      this.UM = this.data[2];

      this.price = this.item.Price;
      
      await this.getMultipleUMs();
      if(this.UM != this.item.UM){
        var x = this.unitMeasures.find(x => x.UM == this.UM);
        this.onChangeUM(x);
      }
      this.getPriceCategorys();
    }
    this.text   = this.item.ItemName.toUpperCase();
    this.lblCost = "Cost : " + this.numbersService.Convert2Decimal(this.item.Cost);
    this.lblAveCost = "AveCost : " + this.numbersService.Convert2Decimal(this.item.AveCost);
    this.priceCategorysService.requiredRefresh.subscribe(()=>{
      this.getPriceCategorys();
    });

    this.itemPriceCategorysService.requiredRefresh.subscribe(()=>{
      this.getPriceCategorys();
    });
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getMultipleUMs(){
    this.unitMeasures = await firstValueFrom(this.multipleUMsService.loadMultipleUMsByItemId(this.item.ItemId));
  }
  async onChangeUM(data){
    this.price = data.Price;
    this.lblCost = "Cost : " + this.numbersService.Convert2Decimal(data.Cost);
    this.lblAveCost = "AveCost : " + this.numbersService.Convert2Decimal(data.AveCost);
    this.UM = data.UM;
    await this.getPriceCategorys();
  }


  async getPriceCategorys() {
    this.priceCategorys = await firstValueFrom(this.priceCategorysService.getPriceCategorys());

    const results: any[] = [];
    for (const x of this.priceCategorys) {
      x.Price = 0;
      x.MinimumQty = 0;

      const iPC = await firstValueFrom(
        this.itemPriceCategorysService.getItemPriceCategoryByPriceCategoryByItemIdByUM(
          x.PriceCategoryId,
          this.item.ItemId,
          this.UM
        )
      );

    if (iPC) {
      x.Price = iPC.Price;
      x.MinimumQty = iPC.MinimumQty ?? 0;
      x.ItemPriceCategoryId = iPC.ItemPriceCategoryId;
      results.push(x);
      } else {
        // remove if type is sales or order
        if (this.type !== 'sales' && this.type !== 'order') {
          results.push(x); // keep if not sales/order
        }
      }
    }

    this.priceCategorys = results;

    if (this.type === 'sales' || this.type === 'order') {
      const regPrice: any = {
        ItemPriceCategoryId: 'NA',
        PriceCategoryId: 'NA',
        PriceCategory: 'Regular Price',
        ItemId: this.item.ItemId,
        ItemName: this.item.ItemName,
        UM: this.UM,
        Price: this.price,
        MinimumQty: 0,
      };
      this.priceCategorys.push(regPrice);
    }

    this.displayRecords();
  }

  
  applyFilter() {
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch() {
    this.searchKey = this.matTableService.clearSearch(this.listData);
  }

  displayRecords() {
    this.listData = new MatTableDataSource(this.priceCategorys);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  onClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
   
    if (this.type === 'sales' || this.type === 'order')
      return this.notif.toastrWarning("Action Not Allowed.");

    
    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
          this.itemPriceCategorysService.deleteItemPriceCategory(this.selectedData.ItemPriceCategoryId).subscribe({
              next:(res)=>{
                this.notif.toastrSuccess(res.message);
                this.getPriceCategorys();
              },
              error:(err)=>{
                this.notif.toastrError(err.error);
              },
          });
      }
    });
  }

  onClickNew(){
      if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    this.dialog.open(PriceCategoryUIComponent,dialogConfig);
  }

  onKeyupEditPrice(event: any, id) {
    var pC = this.priceCategorys.filter(x => x.id == id);
    pC = pC[0];
    pC.Price = Number(event.target.value.replace(/,/g, ''));
  }

  onKeyupEditMinimumQty(event: any, id) {
    var pC = this.priceCategorys.filter(x => x.id == id);
    pC = pC[0];
    pC.MinimumQty = Number(event.target.value.replace(/,/g, ''));
  }

  onClickSaveItemPriceCategorys(){
    this.notif.popupWarning("Save Record","Are you sure to save this record?").then((result) => {
      if (result.value) {
        this.itemPriceCategorysService.saveItemPriceCategorysByPriceCategoryIdByItemId(this.listData.filteredData, this.item.ItemId, this.UM).subscribe({
          next:(res)=>{
              this.notif.toastrSuccess(res.message);
              this.getPriceCategorys();
          },
          error:(err)=>{
            this.notif.toastrError(err.message);
          },
        })
      }
    });
  }

  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  onClickSelectPrice(){
    if(this.type == 'sales' || this.type == 'order'){
        this.dialogRef.close(this.selectedData);
    }
  }

  onClose(){
    this.dialogRef.close();
  }



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
