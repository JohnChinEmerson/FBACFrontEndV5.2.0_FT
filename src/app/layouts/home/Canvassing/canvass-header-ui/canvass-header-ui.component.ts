import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CanvassDetailsService } from 'src/app/services/Canvassing/canvass-details.service';
import { CanvassHeadersService } from 'src/app/services/Canvassing/canvass-headers.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PrintService } from 'src/app/services/print.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';
import { fitHeaderDialogToPhone } from '../../../shared/transaction-header/transaction-header';

@Component({
  selector: 'app-canvass-header-ui',
  templateUrl: './canvass-header-ui.component.html',
  styleUrls: ['../../../shared/transaction-header/transaction-header.css']
})
export class CanvassHeaderUIComponent implements OnInit {
  btnText : string = "Save";
  loading : boolean = false;
  canvassHeader: any=[];
  action:string;
  transCode:string;
  recordStatus:string;
  reason:any=[];
  canvassHeaderForm = new FormGroup({
        id          : new FormControl(''),
        TransNo     : new FormControl(''),
        TransCode   : new FormControl(''),
        TransDate   : new FormControl(new Date()),
        ReasonId    : new FormControl(''),
        ReasonName  : new FormControl(''),
        Remarks     : new FormControl('-'),
        ReferenceNo     : new FormControl('-'),
  });
  printReceipt: boolean = false;
  disablePrintReceipt: boolean = false;
  constructor(
    private dialogRef         : MatDialogRef<CanvassHeaderUIComponent>,
    private dialog                      : MatDialog,
    private canvassHeadersService  : CanvassHeadersService,
    private canvassDetailsService  : CanvassDetailsService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    private dateTimesService    : DateTimesService,
    private stringHelperService    : StringHelperService,
    private printService    : PrintService,
    private router    : Router,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  // phones: the less used fields are folded until MORE DETAILS
  showMore: boolean = false;

  async ngOnInit(): Promise<void> {
    // phones: the dialog takes the whole screen
    fitHeaderDialogToPhone(this.dialogRef);
    if (this.data) {
      this.reason = this.data[0];
      this.canvassHeader = this.data[1];
      this.transCode = this.data[2];
      this.action = this.data[3];
      if (this.action.toLowerCase() == 'savecanvasstransaction' ) {
        this.btnText = "Save";
        this.getcanvassHeaderForm1();
      }
      if (this.action.toLowerCase() == 'updatecanvassheader' ) {
        this.btnText = "Update";
        this.getcanvassHeaderForm2();
      }
    }
  }

  async getcanvassHeaderForm1(){
    this.canvassHeaderForm.controls['TransCode'].setValue(this.transCode);
    this.canvassHeaderForm.controls['ReasonId'].setValue(this.reason.ReasonId);
    this.canvassHeaderForm.controls['ReasonName'].setValue(this.reason.ReasonName);
  }

  async getcanvassHeaderForm2(){
    this.printReceipt = false;
    this.disablePrintReceipt = true;

    this.canvassHeaderForm.controls['id'].setValue(this.canvassHeader.id);
    this.canvassHeaderForm.controls['TransNo'].setValue(this.canvassHeader.TransNo);
    this.canvassHeaderForm.controls['TransCode'].setValue(this.canvassHeader.TransCode);
    this.canvassHeaderForm.controls['ReasonId'].setValue(this.canvassHeader.ReasonId);
    this.canvassHeaderForm.controls['ReasonName'].setValue(this.canvassHeader.ReasonName);
    this.canvassHeaderForm.controls['Remarks'].setValue(this.canvassHeader.Remarks);
    this.canvassHeaderForm.controls['ReferenceNo'].setValue(this.canvassHeader.ReferenceNo);
  }

  validateForm(){
    return this.onSubmit();
  }
  onSubmit(){
    this.loading = true;

    var dates = ['TransDate'];
    dates.forEach(x => {
      if(this.canvassHeaderForm.controls[x].value != null)
        this.canvassHeaderForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.canvassHeaderForm.controls[x].value)));
    });

    this.canvassHeadersService.updateCanvassHeader(this.transCode,  this.action,this.canvassHeaderForm.getRawValue()).subscribe({
      next:(res)=>{
        var canvassHeader = res.canvassHeader;
        var canvassDetails = res.canvassDetails;

        this.notif.toastrSuccess(res.message);
        if(this.action == 'savecanvasstransaction'){
          if(this.printReceipt){
            this.print(canvassHeader, canvassDetails);
          }
        }
        this.dialogRef.close(res.canvassHeader);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  async print(canvassHeader, canvassDetails) {
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printcanvassdetails']));
    var title = 'CANVASS RECEIPT OF  - ' + canvassHeader.TransNo ;
    var data:any = await firstValueFrom(this.canvassDetailsService.getCanvassDetailsWithCanvassDetailSuppliersByTransNo(canvassHeader.TransNo));
    
    this.printService.popupWindow(url, 'printcanvassdetails', window, 800, 800);
    localStorage.setItem('Header', JSON.stringify(canvassHeader));
    localStorage.setItem('Details', JSON.stringify(data));
    localStorage.setItem('Title', title);
    localStorage.setItem('TransNo', canvassHeader.TransNo);
  }


  onClose(){
    this.dialogRef.close();
  }

  onChangePrintReceipt(value){
    this.printReceipt = value;
  }

  onClickSignatures(){
    if(this.btnText.toLowerCase() == 'update'){
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([this.canvassHeader.TransNo, 'CanvassHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }else{
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '1000px';
      dialogConfig.data         = ([null, 'CanvassHeaders']);
      this.dialog.open(SignaturesUIComponent,dialogConfig);
    }
  }

}
