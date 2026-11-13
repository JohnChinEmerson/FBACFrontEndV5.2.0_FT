import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';

@Component({
  selector: 'app-delivery-signatures',
  templateUrl: './delivery-signatures.component.html',
  styleUrls: ['./delivery-signatures.component.css']
})
export class DeliverySignaturesComponent implements OnInit {

  constructor(
    private dialog  : MatDialog,
  ) { }

  ngOnInit(): void {
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([null, 'DeliveryHeaders']);
    this.dialog.open(SignaturesUIComponent,dialogConfig);
  }


}
