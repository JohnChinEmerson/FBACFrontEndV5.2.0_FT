import { Component, OnInit } from '@angular/core';
import { CashDrawerUIComponent } from '../cash-drawer-ui/cash-drawer-ui.component';
import { AuthService } from '../../../../services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-cash-drawer',
  templateUrl: './cash-drawer.component.html',
  styleUrls: ['./cash-drawer.component.css']
})
export class CashDrawerComponent implements OnInit {

  constructor(
    private dialog : MatDialog,
    private authService : AuthService,
  ) { }

  ngOnInit(): void {
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = (['cashdrawer',this.authService.LoginId, null]);
    this.dialog.open(CashDrawerUIComponent,dialogConfig);
  }

}
