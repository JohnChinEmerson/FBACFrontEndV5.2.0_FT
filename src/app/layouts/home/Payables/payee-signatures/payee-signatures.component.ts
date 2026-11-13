import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';

@Component({
  selector: 'app-payee-signatures',
  templateUrl: './payee-signatures.component.html',
  styleUrls: ['./payee-signatures.component.css']
})
export class PayeeSignaturesComponent implements OnInit {

  constructor(
    private dialog  : MatDialog,
  ) { }

  ngOnInit(): void {
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([null, 'SupplierPaymentHeaders']);
    this.dialog.open(SignaturesUIComponent,dialogConfig);
  }


}
