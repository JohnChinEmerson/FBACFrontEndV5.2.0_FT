import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';

@Component({
  selector: 'app-sale-return-signatures',
  templateUrl: './sale-return-signatures.component.html',
  styleUrls: ['./sale-return-signatures.component.css']
})
export class SaleReturnSignaturesComponent implements OnInit {

  constructor(
    private dialog  : MatDialog,
  ) { }

  ngOnInit(): void {
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([null, 'SaleReturnHeaders']);
    this.dialog.open(SignaturesUIComponent,dialogConfig);
  }


}
