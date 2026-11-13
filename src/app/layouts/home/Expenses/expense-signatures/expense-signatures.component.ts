import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignaturesUIComponent } from '../../Config/signatures-ui/signatures-ui.component';

@Component({
  selector: 'app-expense-signatures',
  templateUrl: './expense-signatures.component.html',
  styleUrls: ['./expense-signatures.component.css']
})
export class ExpenseSignaturesComponent implements OnInit {
  constructor(
    private dialog  : MatDialog,
  ) { }

  ngOnInit(): void {
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([null, 'ExpenseHeaders']);
    this.dialog.open(SignaturesUIComponent,dialogConfig);
  }

}
