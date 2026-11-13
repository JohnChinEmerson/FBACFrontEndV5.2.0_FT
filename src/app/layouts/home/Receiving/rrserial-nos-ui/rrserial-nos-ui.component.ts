import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
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
import { SerialNosUIComponent } from '../../Files/serial-nos-ui/serial-nos-ui.component';
import { ReceivingTransactionService } from 'src/app/services/Receiving/receiving-transaction.service';
import { RRSerialNosService } from 'src/app/services/Receiving/rrserial-nos.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-rrserial-nos-ui',
  templateUrl: './rrserial-nos-ui.component.html',
  styleUrls: ['./rrserial-nos-ui.component.css']
})
export class RRSerialNosUIComponent implements OnInit {

  rRDetail         : any=[];
  rRDetailSerialNo : any=[];
  ui              : string;
  loading         : boolean = false;
  type            : string; 
  rRSerialNos     : any=[];
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
  defaultColumns  = ['SerialNo','WarrantyDate'];
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
    private dialogRef                   : MatDialogRef<RRSerialNosUIComponent>,
    private receivingTransactionService     : ReceivingTransactionService,
    private serialNosService            : SerialNosService,
    private rRSerialNosService        : RRSerialNosService,
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
      this.rRDetail = this.data[0];
      this.ui = this.data[1];
      this.rRDetailSerialNo = this.data[2];
    }
    if(this.rRDetailSerialNo){
      this.btnText = 'Update';
      this.toolButtons[0].Label = 'Update';

      this.searchKey = this.rRDetailSerialNo.SerialNo;
      this.warrantyDate = this.dateTimesService.ConvertToDateFormat(new Date(this.rRDetailSerialNo.WarrantyDate2)) ;
      this.withDate = this.rRDetailSerialNo.WarrantyDate.toLowerCase() != 'na';
    }
    await this.getRRSerialNos();
    this.rRSerialNosService.requiredRefresh.subscribe(()=>{
      this.getRRSerialNos();
    });
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  async getRRSerialNos(){
    this.loading = true;
    this.rRSerialNos = await firstValueFrom(this.rRSerialNosService.getRRSerialNosByRRDetailId(this.rRDetail.id)) ;
    if(this.rRSerialNos)
      this.loading = false;
    this.displayRecords();
    
    
    this.displayed = true;
  }


  displayRecords(){
    var data = this.rRSerialNos;
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
    dialogConfig.data         = ([this.rRDetail, 'receivingtransaction', this.selectedData]);
    this.dialog.open(RRSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.getRRSerialNos();
    });
  }
  onClickDelete(){
     if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
        this.rRSerialNosService.deleteRRSerialNo(this.selectedId).subscribe({
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
          'stock' : this.rRDetail, 
          'serialNo' : this.searchKey, 
          'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
          'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
        };
        this.serialNosService.saveSerialNos(data).subscribe({
          next:(res)=>{
            var data2:any = {
              'rRDetail' : this.rRDetail, 
              'sId'     : res.newSerial.id, 
              'serialNo' : this.searchKey, 
              'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
              'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
            };
            this.rRSerialNosService.saveRRSerialNos(data2).subscribe({
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
          'rRDetail' : this.rRDetail, 
          'sId'     : this.rRDetailSerialNo.id, 
          'serialNo' : this.searchKey, 
          'warrantyDate' : this.withDate ?  this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)) : 'NA',
          'warrantyDate2' : this.dateTimesService.ConvertToDateFormat(new Date( this.warrantyDate)),
        };
        this.rRSerialNosService.saveRRSerialNos(data).subscribe({
          next:(res)=>{
            this.notif.toastrSuccess(res.message);
            this.dialogRef.close(this.rRDetail);
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
            if (this.rRSerialNos.length == this.rRDetail.Qty){
                this.notif.toastrInfo("SerialNo Count is Equal to Qty.");
                this.dialogRef.close(this.rRDetail);
            }else{
                this.notif.popupWarning("SerialNo Count Is Not Equal To ReceivedQty","Adjust ReceivedQty?").then((result) => {
                  if (result.value) {
                        var newQty = +this.rRSerialNos.length;
                        this.rRDetail.Qty = +this.rRSerialNos.length;
                          this.receivingTransactionService.updateElementReceivingDetail(this.rRDetail.id, 'Qty', newQty).subscribe({
                          next: (res) => {
                            this.notif.toastrSuccess(res.message);
                            this.dialogRef.close(this.rRDetail);
                          },
                          error: (err) => {
                            this.notif.toastrError(err.error.message);
                          }
                        });
                  }else{
                    this.dialogRef.close(this.rRDetail);
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
    if(this.rRSerialNos.length > 0)
      this.checkQty();
    else
      this.dialogRef.close(this.rRDetail);
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
