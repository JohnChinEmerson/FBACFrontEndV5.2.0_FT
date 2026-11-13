import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReceivableOldReceiptsService {

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
      
      getReceivableOldReceiptByTransNo(transNo) : Observable<any>{
        return this.http.get<any>(_url+'getReceivableOldReceiptByTransNo/'+transNo, this.BranchId );
      }
    
      getReceivableOldReceiptsByRecordStatus(recordStatus) : Observable<any>{
        return this.http.get<any>(_url+'getReceivableOldReceiptsByRecordStatus/'+recordStatus, this.BranchId );
      }

      saveReceivableOldReceipt(btnText,receivableOldReceiptForm) : Observable<any>{
        return this.http.post<any>(_url+'saveReceivableOldReceipt/'+btnText,receivableOldReceiptForm, this.BranchId );
      }
      getReceivableOldReceiptsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
        return this.http.get<any>(_url+'getReceivableOldReceiptsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
      }
    
      updateReceivableOldReceiptRecordStatus(transNo, action) : Observable<any>{
        return this.http.get<any>(_url+'updateReceivableOldReceiptRecordStatus/'+transNo+'/'+action, this.BranchId );
      }
}
