import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';

@Component({
  selector: 'app-return-to-supplier-signatures',
  templateUrl: './return-to-supplier-signatures.component.html',
  styleUrls: ['./return-to-supplier-signatures.component.css']
})
export class ReturnToSupplierSignaturesComponent implements OnInit {

  constructor(
    private dialog  : MatDialog,
  ) { }

  ngOnInit(): void {
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([null, 'ReturnToSupplierHeaders']);
    this.dialog.open(SignaturesUIComponent,dialogConfig);
  }

}
