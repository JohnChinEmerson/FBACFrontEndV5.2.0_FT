import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';

@Component({
  selector: 'app-voucher-signatures',
  templateUrl: './voucher-signatures.component.html',
  styleUrls: ['./voucher-signatures.component.css']
})
export class VoucherSignaturesComponent implements OnInit {
  constructor(
    private dialog  : MatDialog,
  ) { }

  ngOnInit(): void {
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([null, 'VoucherHeaders']);
    this.dialog.open(SignaturesUIComponent,dialogConfig);
  }

}
