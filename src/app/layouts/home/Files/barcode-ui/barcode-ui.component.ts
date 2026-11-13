import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ItemsService } from 'src/app/services/Files/items.service';
import { MultipleUMsService } from 'src/app/services/Files/multiple-ums.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-barcode-ui',
  templateUrl: './barcode-ui.component.html',
  styleUrls: ['./barcode-ui.component.css']
})
export class BarcodeUIComponent implements OnInit {
  btnText           : string = "Save";
  item              : any;
  btnTextToEdit     : boolean = false;
  loading           : boolean = false;
  otherForm         = new FormGroup({
    ItemName        : new FormControl(''),
      Barcode     : new FormControl(''),
      UM          : new FormControl(''),
  });
  updateBranchBarcode : boolean = false;
  showUpdateBranchBarcodeOption : boolean = this.authService.Branch?.BranchId === 'b01';
  constructor(
    private dialogRef         : MatDialogRef<BarcodeUIComponent>,
    private itemsService      : ItemsService,
    private multipleUMsService      : MultipleUMsService,
    private notif             : NotificationService,
    private authService             : AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any, 

  ) {
   
   }

  ngOnInit(): void {
    if (this.data) {
      this.item = this.data;
      this.btnText  = "Save";
      this.getotherForm();
    }
  }

  getotherForm(){
    this.otherForm.controls['ItemName'].setValue(this.item.ItemName);
    this.otherForm.controls['Barcode'].setValue(this.item.Barcode);
    this.otherForm.controls['UM'].setValue(this.item.UM);
  }

  onSubmit() {
    this.loading = true;
    var barcode = this.otherForm.controls['Barcode'].value;
    if(this.item.IsBaseUM.toLowerCase() == 'yes'){
      this.itemsService.updateBarcode(this.item.ItemId,barcode ).subscribe({
        next: (res) => {
          this.notif.toastrSuccess(res.message);
          if(this.updateBranchBarcode){
            this.itemsService.updateBranchBarcode(this.item.ItemName,'all' ).subscribe({
              next: (res) => {
              },
              error: (err) => {
                this.notif.toastrError(err.error.message);
              },
            });
          }
          this.dialogRef.close();
          this.loading = false;
        },
        error: (err) => {
          this.notif.toastrError(err.error.message);
          this.loading = false;
        },
      });
    }else{
      this.multipleUMsService.updateMultipleUMBarcode(this.item.ItemId, this.item.UM, barcode ).subscribe({
        next: (res) => {
          this.notif.toastrSuccess(res.message);
          if(this.updateBranchBarcode){
            this.itemsService.updateBranchBarcode(this.item.ItemName,this.item.UM ).subscribe({
              next: (res) => {
              },
              error: (err) => {
                this.notif.toastrError(err.error.message);
              },
            });
          }
          this.dialogRef.close();
          this.loading = false;
        },
        error: (err) => {
          this.notif.toastrError(err.error.message);
          this.loading = false;
        },
      });
    }
    
  }

  onChangeUpdateBranchBarcode(value){
    this.updateBranchBarcode = value;
  }

}
