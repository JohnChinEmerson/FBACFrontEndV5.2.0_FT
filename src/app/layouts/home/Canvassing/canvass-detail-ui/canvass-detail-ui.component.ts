import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { CanvassDetailsService } from 'src/app/services/Canvassing/canvass-details.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MultipleUMsService } from 'src/app/services/Files/multiple-ums.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';

@Component({
  selector: 'app-canvass-detail-ui',
  templateUrl: './canvass-detail-ui.component.html',
  styleUrls: ['./canvass-detail-ui.component.css']
})
export class CanvassDetailUIComponent implements OnInit {
  @ViewChild('qtyInput') qtyInput!: ElementRef;
  btnText               : string = "Save";
  loading               : boolean = false;
  canvassDetail: any=[];
  stock:any=[];
  action:string;
  unitMeasures                   : any=[];
  UM : string;
  canvassDetailForm = new FormGroup({
      id            : new FormControl(''),
      TransNo       : new FormControl(''),
      TransCode     : new FormControl(''),
      ItemId        : new FormControl(''),
      ItemName      : new FormControl(''),
      UM            : new FormControl(''),
      Qty           : new FormControl(''),
      ReasonId    : new FormControl(''),
  });

  constructor(
    private dialogRef         : MatDialogRef<CanvassDetailUIComponent>,
    private dialog            : MatDialog,
    private canvassDetailsService: CanvassDetailsService,
    private dateTimesService: DateTimesService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    private multipleUMsService    : MultipleUMsService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  async ngOnInit(): Promise<void> {
    if (this.data) {
      this.canvassDetail = this.data[0];
      this.stock = this.data[1];
      this.action = this.data[2];

      this.UM = this.stock.UM;
      await this.getMultipleUMs();

      if (!this.canvassDetail && (this.action.toLowerCase() == 'additemcanvasstransaction' ) ) {
        this.btnText = "Save";
        this.getCanvassDetailForm1();
      }

      if (this.canvassDetail && (this.action.toLowerCase() == 'updatecanvasstransaction'|| this.action.toLowerCase() == 'editcanvassrecord'   )) {
        this.btnText = "Update";
        this.getCanvassDetailForm2();
      }
      
      if (!this.canvassDetail && (this.action.toLowerCase() == 'additemcanvassreceipts' )) {
        this.btnText = "Add";
        this.getCanvassDetailForm3();
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.qtyInput.nativeElement.focus();  
      this.qtyInput.nativeElement.select(); 
    }, 500);
  }


  async getMultipleUMs(){
    this.unitMeasures = await firstValueFrom(this.multipleUMsService.loadMultipleUMsByItemId(this.stock.ItemId));
  }
  onChangeUM(data){
    this.UM = data.UM;
  }

  getCanvassDetailForm1(){
    this.canvassDetailForm.controls['TransCode'].setValue(this.stock.TransCode);
    this.canvassDetailForm.controls['ReasonId'].setValue(this.stock.ReasonId);
    this.canvassDetailForm.controls['ItemId'].setValue(this.stock.ItemId);
    this.canvassDetailForm.controls['ItemName'].setValue(this.stock.ItemName);
    this.canvassDetailForm.controls['UM'].setValue(this.stock.UM);
    this.canvassDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
     if(this.stock.Qty > 0){
      this.canvassDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.stock.Qty));
    }
  }
  
  getCanvassDetailForm2(){
    this.canvassDetailForm.controls['id'].setValue(this.canvassDetail.id);
    this.canvassDetailForm.controls['TransNo'].setValue(this.canvassDetail.TransNo);
    this.canvassDetailForm.controls['TransCode'].setValue(this.canvassDetail.TransCode);
    this.canvassDetailForm.controls['ItemId'].setValue(this.canvassDetail.ItemId);
    this.canvassDetailForm.controls['ItemName'].setValue(this.canvassDetail.ItemName);
    this.canvassDetailForm.controls['UM'].setValue(this.canvassDetail.UM);
    this.canvassDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.canvassDetail.Qty));
  }

  getCanvassDetailForm3(){
    this.canvassDetailForm.controls['TransCode'].setValue(this.stock.TransCode);
    this.canvassDetailForm.controls['TransNo'].setValue(this.stock.TransNo);
    this.canvassDetailForm.controls['ReasonId'].setValue(this.stock.ReasonId);
    this.canvassDetailForm.controls['ItemId'].setValue(this.stock.ItemId);
    this.canvassDetailForm.controls['ItemName'].setValue(this.stock.ItemName);
    this.canvassDetailForm.controls['UM'].setValue(this.stock.UM);
    this.canvassDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
  }

  onSubmit(){
    this.loading = true;
    this.canvassDetailsService.updateCanvassDetail(this.canvassDetailForm.getRawValue(), this.action).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.canvassDetail);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  onClose(){
    this.dialogRef.close();
  }

}
