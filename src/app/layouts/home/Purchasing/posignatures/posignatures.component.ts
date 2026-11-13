import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';

@Component({
  selector: 'app-posignatures',
  templateUrl: './posignatures.component.html',
  styleUrls: ['./posignatures.component.css']
})
export class POSignaturesComponent implements OnInit {

  constructor(
    private dialog  : MatDialog,
  ) { }

  ngOnInit(): void {
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([null, 'POHeaders']);
    this.dialog.open(SignaturesUIComponent,dialogConfig);
  }


}
