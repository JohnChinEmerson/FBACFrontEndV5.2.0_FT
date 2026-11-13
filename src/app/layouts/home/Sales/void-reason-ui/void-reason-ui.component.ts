import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-void-reason-ui',
  templateUrl: './void-reason-ui.component.html',
  styleUrls: ['./void-reason-ui.component.css']
})
export class VoidReasonUIComponent implements OnInit {
  btnText               : string = "Save";
  loading               : boolean = false;
  saleHeader            : any;
  transNo            : any;
  saleHeaderForm = new FormGroup({
    TransNo   : new FormControl(''),
      VoidReason   : new FormControl(''),
  });
  constructor(
    private dialogRef           : MatDialogRef<VoidReasonUIComponent>,
    private dialog              : MatDialog,
    private saleHeadersService  : SaleHeadersService,
    private notificationService  : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  ngOnInit(): void {
    this.saleHeader = this.data[0];
    this.transNo = this.data[1];
  }

  onSubmit(){
    this.loading = true;
    this.saleHeadersService.updateVoidReason(this.saleHeaderForm.getRawValue(), this.transNo).subscribe({
      next:(res)=>{
        this.dialogRef.close(res.saleHeader);
        this.loading = false;
      },
      error:(err)=> {
        this.notificationService.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  onClose(){
    this.dialogRef.close();
  }

}
