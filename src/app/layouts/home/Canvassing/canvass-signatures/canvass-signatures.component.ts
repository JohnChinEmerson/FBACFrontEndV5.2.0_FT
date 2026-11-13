import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';

@Component({
  selector: 'app-canvass-signatures',
  templateUrl: './canvass-signatures.component.html',
  styleUrls: ['./canvass-signatures.component.css']
})
export class CanvassSignaturesComponent implements OnInit {

  constructor(
    private dialog  : MatDialog,
  ) { }

  ngOnInit(): void {
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([null, 'CanvassHeaders']);
    this.dialog.open(SignaturesUIComponent,dialogConfig);
  }


}
