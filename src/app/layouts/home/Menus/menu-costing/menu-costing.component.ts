import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MenuCostingService } from 'src/app/services/Menus/menu-costing.service';
import { MatTableService } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { ComponentsUIComponent } from '../components-ui/components-ui.component';

// Desktop Mariosoft.Costing.UI RecipeCostingUI ("Menu Costing")
@Component({
  selector: 'app-menu-costing',
  templateUrl: './menu-costing.component.html',
  styleUrls: ['../menus-shared.css']
})
export class MenuCostingComponent implements OnInit {
  items             : any[] = [];
  itemTypes         : string[] = ['All'];
  itemType          : string = 'All';
  selectedData      : any;
  searchKey         : string = "";
  selectedId        : string = '';
  pageSizeOptions   : any = this.matTableService.pageSizeOptions();
  listData          : MatTableDataSource<any>;
  isLoading         : boolean = false;

  @ViewChild(MatSort) sort                : MatSort;
  @ViewChild(MatPaginator) paginator      : MatPaginator;
  @ViewChild(MatMenuTrigger) contextMenu  : MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons       = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true},
    {'Label'   : 'Components','Function'      : () => this.onClickComponents(),'Disabled': true},
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true},
  ];
  contextButtons    = [
    {'Label'   : 'Components','Function'      : () => this.onClickComponents(),'Disabled': true},
  ];
  defaultColumns    = ['ItemName','ItemType','Category','UM','Cost','Price','Margin'];

  constructor(
    private dialog              : MatDialog,
    private menuCostingService  : MenuCostingService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private router              : Router,
    private printService        : PrintService,
    public matTableService      : MatTableService,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    var itemTypes: any = await firstValueFrom(this.menuCostingService.getItemTypesForCosting());
    this.itemTypes = ['All', ...itemTypes];
    this.menuCostingService.requiredRefresh.subscribe(() => {
      this.onClickView();
    });
    this.onClickView();
  }

  async onClickView(){
    this.isLoading = true;
    try {
      this.items = await firstValueFrom(this.menuCostingService.getItemsForCosting(this.itemType));
    } finally {
      this.isLoading = false;
    }
    this.items.forEach(x => x.Margin = (+x.Price) - (+x.Cost));
    this.listData = new MatTableDataSource(this.items);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
    this.applyFilter();
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey = this.matTableService.clearSearch(this.listData);
  }

  getRecord(data : any){
    this.selectedId = data.ItemId;
    this.selectedData = data;
  }

  // Desktop RecipeCostingUI.dtg_CellEndEdit: only Price can be edited on this list
  updatePrice(event: any, row: any){
    var price = parseFloat(String(event.target.value).replace(/,/g, ''));
    if (isNaN(price) || price < 0) {
      event.target.value = (+row.Price).toFixed(2);
      return this.notificationService.toastrWarning('Invalid Price.');
    }
    this.menuCostingService.updateMenuPrice(row.ItemId, price).subscribe({
      next:(res) => {
        row.Price = price;
        row.Margin = price - (+row.Cost);
        this.notificationService.toastrSuccess(res.message);
      },
      error:(err) => {
        this.notificationService.toastrError(err.error.message);
      }
    });
  }

  onClickComponents(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = false;
    dialogConfig.width        = '1200px';
    dialogConfig.maxWidth     = '98vw';
    dialogConfig.data         = ([this.selectedData]);
    this.dialog.open(ComponentsUIComponent, dialogConfig);
  }

  onClickPrint(){
    var url = this.router.serializeUrl(this.router.createUrlTree(['print/printdatalist']));
    localStorage.setItem('PrintDataList', JSON.stringify({
      'Title'   : 'MENU COSTING' + (this.itemType != 'All' ? ' - ' + this.itemType.toUpperCase() : ''),
      'Columns' : [
        { 'Key': 'ItemName', 'Label': 'ItemName' },
        { 'Key': 'ItemType', 'Label': 'ItemType' },
        { 'Key': 'Category', 'Label': 'Category' },
        { 'Key': 'UM', 'Label': 'UM' },
        { 'Key': 'Cost', 'Label': 'Cost', 'Type': 'decimal' },
        { 'Key': 'Price', 'Label': 'Price', 'Type': 'decimal' },
        { 'Key': 'Margin', 'Label': 'Margin', 'Type': 'decimal' },
      ],
      'Data'    : this.listData?.filteredData || [],
    }));
    this.printService.popupWindow(url, 'MenuCosting', window, 900, 800);
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
