import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CashAccountsService } from 'src/app/services/Cashflow/cash-accounts.service';
import { CashTransfersService } from 'src/app/services/Cashflow/cash-transfers.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PrintService } from 'src/app/services/print.service';
import { StringHelperService } from 'src/app/services/string-helper.service';
import { TaxHelperService } from 'src/app/services/tax-helper.service';
import { firstValueFrom, filter } from 'rxjs';

@Component({
  selector: 'app-cash-transfer-ui',
  templateUrl: './cash-transfer-ui.component.html',
  styleUrls: ['./cash-transfer-ui.component.css']
})
export class CashTransferUIComponent implements OnInit {

  btnText : string = "Save";
  loading : boolean = false;
  cashTransfer: any=[];
  action:string;
  transCode:string;
  sources:any=[];
  destinations:any=[];
  openingBalance : any={
    'id' : 1001, 
    'CashAccount' : "Opening Balance", 
    'CashAccountType' : "Opening Balance", 
    'RecordStatus' : "active" 
  };
  cashAdjustment : any={
    'id' : 1002, 
    'CashAccount' : "Cash Adjustment", 
    'CashAccountType' : "Cash Adjustment", 
    'RecordStatus' : "active" 
  };
  cashTransferForm = new FormGroup({
              id          : new FormControl(''),
              TransNo     : new FormControl(''),
              TransDate   : new FormControl(new Date()),
              ReferenceNo : new FormControl('-'),
              Source            : new FormControl(''),
              SourceAccountType : new FormControl(''),
              Destination       : new FormControl(''),
              DestinationAccountType   : new FormControl(''),
              Amount  : new FormControl(''),
  });
  constructor(
    private dialogRef         : MatDialogRef<CashTransferUIComponent>,
    private dialog                      : MatDialog,
    private cashTransfersService  : CashTransfersService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    private taxHelperService    : TaxHelperService,
    private dateTimesService    : DateTimesService,
    private stringHelperService    : StringHelperService,
    private cashAccountsService : CashAccountsService,
    private printService    : PrintService,
    private router    : Router,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  async ngOnInit(): Promise<void> {
    if (this.data) {
      this.cashTransfer = this.data[0];
      this.action = this.data[1];
      await this.getSources();
      if (this.action.toLowerCase() == 'savecashtransfer' ) {
        this.btnText = "Save";
      }
      if (this.action.toLowerCase() == 'updatecashtransfer' ) {
        this.btnText = "Update";
        this.getcashTransferForm2();
      }
    }
  }

  async getSources()
  {
      this.sources = await firstValueFrom(this.cashAccountsService.getCashAccountsByBuiltIn('all'));
      this.sources.push(this.openingBalance);
      this.sources.push(this.cashAdjustment);
  }
  async getDestinations(source)
  {
    this.cashTransferForm.controls['SourceAccountType'].setValue(source.CashAccountType);
    this.destinations = await firstValueFrom(this.cashAccountsService.getDestinationBySourceAccount(source.CashAccount));
    this.destinations.push(this.cashAdjustment);
  }

  async onChangeDestinations(destination)
  {
    this.cashTransferForm.controls['DestinationAccountType'].setValue(destination.CashAccountType);
  }

  async getcashTransferForm2(){
    this.cashTransferForm.controls['id'].setValue(this.cashTransfer.id);
    this.cashTransferForm.controls['TransNo'].setValue(this.cashTransfer.TransNo);
    this.cashTransferForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.cashTransfer.TransDate)));
    this.cashTransferForm.controls['ReferenceNo'].setValue(this.cashTransfer.ReferenceNo);
    this.cashTransferForm.controls['Source'].setValue(this.cashTransfer.Source);
    this.cashTransferForm.controls['SourceAccountType'].setValue(this.cashTransfer.SourceType);
    this.cashTransferForm.controls['Destination'].setValue(this.cashTransfer.Destination);
    this.cashTransferForm.controls['DestinationAccountType'].setValue(this.cashTransfer.DestinationType);
    this.cashTransferForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(this.cashTransfer.Amount));

    var source:any  = this.sources.find(x => x.CashAccount.toLowerCase() == this.cashTransfer.Source.toLowerCase());
    this.getDestinations(source);
  }
  
  validateForm(){
    if (this.cashTransferForm.controls['Source'].value == this.cashTransferForm.controls['Destination'].value)
    {
      return this.notif.toastrWarning("Source and Destination should not be the same.");
    }

    return this.onSubmit();
  }
  onSubmit(){
    this.loading = true;

    var dates = ['TransDate'];
    dates.forEach(x => {
      if(this.cashTransferForm.controls[x].value != null)
        this.cashTransferForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.cashTransferForm.controls[x].value)));
    });

    this.cashTransfersService.saveEditCashTransfer(this.action,this.cashTransferForm.getRawValue()).subscribe({
      next:(res)=>{
        var cashTransfer = res.cashTransfer;
        this.notif.toastrSuccess(res.message);
        if(this.action == 'savecashtransfer'){
          this.resetForm();
        }
        else{
          this.dialogRef.close(res.cashTransfer);
        }
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  resetForm(){
    this.cashTransferForm.controls['id'].setValue(null);
    this.cashTransferForm.controls['TransNo'].setValue(null);
    this.cashTransferForm.controls['TransDate'].setValue(new Date());
    this.cashTransferForm.controls['ReferenceNo'].setValue('-');
    this.cashTransferForm.controls['Source'].setValue(null);
    this.cashTransferForm.controls['SourceAccountType'].setValue(null);
    this.cashTransferForm.controls['Destination'].setValue(null);
    this.cashTransferForm.controls['DestinationAccountType'].setValue(null);
    this.cashTransferForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(0));

  }

  onClose(){
    this.dialogRef.close();
  }

}
