import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { ItemUnitsService } from 'src/app/services/Files/item-units.service';
import { ItemsService } from 'src/app/services/Files/items.service';
import { MultipleUMsService } from 'src/app/services/Files/multiple-ums.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { ItemUnitsUIComponent } from '../item-units-ui/item-units-ui.component';

@Component({
  selector: 'app-multiple-umui',
  templateUrl: './multiple-umui.component.html',
  styleUrls: ['./multiple-umui.component.css']
})
export class MultipleUMUIComponent implements OnInit {
  btnText           : string = "Save";
  loading           : boolean = false;
  multipleUM        : any=[];
  item              :any=[];
  type              :any=[];
  unitMeasures               : any=[];
  multipleUMForm = new FormGroup({
      ConversionId: new FormControl(''),
      BaseUM      : new FormControl(''),
      UM          : new FormControl(''),
      ItemId      : new FormControl(''),
      ItemName    : new FormControl(''),
      Conversion  : new FormControl(''),
      Cost        : new FormControl(''),
      Price       : new FormControl(''),
  });

  constructor(
    private dialogRef         : MatDialogRef<MultipleUMUIComponent>,
    private dialog                      : MatDialog,
    private multipleUMsService  : MultipleUMsService,
    private dateTimesService  : DateTimesService,
    private itemsService      : ItemsService,
    private itemUnitsService      : ItemUnitsService,
    private notif             : NotificationService,
    private numbersService             : NumbersService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.multipleUM = this.data[0];
      this.item       = this.data[1];
      this.type       = this.data[2];
      this.loadUMs();
      this.getmultipleUMFormData1();
      this.resetForm();
      if(this.multipleUM){
        this.btnText = 'Update';
        this.getmultipleUMFormData2();
      }
      this.itemUnitsService.requiredRefresh.subscribe(()=>{
        this.loadUMs();
      });

    }
  }

  async loadUMs(){
    this.unitMeasures =await firstValueFrom(this.itemUnitsService.getUnitMeasures());
  }


  getmultipleUMFormData1(){
    this.multipleUMForm.controls['BaseUM'].setValue(this.item.UM);
    this.multipleUMForm.controls['ItemId'].setValue(this.item.ItemId);
    this.multipleUMForm.controls['ItemName'].setValue(this.item.ItemName);

  }

  getmultipleUMFormData2(){
    this.multipleUMForm.controls['ConversionId'].setValue(this.multipleUM.ConversionId);
    this.multipleUMForm.controls['UM'].setValue(this.multipleUM.UM);
    this.multipleUMForm.controls['ItemId'].setValue(this.multipleUM.ItemId);
    this.multipleUMForm.controls['ItemName'].setValue(this.multipleUM.ItemName);
    this.multipleUMForm.controls['Conversion'].setValue(this.numbersService.Convert2Decimal(this.multipleUM.Conversion));
    this.multipleUMForm.controls['Cost'].setValue(this.numbersService.Convert2Decimal(this.multipleUM.Cost));
    this.multipleUMForm.controls['Price'].setValue(this.numbersService.Convert2Decimal(this.multipleUM.Price));
  }
  
  resetForm(){
    this.multipleUMForm.controls['UM'].setValue('');
    this.multipleUMForm.controls['Conversion'].setValue('');
    this.multipleUMForm.controls['Cost'].setValue('');
    this.multipleUMForm.controls['Price'].setValue('');
  }

  validateForm(){
    if(this.multipleUMForm.controls['BaseUM'].value == this.multipleUMForm.controls['UM'].value){
      return this.notif.toastrWarning("UM and BaseUM cannot be the same.")
    }
    if(Number(this.multipleUMForm.controls['Cost'].value) >= Number(this.multipleUMForm.controls['Price'].value)){
        return this.notif.toastrWarning("Cost must be greater than Price.")
    }
    return this.onSubmit();
  }

  onSubmit(){
    this.loading = true;

    this.multipleUMsService.saveEditMultipleUM(this.multipleUMForm.getRawValue(), this.btnText).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.loading = false;
        this.dialogRef.close(res.multipleUM);
      
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

  onClickUM(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(ItemUnitsUIComponent,dialogConfig);
  }
}
