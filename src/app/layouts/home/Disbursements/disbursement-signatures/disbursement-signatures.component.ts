import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';

@Component({
  selector: 'app-disbursement-signatures',
  templateUrl: './disbursement-signatures.component.html',
  styleUrls: ['./disbursement-signatures.component.css']
})
export class DisbursementSignaturesComponent implements OnInit {
  constructor(
    private dialog  : MatDialog,
  ) { }

  ngOnInit(): void {
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([null, 'DisbursementHeaders']);
    this.dialog.open(SignaturesUIComponent,dialogConfig);
  }


}
