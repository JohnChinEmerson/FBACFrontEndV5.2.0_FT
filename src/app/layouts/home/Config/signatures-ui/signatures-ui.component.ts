import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { SignaturesService } from 'src/app/services/Config/signatures.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { SignatureUIComponent } from '../signature-ui/signature-ui.component';

@Component({
  selector: 'app-signatures-ui',
  templateUrl: './signatures-ui.component.html',
  styleUrls: ['./signatures-ui.component.css']
})
export class SignaturesUIComponent implements OnInit {
  signatures : any=[];
  searchKey     : string = "";
  selectedId    :any;
  selectedData  : any;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  listData      : MatTableDataSource<any>;
  isLoading     : boolean = false;
  transTable      : any;
  transNo      : string;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'New','Function'           : () => this.onClickNew(),'Disabled': true,}, 
  ];
  contextButtons  =  [
    {'Label'   : 'Edit','Function'           : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Delete','Function'           : () => this.onClickDelete(),'Disabled': true,}, 

  ];
  defaultColumns  = ['SignLabel',  'SignName','SignPosition', 'SignLine'];

  
  columnConfig: ColumnTypeConfig = {
    decimalColumns: ['Sequence'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };
  columnTypeMap: { [key: string]: string } = {};


  constructor(
    private dialog          : MatDialog,
    private dialogRef         : MatDialogRef<SignaturesUIComponent>,
    private signaturesService    : SignaturesService,
    private notif                     : NotificationService,
    private toolBoxService            : ToolBoxService,
    public matTableService           : MatTableService,
    private notificationService : NotificationService, 
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    if(this.data){
      this.transNo = this.data[0];
      this.transTable = this.data[1];
    }
    this.onClickView();
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
   this.signatures = await firstValueFrom(this.signaturesService.getSignaturesByTransNoByTable(this.transNo, this.transTable));
    if(this.signatures)
      this.isLoading = false;
    this.displayRecords();
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  displayRecords(){
    var data      = this.signatures;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  getRecord(data : any){
    this.selectedId = data.TransId;
    this.selectedData = data;
  }


  async onClickNew(){
  if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus    = true;
       dialogConfig.width        = '600px';
       dialogConfig.data        = (['', 'signatures', this.signatures, this.transTable , this.transNo]);
       this.dialog.open(SignatureUIComponent,dialogConfig).beforeClosed().subscribe(signatures => {
         if(signatures){
           this.signatures = signatures;
           this.displayRecords();
         }else{
          this.onClickView();
         }
       });
  }

  async onClickEdit(){
    const dialogConfig        = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus    = true;
       dialogConfig.width        = '600px';
       dialogConfig.data        = ([this.selectedData, 'signatures', this.signatures, this.transTable , this.transNo]);
       this.dialog.open(SignatureUIComponent,dialogConfig).beforeClosed().subscribe(signature => {
         if(signature){
           this.signatures = this.signatures.map(detail =>
            detail.TransId === signature.TransId ? signature : detail
          );
          this.displayRecords();
         }else{
          this.onClickView();
         }
       });
  }

  onClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notificationService.popupWarning("Delete Signature","Are you sure to delete this signature?").then((result) => {
      if (result.value) {
        this.signaturesService.deleteSignature(this.selectedData.TransId, this.transNo, this.transTable).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.signatures = this.signatures.filter(x => x.TransId != this.selectedData.TransId);
              this.displayRecords();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  onClose(){
    this.dialogRef.close();
  }

  
  onContextMenu(event: MouseEvent, data: any) {
    if(this.contextButtons.length > 0){
      event.preventDefault();
      this.getRecord(data);
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { 'data': data };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }


}
