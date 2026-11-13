import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SalesConfigPerMachineService {
  
  private _refreshrequired=new Subject<void>();
  branch = new HttpHeaders({
    'Content-Type': 'application/json',
    'AuthBranchId': `${this.auth.Branch ? this.auth.Branch.BranchId : ""}`,
    'UserId': `${this.auth.LoginId}`,
    'Edition': `${this.auth.Edition}`,
      
    'Token': `${localStorage.getItem('SessionToken')}`
  });

  BranchId : any;
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) { 
    this.BranchId ={ headers: this.branch};
  }

  get RequiredRefresh(){
    return this._refreshrequired;
  }

  // the receipt width of this machine is kept for the print popups (ReceiptLinesComponent)
  getSaleConfigPerMachineByComputerName(machineName) : Observable<any>{
    return this.http.get<any>(_url+'getSaleConfigPerMachineByComputerName/'+machineName, this.BranchId ).pipe(
      tap(config => {
        localStorage.setItem('POSPrinterWidth', String(+(config?.POSPrinterWidth || 0)));
        localStorage.setItem('POSPrinterFontSize', String(+(config?.POSPrinterFontSize || 0)));
      })
    );
  }

  updateSaleConfigPerMachine(data) : Observable<any>{
    return this.http.post<any>(_url+'updateSaleConfigPerMachine',data,this.BranchId);
  }
}
