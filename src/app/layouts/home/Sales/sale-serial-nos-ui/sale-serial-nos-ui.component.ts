import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef,MatDialogConfig,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { ItemsService } from 'src/app/services/Files/items.service';
import { SerialNosService } from 'src/app/services/Inventory/serial-nos.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaleSerialNosService } from 'src/app/services/Sales/sale-serial-nos.service';
import { SalesTransactionService } from 'src/app/services/Sales/sales-transaction.service';

@Component({
  selector: 'app-sale-serial-nos-ui',
  templateUrl: './sale-serial-nos-ui.component.html',
  styleUrls: ['./sale-serial-nos-ui.component.css']
})
export class SaleSerialNosUIComponent implements OnInit {

  sDetail         : any=[];
  sDetailSerialNo : any=[];
  ui              : string;
  loading         : boolean = false;
  type            : string; 
  serialNos       : any;
  fserialNos      : any;
  saleSerialNos   : any=[];
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
  defaultColumns  = ['SerialNo','Warranty'];
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
    private dialogRef                   : MatDialogRef<SaleSerialNosUIComponent>,
    private salesTransactionService     : SalesTransactionService,
    private serialNosService            : SerialNosService,
    private saleSerialNosService        : SaleSerialNosService,
    private notif                       : NotificationService,
    public matTableService : MatTableService, 
    private dateTimesService : DateTimesService, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    if (this.data) {
      this.sDetail = this.data[0];
      this.ui = this.data[1];
      this.sDetailSerialNo = this.data[2];
    }
    if(this.sDetailSerialNo){
      this.btnText = 'Update';
      this.toolButtons[0].Label = 'Update';

      this.searchKey = this.sDetailSerialNo.SerialNo;
      this.warrantyDate = this.dateTimesService.ConvertToDateFormat(new Date(this.sDetailSerialNo.Warranty2)) ;
      this.withDate = this.sDetailSerialNo.Warranty.toLowerCase() != 'na';
    }
    await this.getSaleSerialNos();
    this.loadSerialNosByItemId();
    this.saleSerialNosService.requiredRefresh.subscribe(()=>{
      this.getSaleSerialNos();
    });
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  async getSaleSerialNos(){
    this.loading = true;
    this.saleSerialNos = await firstValueFrom(this.saleSerialNosService.getSaleSerialNosBySDetailId(this.sDetail.id)) ;
    if(this.saleSerialNos)
      this.loading = false;
    this.displayRecords();
    
    
    this.displayed = true;
  }

  async loadSerialNosByItemId(){
    this.serialNos = await firstValueFrom(this.serialNosService.loadSerialNosByItemId(this.sDetail.ItemId));
  }

  displayRecords(){
    var data = this.saleSerialNos;
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
    dialogConfig.data         = ([this.sDetail, 'salestransaction', this.selectedData]);
    this.dialog.open(SaleSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.getSaleSerialNos();
    });
  }
  onClickDelete(){
     if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
        this.saleSerialNosService.deleteSaleSerialNo(this.selectedId).subscribe({
            next:(res)=>{
              this.notif.toastrSuccess(res.message);
              this.loadSerialNosByItemId();
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
       var s:any = await firstValueFrom(this.serialNosService.getSerialNosByItemIdBySerialNo(this.sDetail.ItemId, this.searchKey)); 
        if(s == null){
          // popup notification to add here
          this.notif.popupWarning("SerialNo Not Found","SerialNo " + this.searchKey + " does not Exist. Add?").then((result) => {
          if (result.value) {
              var data:any = {
                'stock' : this.sDetail, 
                'serialNo' : this.searchKey, 
                'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
                'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
              };
              this.serialNosService.saveSerialNos(data).subscribe({
                next:(res)=>{
                  var data2:any = {
                    'sDetail' : this.sDetail, 
                    'sId'     : res.newSerial.id, 
                    'serialNo' : this.searchKey, 
                    'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
                    'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
                  };
                  this.saleSerialNosService.saveSaleSerialNos(data2).subscribe({
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
          'sDetail' : this.sDetail, 
          'sId'     : s.id, 
          'serialNo' : this.searchKey, 
          // 'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
          // 'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
          'warrantyDate' : s.WarrantyDate,
          'warrantyDate2' :s.WarrantyDate2,
        };
        this.saleSerialNosService.saveSaleSerialNos(data).subscribe({
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
          'sDetail' : this.sDetail, 
          'sId'     : this.sDetailSerialNo.id, 
          'serialNo' : this.searchKey, 
          'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
          'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
        };
        this.saleSerialNosService.saveSaleSerialNos(data).subscribe({
          next:(res)=>{
            this.notif.toastrSuccess(res.message);
            this.dialogRef.close(this.sDetail);
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
            if (this.saleSerialNos.length == this.sDetail.Qty){
                this.notif.toastrInfo("SerialNo Count is Equal to Qty.");
                this.dialogRef.close(this.sDetail);
            }else{
                this.notif.popupWarning("SerialNo Count Is Not Equal To SalesQty","Adjust SalesQty?").then((result) => {
                  if (result.value) {
                        var newQty = +this.saleSerialNos.length;
                        this.sDetail.Qty = +this.saleSerialNos.length;
                          this.salesTransactionService.updateElementSaleDetail(this.sDetail.id, 'Qty', newQty).subscribe({
                          next: (res) => {
                            this.notif.toastrSuccess(res.message);
                            this.dialogRef.close(this.sDetail);
                          },
                          error: (err) => {
                            this.notif.toastrError(err.error.message);
                          }
                        });
                  }else{
                    this.dialogRef.close(this.sDetail);
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
     if(this.saleSerialNos.length > 0)
      this.checkQty();
    else
      this.dialogRef.close(this.sDetail);
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
