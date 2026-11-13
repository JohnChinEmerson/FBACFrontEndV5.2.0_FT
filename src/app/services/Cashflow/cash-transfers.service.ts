import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CashTransfersService {

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
  
  
    get requiredRefresh(){
      return this._refreshrequired;
    }

    getCashTransfersByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
      return this.http.get<any>(_url+'getCashTransfersByDateFromByDateTo/'+dateFrom+'/'+dateTo,this.BranchId);
    }
    getCashTransferByTransNo(transNo) : Observable<any>{
      return this.http.get<any>(_url+'getCashTransferByTransNo/'+transNo,this.BranchId);
    }
    updateCashTransferRecordStatus(transNo, action) : Observable<any>{
      return this.http.get<any>(_url+'updateCashTransferRecordStatus/'+transNo+'/'+action, this.BranchId );
    }

    saveEditCashTransfer(action,cashTransfer) : Observable<any>{
      return this.http.post<any>(_url+'saveEditCashTransfer/'+action,cashTransfer, this.BranchId );
    }
    
}
