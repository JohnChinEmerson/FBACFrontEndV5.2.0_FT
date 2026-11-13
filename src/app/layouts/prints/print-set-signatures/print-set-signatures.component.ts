import { Component, Input, OnInit } from '@angular/core';
import { SignaturesService } from '../../../services/Config/signatures.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-print-set-signatures',
  templateUrl: './print-set-signatures.component.html',
  styleUrls: ['./print-set-signatures.component.css']
})
export class PrintSetSignaturesComponent implements OnInit {
  @Input() data: any;
  signatures : any =[];
  firstColumn : any =[];
  secondColumn : any =[];
  constructor(
    private signaturesService : SignaturesService, 
  ) { }

  async ngOnInit(): Promise<void> {
    await this.setSignatures();
  }

  async setSignatures(){
    this.signatures = await firstValueFrom(this.signaturesService.setSignatures(this.data));
    this.firstColumn = this.signatures['firstColumn'];
    this.secondColumn = this.signatures['secondColumn'];
  }

}
