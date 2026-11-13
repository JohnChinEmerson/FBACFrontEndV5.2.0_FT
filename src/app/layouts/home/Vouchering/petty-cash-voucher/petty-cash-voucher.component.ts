import { Component, OnInit } from '@angular/core';
import { VoucherHeadersService } from '../../../../services/Vouchering/voucher-headers.service';
import { firstValueFrom } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToolBoxService } from '../../../../services/tool-box.service';
import { VoucherTransUIComponent } from '../voucher-trans-ui/voucher-trans-ui.component';

@Component({
  selector: 'app-petty-cash-voucher',
  templateUrl: './petty-cash-voucher.component.html',
  styleUrls: ['./petty-cash-voucher.component.css']
})
export class PettyCashVoucherComponent implements OnInit {
  receipt : any;
  constructor(
    private dialog  : MatDialog,
    private voucherHeadersService  : VoucherHeadersService,
    private toolBoxService  : ToolBoxService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getPettyCashValue();
  }

  async getPettyCashValue(){
    this.receipt = await firstValueFrom(this.voucherHeadersService.getPettyCashValue());
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = ([this.receipt,'', 'generatepettycashvoucher']);
    this.dialog.open(VoucherTransUIComponent, dialogConfig).beforeClosed().subscribe(item => {
        this.toolBoxService.onHome();
    });
  }

}
