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
import { OutSerialNosService } from 'src/app/services/StockAdjustments/out-serial-nos.service';
import { StockAdjustmentTransactionService } from 'src/app/services/StockAdjustments/stock-adjustment-transaction.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-out-serial-nos-ui',
  templateUrl: './out-serial-nos-ui.component.html',
  styleUrls: ['./out-serial-nos-ui.component.css']
})
export class OutSerialNosUIComponent implements OnInit {

  outDetail         : any=[];
  outDetailSerialNo : any=[];
  ui              : string;
  loading         : boolean = false;
  type            : string; 
  serialNos       : any;
  fserialNos      : any;
  outSerialNos   : any=[];
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
  defaultColumns  = ['SerialNo','StockOutWarranty'];
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
    private dialogRef                   : MatDialogRef<OutSerialNosUIComponent>,
    private stockAdjustmentTransactionService     : StockAdjustmentTransactionService,
    private serialNosService            : SerialNosService,
    private outSerialNosService        : OutSerialNosService,
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
     this.toolBoxService.disableButtons(this.toolButtons,null, this.contextButtons, null);
    if (this.data) {
      this.outDetail = this.data[0];
      this.ui = this.data[1];
      this.outDetailSerialNo = this.data[2];
    }
    if(this.outDetailSerialNo){
      this.btnText = 'Update';
      this.toolButtons[0].Label = 'Update';

      this.searchKey = this.outDetailSerialNo.SerialNo;
      this.warrantyDate = this.dateTimesService.ConvertToDateFormat(new Date(this.outDetailSerialNo.StockOutWarranty2)) ;
      this.withDate = this.outDetailSerialNo.StockOutWarranty.toLowerCase() != 'na';
    }
    await this.getOutSerialNos();
    this.loadSerialNosByItemId();
    this.outSerialNosService.requiredRefresh.subscribe(()=>{
      this.getOutSerialNos();
    });
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getOutSerialNos(){
    this.loading = true;
    this.outSerialNos = await firstValueFrom(this.outSerialNosService.getOutSerialNosByOutDetailId(this.outDetail.id)) ;
    if(this.outSerialNos)
      this.loading = false;
    this.displayRecords();
    
    
    this.displayed = true;
  }

  async loadSerialNosByItemId(){
    this.serialNos = await firstValueFrom(this.serialNosService.loadSerialNosByItemId(this.outDetail.ItemId));
  }

  displayRecords(){
    var data = this.outSerialNos;
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
    dialogConfig.data         = ([this.outDetail, 'outstransaction', this.selectedData]);
    this.dialog.open(OutSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.getOutSerialNos();
    });
  }
  onClickDelete(){
     if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
        this.outSerialNosService.deleteOutSerialNo(this.selectedId).subscribe({
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
      return this.notif.toastrWarning("No Record Selected.");
    if(this.btnText.toLowerCase() == 'add'){
       var s:any = await firstValueFrom(this.serialNosService.getSerialNosByItemIdBySerialNo(this.outDetail.ItemId, this.searchKey)); 
        if(s == null){
          // popup notification to add here
          this.notif.popupWarning("SerialNo Not Found","SerialNo " + this.searchKey + " does not Exist. Add?").then((result) => {
          if (result.value) {
              var data:any = {
                'stock' : this.outDetail, 
                'serialNo' : this.searchKey, 
                'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
                'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
              };
              this.serialNosService.saveSerialNos(data).subscribe({
                next:(res)=>{
                  var data2:any = {
                    'outDetail' : this.outDetail, 
                    'sId'     : res.newSerial.id, 
                    'serialNo' : this.searchKey, 
                    'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
                    'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
                  };
                  this.outSerialNosService.saveOutSerialNos(data2).subscribe({
                    next:(res)=>{
                      this.notif.toastrSuccess(res.message);
                      this.loadSerialNosByItemId();
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
        });
        }else{
            if (s.RecordStatus.toLowerCase() != "open")
            {
                return this.notif.toastrWarning("RecordStatus is " + s.RecordStatus);
            }
        }

        var data:any = {
          'outDetail' : this.outDetail, 
          'sId'     : s.id, 
          'serialNo' : this.searchKey, 
          'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
          'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
        };
        this.outSerialNosService.saveOutSerialNos(data).subscribe({
          next:(res)=>{
            this.notif.toastrSuccess(res.message);
            this.loadSerialNosByItemId();
            this.resetForm();
          },
          error:(err)=> {
            this.notif.toastrError(err.error.message);
          },
        });
    }
    else{
      var data:any = {
          'outDetail' : this.outDetail, 
          'sId'     : this.outDetailSerialNo.id, 
          'serialNo' : this.searchKey, 
          'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
          'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
        };
        this.outSerialNosService.saveOutSerialNos(data).subscribe({
          next:(res)=>{
            this.notif.toastrSuccess(res.message);
            this.dialogRef.close(this.outDetail);
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
            if (this.outSerialNos.length == this.outDetail.Qty){
                this.notif.toastrInfo("SerialNo Count is Equal to Qty.");
                this.dialogRef.close(this.outDetail);
            }else{
                this.notif.popupWarning("SerialNo Count Is Not Equal To StockOutQty","Adjust StockOutQty?").then((result) => {
                  if (result.value) {
                        var newQty = +this.outSerialNos.length;
                        this.outDetail.Qty = +this.outSerialNos.length;
                          this.stockAdjustmentTransactionService.updateElementStockAdjustmentDetail(this.outDetail.id, 'Qty', newQty).subscribe({
                          next: (res) => {
                            this.notif.toastrSuccess(res.message);
                            this.dialogRef.close(this.outDetail);
                          },
                          error: (err) => {
                            this.notif.toastrError(err.error.message);
                          }
                        });
                  }else{
                    this.dialogRef.close(this.outDetail);
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
     if(this.outSerialNos.length > 0)
      this.checkQty();
    else
      this.dialogRef.close(this.outDetail);
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
