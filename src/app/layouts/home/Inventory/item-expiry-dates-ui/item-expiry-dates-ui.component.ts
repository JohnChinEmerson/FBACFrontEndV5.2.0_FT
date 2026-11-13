import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ItemExpiryDateUIComponent } from '../item-expiry-date-ui/item-expiry-date-ui.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ExpiryDatesService } from 'src/app/services/Inventory/expiry-dates.service';
import { firstValueFrom } from 'rxjs';
import { StringHelperService } from 'src/app/services/string-helper.service';

@Component({
  selector: 'app-item-expiry-dates-ui',
  templateUrl: './item-expiry-dates-ui.component.html',
  styleUrls: ['./item-expiry-dates-ui.component.css']
})
export class ItemExpiryDatesUIComponent implements OnInit {

    btnText           : string = "Save";
    text              : string;
    itemExpiryDates   : any;
    stock             : any;
    filters           : any=['Positive', 'Negative', 'Zero', 'All'];
    filter            : any = 'Positive';
    selectedData      : any;
    searchKey         : string = "";
    selectedId        : number = 0;
    loading           : boolean = false;
    pageSizeOptions   : number[] = this.matTableService.pageSizeOptions();
    listData          : MatTableDataSource<any>;
    isLoading         : boolean = false;
    ui              : string;
    @ViewChild(MatSort) sort              : MatSort;
    @ViewChild(MatPaginator) paginator    : MatPaginator;
    @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  
    contextMenuPosition = { x: '0px', y: '0px' };
    toolButtons     = [
      {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
      {'Label'   : 'New','Function'             : () => this.onClickNew(),'Disabled': true,}, 
    ];
    contextButtons = [
      { 'Label': 'Edit', 'Function'           : () => this.onClickEdit(), 'Disabled': true },
      { 'Label': 'Delete', 'Function'           : () => this.onClickDelete(), 'Disabled': true },
    ];
  
    dateColumns  = ['ExpiryDate2'];
    defaultColumns  = ['Qty', 'BatchLotNo'];
    mergeColumns    = this.dateColumns.concat(this.defaultColumns);

    constructor(
      private dialog                      : MatDialog,
      private dialogRef                      : MatDialogRef<ItemExpiryDatesUIComponent>,
      private itemExpiryDatesService   : ExpiryDatesService,
      private notif                 : NotificationService,
      public matTableService       : MatTableService,
      private stringHelperService       : StringHelperService,
      @Inject(MAT_DIALOG_DATA) public data: any,
  
    ) { }
  
    async ngOnInit(): Promise<void> {
      if (this.data) {
        this.stock = this.data[0];
        this.ui = this.data[1];
        this.text   = this.stock.ItemName.toUpperCase();
        this.onClickView();
      }
    }
  
    async onClickView(){
     this.isLoading = true;
        this.itemExpiryDates = await firstValueFrom(this.itemExpiryDatesService.getExpiryDatesByItemIdByFilter(this.stock.ItemId,this.filter));
        if(this.ui == 'transaction'){
          this.itemExpiryDates.push(this.stringHelperService.withNAExpiryDateCBO());
            // if (ui != null || ui2 != null || ui3 != null)
        //     eDates.Add(new EDates { Id = 0, ExpiryDate = "NA", Qty = 0, BatchLotNo = "NA" });
        }

        if(this.itemExpiryDates)
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
      var data = this.itemExpiryDates;
      this.listData = new MatTableDataSource(data);
      this.listData.paginator = this.paginator;
      this.listData.sort = this.sort;
    }

    onClickEdit(){
      if (!this.matTableService.checkNull(this.selectedId)) return;

      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '600px';
      dialogConfig.data        = [this.selectedData, this.stock];
      this.dialog.open(ItemExpiryDateUIComponent,dialogConfig).beforeClosed().subscribe(x=>{
        this.onClickView();
      });
    }
  
    onClickDelete(){
      if (!this.matTableService.checkNull(this.selectedId)) return;
     
      this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
        if (result.value) {
            this.itemExpiryDatesService.deleteExpiryDate(this.selectedId).subscribe({
                next:(res)=>{
                  this.notif.toastrSuccess(res.message);
                  this.onClickView();
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
      dialogConfig.data        = ['', this.stock];
      this.dialog.open(ItemExpiryDateUIComponent,dialogConfig).beforeClosed().subscribe(x=>{
        this.onClickView();
      });
    }

    getRecord(data : any){
      this.selectedId = data.id;
      this.selectedData = data;
    }
  
    onClose(){
      this.dialogRef.close();
    }

    onDBLClick(data){
      if(this.ui == 'transaction'){
        this.dialogRef.close(data);
      }
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
