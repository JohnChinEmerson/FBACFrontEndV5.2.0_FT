import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';

@Component({
  selector: 'app-receiving-signatures',
  templateUrl: './receiving-signatures.component.html',
  styleUrls: ['./receiving-signatures.component.css']
})
export class ReceivingSignaturesComponent implements OnInit {

  constructor(
    private dialog  : MatDialog,
  ) { }

  ngOnInit(): void {
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([null, 'ReceivingHeaders']);
    this.dialog.open(SignaturesUIComponent,dialogConfig);
  }


}
