import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { SerialNosService } from 'src/app/services/Inventory/serial-nos.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { InSerialNosService } from 'src/app/services/StockAdjustments/in-serial-nos.service';
import { StockAdjustmentTransactionService } from 'src/app/services/StockAdjustments/stock-adjustment-transaction.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-in-serial-nos-ui',
  templateUrl: './in-serial-nos-ui.component.html',
  styleUrls: ['./in-serial-nos-ui.component.css']
})
export class InSerialNosUIComponent implements OnInit {

  iNDetail         : any=[];
  iNDetailSerialNo : any=[];
  ui              : string;
  loading         : boolean = false;
  type            : string; 
  iNSerialNos     : any=[];
  warrantyDate    : any = new Date();
  withDate        : boolean = false;
  displayed       : boolean = false;
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions : any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  btnText : string = 'Add';
  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : this.btnText,'Function'  : () => this.onClickAdd(),'Disabled': true,}, 
  ];  
  contextButtons  =  [
    {'Label'   : 'Edit','Function'          : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Delete','Function'          : () => this.onClickDelete(),'Disabled': true,}, 
  ];
  defaultColumns  = ['SerialNo','StockInWarranty'];
  columnConfig: ColumnTypeConfig = {
      decimalColumns: [],
      intColumns: [],
      dateTimeColumns: [],
      dateColumns: []
    };
  columnTypeMap: { [key: string]: string } = {};
  displaySerialNos = (value: string): string => value || '';
  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<InSerialNosUIComponent>,
    private stockAdjustmentTransactionService     : StockAdjustmentTransactionService,
    private serialNosService            : SerialNosService,
    private iNSerialNosService        : InSerialNosService,
    private notif                       : NotificationService,
    public matTableService : MatTableService, 
    private dateTimesService : DateTimesService, 
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
     await this.homeTs.getButtons();
     this.toolBoxService.disableButtons(this.toolButtons, null, this.contextButtons, null);
    if (this.data) {
      this.iNDetail = this.data[0];
      this.ui = this.data[1];
      this.iNDetailSerialNo = this.data[2];
    }
    if(this.iNDetailSerialNo){
      this.btnText = 'Update';
      this.toolButtons[0].Label = 'Update';

      this.searchKey = this.iNDetailSerialNo.SerialNo;
      this.warrantyDate = this.dateTimesService.ConvertToDateFormat(new Date(this.iNDetailSerialNo.StockInWarranty2)) ;
      this.withDate = this.iNDetailSerialNo.StockInWarrantyDate.toLowerCase() != 'na';
    }
    await this.getInSerialNos();
    this.iNSerialNosService.requiredRefresh.subscribe(()=>{
      this.getInSerialNos();
    });
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getInSerialNos(){
    this.loading = true;
    this.iNSerialNos = await firstValueFrom(this.iNSerialNosService.getInSerialNosByInDetailId(this.iNDetail.id)) ;
    if(this.iNSerialNos)
      this.loading = false;
    this.displayRecords();
    
    
    this.displayed = true;
  }


  displayRecords(){
    var data = this.iNSerialNos;
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

  onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([this.iNDetail, 'stockadjustmenttransaction', this.selectedData]);
    this.dialog.open(InSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.getInSerialNos();
    });
  }
  onClickDelete(){
     if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
        this.iNSerialNosService.deleteInSerialNo(this.selectedId).subscribe({
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
 
  async onClickAdd(){
    if (!this.searchKey || this.searchKey == "" ) 
      return this.notif.toastrWarning("Please Input SerialNo.");

    if(this.btnText.toLowerCase() == 'add'){
        var data:any = {
          'stock' : this.iNDetail, 
          'serialNo' : this.searchKey, 
          'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
          'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
        };
        this.serialNosService.saveSerialNos(data).subscribe({
          next:(res)=>{
            var data2:any = {
              'iNDetail' : this.iNDetail, 
              'sId'     : res.newSerial.id, 
              'serialNo' : this.searchKey, 
              'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
              'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
            };
            this.iNSerialNosService.saveInSerialNos(data2).subscribe({
              next:(res)=>{
                this.notif.toastrSuccess(res.message);
                this.resetForm();
              },
              error:(err)=> {
                this.notif.toastrError(err.error.message);
              },
            });
          },
          error:(err)=> {
            this.notif.toastrError(err.error.message);
          },
        });
    }
    else{
      var data:any = {
          'iNDetail' : this.iNDetail, 
          'sId'     : this.iNDetailSerialNo.id, 
          'serialNo' : this.searchKey, 
          'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
          'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
        };
        this.iNSerialNosService.saveInSerialNos(data).subscribe({
          next:(res)=>{
            this.notif.toastrSuccess(res.message);
            this.dialogRef.close(this.iNDetail);
          },
          error:(err)=> {
            this.notif.toastrError(err.error.message);
          },
        });
    }
   
  }

  checkQty(){
    if(this.btnText.toLowerCase() == 'add'){
      //  setTimeout(() => {
            if (this.iNSerialNos.length == this.iNDetail.Qty){
                this.notif.toastrInfo("SerialNo Count is Equal to Qty.");
                this.dialogRef.close(this.iNDetail);
            }else{
                this.notif.popupWarning("SerialNo Count Is Not Equal To StockInQty","Adjust StockInQty?").then((result) => {
                  if (result.value) {
                        var newQty = +this.iNSerialNos.length;
                        this.iNDetail.Qty = +this.iNSerialNos.length;
                          this.stockAdjustmentTransactionService.updateElementStockAdjustmentDetail(this.iNDetail.id, 'Qty', newQty).subscribe({
                          next: (res) => {
                            this.notif.toastrSuccess(res.message);
                            this.dialogRef.close(this.iNDetail);
                          },
                          error: (err) => {
                            this.notif.toastrError(err.error.message);
                          }
                        });
                  }else{
                    this.dialogRef.close(this.iNDetail);
                  }
                });
            }
      // }, 2000);
    }
  }

  resetForm(){
    this.searchKey = '';
  }

  onClose(){
    if(this.iNSerialNos.length > 0)
      this.checkQty();
    else
      this.dialogRef.close(this.iNDetail);
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
