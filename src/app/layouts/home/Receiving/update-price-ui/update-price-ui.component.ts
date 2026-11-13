import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MultipleUMsService } from 'src/app/services/Files/multiple-ums.service';
import { StocksService } from 'src/app/services/Inventory/stocks.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-update-price-ui',
  templateUrl: './update-price-ui.component.html',
  styleUrls: ['./update-price-ui.component.css']
})
export class UpdatePriceUIComponent implements OnInit {

  btnText               : string = "Save";
  um                  : any=[];
  loading               : boolean = false;
  updatePriceForm = new FormGroup({
      UM            : new FormControl(''),
      Price         : new FormControl(0),
      NewPrice      : new FormControl(),
  });

  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<UpdatePriceUIComponent>,
    private multipleUMsService          : MultipleUMsService,
    private stocksService               : StocksService,
    private notif                       : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.um = this.data;
  
      if (this.um) {
        this.btnText = "Update";
        this.getUpdatePriceFormData();
      }
    }
  }
  
  getUpdatePriceFormData(){
    this.updatePriceForm.controls['UM'].setValue(this.um.UM);
    this.updatePriceForm.controls['Price'].setValue(this.um.Price);
  }

  onSubmit(){
    this.loading = true;
    var newPrice = this.updatePriceForm.controls['NewPrice'].value;
      if (this.um.ConversionId == "0"){
        this.stocksService.updatePrice(this.um.ItemId,  newPrice).subscribe({
            next:(res)=>{
              this.notif.toastrSuccess(res.message);
              this.dialogRef.close(res.stock.Price);
            },
            error:(err)=> {
              this.notif.toastrError(err.error.message);
              this.loading = false;
            },
        });
      }
      else{
         this.multipleUMsService.updateMultipleUMPrice(this.um.ItemId, this.um.UM, newPrice).subscribe({
            next:(res)=>{
              this.notif.toastrSuccess(res.message);
              this.dialogRef.close(res.multipleUM.Price);
            },
            error:(err)=> {
              this.notif.toastrError(err.error.message);
              this.loading = false;
            },
        });
      }
  }

  onClose(){
    this.dialogRef.close();
  }
}
