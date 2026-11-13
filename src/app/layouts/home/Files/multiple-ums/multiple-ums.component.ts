import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PriceCategoryUIComponent } from '../price-category-ui/price-category-ui.component';
import { MultipleUMsService } from 'src/app/services/Files/multiple-ums.service';
import { MultipleUMUIComponent } from '../multiple-umui/multiple-umui.component';

@Component({
  selector: 'app-multiple-ums',
  templateUrl: './multiple-ums.component.html',
  styleUrls: ['./multiple-ums.component.css']
})
export class MultipleUMsComponent implements OnInit {
  multipleUMs      : any;
  item              : any=[];
  selectedData      : any;
  searchKey         : string = "";
  selectedId        : number = 0;
  loading           : boolean = false;
  pageSizeOptions   : number[] = this.matTableService.pageSizeOptions();
  listData          : MatTableDataSource<any>;
  isLoading         : boolean = false;
  type              : string;
  itemPhysicalCounts : any=[];
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : 'New','Function'            : () => this.onClickNew(),'Disabled': true,}, 
  ];
  toolButtons2     = [
    {'Label'   : 'Save Count','Function'            : () => this.onClickSaveCount(),'Disabled': true,}, 
  ];
  contextButtons = [
    { 'Label': 'Edit', 'Function'           : () => this.onClickEdit(), 'Disabled': true },
    { 'Label': 'Delete', 'Function'           : () => this.onClickDelete(), 'Disabled': true },
  ];

  defaultColumns  = ['UM','Cost', 'AveCost','Price', 'Conversion','Available'];
  defaultColumns2 = ['UM','Price', 'Conversion','Available'];
  defaultColumns3 = ['UM','Cost', 'SystemCount', 'PhysicalCount'];

  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Cost', 'AveCost','Price', 'Conversion','Available','SystemCount', 'PhysicalCount'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  columnTypeMap2: { [key: string]: string } = {};
  columnTypeMap3: { [key: string]: string } = {};

  unitMeasures: any = [];
  constructor(
    private dialog                      : MatDialog,
    private dialogRef                      : MatDialogRef<MultipleUMsComponent>,
    private multipleUMsService   : MultipleUMsService,
    private notif                 : NotificationService,
    private numbersService                 : NumbersService,
    public matTableService       : MatTableService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.columnTypeMap2 = this.buildColumnTypeMap(this.defaultColumns2);
    this.columnTypeMap3 = this.buildColumnTypeMap(this.defaultColumns3);
    if (this.data) {
      this.item = this.data[0];
      this.type = this.data[1];
    }
    await this.onClickView();

    if(this.type.toLowerCase() == 'inventory'){
      this.toolButtons = [];
      this.toolButtons2 = [];
      this.contextButtons = [];
    }

    if(this.type.toLowerCase() == 'items'){
      this.toolButtons2 = [];
    }

    if(this.type.toLowerCase() == 'inventorystocks'){
      this.toolButtons = [];
    }

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
    this.isLoading = true;
    if(this.type.toLocaleLowerCase() != 'inventorystocks'){
      this.multipleUMs = await firstValueFrom(this.multipleUMsService.getMultipleUMsByItemId(this.item.ItemId));
    }
    if(this.type.toLocaleLowerCase() == 'inventorystocks'){
      this.multipleUMs = this.data[2];
      this.itemPhysicalCounts = this.data[3];
    }
    if(this.multipleUMs)
      this.isLoading = false;
    this.displayRecords();
  }
  
  applyFilter() {
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch() {
    this.searchKey = this.matTableService.clearSearch(this.listData);
  }

  displayRecords() {
    var data = this.multipleUMs;

    data.push(this.getBaseUM());
    data.sort((a, b) => b.Conversion - a.Conversion);
     var available = +this.item.Available;
     data.forEach(x => {
        const qty = Math.floor(available / x.Conversion);
          if (qty > 0)
              x.Available = qty;
          else
              x.Available = 0;
          available = +available - (qty * +x.Conversion);
     });

    if (this.type.toLocaleLowerCase() == 'inventorystocks'  && this.itemPhysicalCounts != null)
    {
      data.forEach(x => {
           const ipc = this.itemPhysicalCounts.find(y => y.UM.toLowerCase() === x.UM.toLowerCase());
            if (ipc != null)
              x.PhysicalCount = ipc.PhysicalCount;
            else
              x.PhysicalCount = null;

            x.SystemCount = x.Available;
      });
 
    }

    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  onClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
   
    if(this.selectedData.ConversionId == "0")
        return this.notif.toastrWarning("Cannot be Edited. "+this.selectedData.UM +" is a BaseUM");

    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
          this.multipleUMsService.deleteMultipleUM(this.selectedId).subscribe({
              next:(res)=>{
                this.notif.toastrSuccess(res.message);
              },
              error:(err)=>{
                this.notif.toastrError(err.error);
              },
          });
      }
    });
  }

  onClickSaveCount(){
    var totalQty = 0;
    this.multipleUMs.forEach(x => {
      if (x.PhysicalCount != null)
      {
        if (! this.numbersService.isNotNumeric(x.PhysicalCount.toString()))
        {
          var conversion = +x.Conversion;
          var qty = +x.PhysicalCount;
          var UM = x.UM;
          totalQty += (+qty * +conversion);

          var ItemPhysicalCounts:any = {
              ItemId        : this.item.ItemId, 
              UM            : UM, 
              PhysicalCount : qty, 
          };
          this.itemPhysicalCounts.push(ItemPhysicalCounts);
        }

      }
    });

    var data:any ={
      itemPhysicalCounts : this.itemPhysicalCounts,
      totalQty : totalQty,
    }
    this.dialogRef.close(data);
  }

  onClickNew(){
      if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = (['', this.item,'items']);
    this.dialog.open(MultipleUMUIComponent,dialogConfig);
  }

  onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    if(this.selectedData.ConversionId == "0")
        return this.notif.toastrWarning("Cannot be Edited. "+this.selectedData.UM +" is a BaseUM");

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = ([this.selectedData, this.item,'items']);
    this.dialog.open(MultipleUMUIComponent,dialogConfig);
  }

  getRecord(data : any){
    this.selectedId = data.ConversionId;
    this.selectedData = data;
  }

  getBaseUM()
  {
    var data:any= {
      ConversionId : "0",
      Conversion : 1,
      AveCost : this.item.AveCost,
      Cost : this.item.Cost,
      Available : 0,
      Price : this.item.Price,
      UM : this.item.UM,
    };
    return data;

  }

  onClose(){
    if(this.type.toLocaleLowerCase() == 'inventorystocks'){
      var data:any ={
        itemPhysicalCounts : this.itemPhysicalCounts,
        totalQty : null
      }
    this.dialogRef.close(data);
    }else{
      this.dialogRef.close();
    }
  }

  onContextMenu(event: MouseEvent, data: any) {
    this.getRecord(data);
    event.preventDefault();
    if(this.contextButtons.length > 0){
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  onEnterPhysicalCount(data, itemId,  event){
    this.getRecord(data);

    const physicalCount = event.target.value;
    if(event.target.value){
      if (this.numbersService.isNotNumeric(physicalCount))
        {
            return this.notif.toastrWarning('Value is not numeric.')
        }else{

          this.selectedData.PhysicalCount = physicalCount;
        }
    }
  }

  saveToTransaction(data){
    this.dialogRef.close(data);
  }


}
