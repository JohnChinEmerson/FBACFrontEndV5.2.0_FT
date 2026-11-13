import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AccountTitlesService } from 'src/app/services/Accounting/account-titles.service';
import { AdjustingEntryDetailsService } from 'src/app/services/Accounting/adjusting-entry-details.service';
import { AdjustingEntryHeadersService } from 'src/app/services/Accounting/adjusting-entry-headers.service';
import { IndexTablesService } from 'src/app/services/Accounting/index-tables.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { PrintService } from 'src/app/services/print.service';
import { StringHelperService } from 'src/app/services/string-helper.service';

@Component({
  selector: 'app-adjusting-entry-ui',
  templateUrl: './adjusting-entry-ui.component.html',
  styleUrls: ['./adjusting-entry-ui.component.css']
})
export class AdjustingEntryUIComponent implements OnInit {
  adjustingEntryHeader : any;
  adjustingEntryHeaders: any=[];
  adjustingEntryDetails : any=[];
  transNames: any=[];
  accountTitles: any=[];
  action : string;
  id : number = 1;
  btnText               : string = "Save";
  loading               : boolean = false;
  adjustingEntryHeaderForm = new FormGroup({
        id            : new FormControl(''),
        ReferenceNo   : new FormControl(''),
        TransDate     : new FormControl(new Date()),
        TransName     : new FormControl(),
  });
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
            
  defaultColumns    = ['Description', 'AccountTitle'];
  numberColumns   = ['DebitAmt', 'CreditAmt'];
  addedColumns   = ['Action'];
  mergeColumns    = this.defaultColumns.concat(this.numberColumns, this.addedColumns);
  selectedId: any;
  selectedData: any;
  @ViewChildren('AccountTitleInput, DebitAmtInput, CreditAmtInput') inputs: QueryList<ElementRef>;
  constructor(
        private dialogRef         : MatDialogRef<AdjustingEntryUIComponent>,
        private dialog                      : MatDialog,
        private adjustingEntryHeadersService  : AdjustingEntryHeadersService,
        private adjustingEntryDetailsService  : AdjustingEntryDetailsService,
        private accountTitlesService  : AccountTitlesService,
        private indexTablesService  : IndexTablesService,
        private notif             : NotificationService,
        private numbersService    : NumbersService,
        private dateTimesService    : DateTimesService,
        private stringHelperService    : StringHelperService,
        public matTableService    : MatTableService,
        private printService    : PrintService,
        private router    : Router,
        @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getTransNames();
    await this.getAccountTitles();
    this.adjustingEntryHeader   = this.data[0];
    this.adjustingEntryDetails  = this.data[1];
    this.adjustingEntryHeaders  = this.data[2];
    this.action  = this.data[3];
    if(this.adjustingEntryHeader){
      this.btnText = 'Update';
      this.adjustingEntryHeaderForm.controls['ReferenceNo'].disable();
      this.getAdjustingEntryHeaderFormData();
    }else{
      this.onCheck(true);
      this.adjustingEntryHeaderForm.controls['TransName'].setValue(this.transNames[0].TransName);
    }
    this.displayRecords();
  }

  getAdjustingEntryHeaderFormData(){
    this.adjustingEntryHeaderForm.controls['id'].setValue(this.adjustingEntryHeader.id);
    this.adjustingEntryHeaderForm.controls['ReferenceNo'].setValue(this.adjustingEntryHeader.ReferenceNo);
    this.adjustingEntryHeaderForm.controls['TransName'].setValue(this.adjustingEntryHeader.TransName);
    this.adjustingEntryHeaderForm.controls['TransDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.adjustingEntryHeader.TransDate)));
  }

  displayRecords(){
    var data = this.adjustingEntryDetails;
    data.forEach(x => {
      x.DebitAmt = (x.DebitAmt == 0 ? '' : x.DebitAmt);
      x.CreditAmt = (x.CreditAmt == 0 ? '' : x.CreditAmt);
    });
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  async getTransNames(){
    this.transNames = await firstValueFrom(this.indexTablesService.getTransNames());
  }
  async getAccountTitles(){
    this.accountTitles = await firstValueFrom(this.accountTitlesService.getAccountTitles());
  }
  onCheck(data: any) {
    if (data) {
      this.adjustingEntryHeaderForm.controls['ReferenceNo'].disable();
      this.adjustingEntryHeaderForm.controls['ReferenceNo'].setValue('Generated');
    }
    else {
      this.adjustingEntryHeaderForm.controls['ReferenceNo'].enable();
      this.adjustingEntryHeaderForm.controls['ReferenceNo'].setValue('');
    }
  }
  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  onClickNew(){
 if (!this.matTableService.CommonTransaction()) {
      return;
    }
      var data:any = {
        'AccountCode' : null,
        'AccountTitle' : null,
        'Description' : null,
        'DebitAmt' : null,
        'CreditAmt' : null,
        'id' : this.id,
      };
      this.adjustingEntryDetails.push(data);
      this.id += 1;
      this.displayRecords();
  }

  onClickDelete(data){
       const index = this.adjustingEntryDetails.findIndex(entry => entry.id === data.id);
       if (index !== -1) {
           this.adjustingEntryDetails.splice(index, 1);
           this.displayRecords();
       }
  }


  onSelectionChange(event: any, matSelect: any, element: any): void {
    this.updateElementAdjustingEntry(event, element.id, 'AccountTitle', element);
    matSelect.close();
  }

  
  updateElementAdjustingEntry(event: any, id: any, column: string, element: any): void {
    const adjustingEntryDetailIndex = this.adjustingEntryDetails.findIndex(
      (detail) => detail.id === id
    );
    
    if (adjustingEntryDetailIndex !== -1) {
      if (column === 'AccountTitle') {
        this.adjustingEntryDetails[adjustingEntryDetailIndex][column] = event.value;
      } else {
        this.adjustingEntryDetails[adjustingEntryDetailIndex][column] = event.target.value;
      }
    }
    
    this.displayRecords();
  
    if (column === 'Description') {
      this.focusNext('AccountTitle', element.id);
    } else if (column === 'AccountTitle') {
      this.focusNext('DebitAmt', element.id);
    } else if (column === 'DebitAmt') {
      this.focusNext('CreditAmt', element.id);
    }
  }
  

  focusNext(targetField: string, id: any): void {
    const targetInput = document.getElementById(`${targetField}-${id}`);
    if (targetInput) {
      targetInput.focus();
    }
  }

  onSubmit(){
    this.loading = true;

    var dates = ['TransDate'];
    dates.forEach(x => {
      if(this.adjustingEntryHeaderForm.controls[x].value != null)
        this.adjustingEntryHeaderForm.controls[x].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.adjustingEntryHeaderForm.controls[x].value)));
    });

    var data:any = {
      'adjustingEntryHeader' : this.adjustingEntryHeaderForm.getRawValue(),
      'adjustingEntryDetails' : this.adjustingEntryDetails,
    };

    this.adjustingEntryHeadersService.saveEditAdjustingEntryHeader(data, this.action).subscribe({
      next:(res)=>{
        var adjustingEntryHeader = res.adjustingEntryHeader;
        var adjustingEntryDetails = res.adjustingEntryDetails;
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.adjustingEntryHeader);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  validateForm() {
      for (let i = 0; i < this.adjustingEntryDetails.length; i++) {
          let x = this.adjustingEntryDetails[i];

          if (x.Description != null && x.AccountTitle != null && (x.DebitAmt != null || x.CreditAmt != null)) {
              if (x.DebitAmt == null && x.CreditAmt == null) {
                return this.notif.toastrWarning('DebitAmt/CreditAmt should not be empty.');
              }

              if (x.DebitAmt != null && x.CreditAmt != null) {
                  if (x.CreditAmt !== "" && x.DebitAmt !== "") {
                    return  this.notif.toastrWarning('DebitAmt or CreditAmt should be empty');
                  }
              }
          }else{
            return this.notif.toastrWarning('Description/AccountTitle should not be empty.');
          }
      }
      if(this.adjustingEntryDetails.length == 0)
        return this.notif.toastrWarning('AdjustingEntry should not be empty.');

    return this.onSubmit();
  }

  getTotal(column){
    let sum = 0;
    this.listData?.filteredData.forEach(x => {
      sum += +x[column];
    });
    return sum;
  }

  onClose(){
    this.dialogRef.close();
  }

}
