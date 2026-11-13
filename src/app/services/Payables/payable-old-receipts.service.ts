import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PayableOldReceiptsService {

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
      
      getPayableOldReceiptByTransNo(transNo) : Observable<any>{
        return this.http.get<any>(_url+'getPayableOldReceiptByTransNo/'+transNo, this.BranchId );
      }
    
      getPayableOldReceiptsByRecordStatus(recordStatus) : Observable<any>{
        return this.http.get<any>(_url+'getPayableOldReceiptsByRecordStatus/'+recordStatus, this.BranchId );
      }

      savePayableOldReceipt(btnText,receivableOldReceiptForm) : Observable<any>{
        return this.http.post<any>(_url+'savePayableOldReceipt/'+btnText,receivableOldReceiptForm, this.BranchId );
      }
      getPayableOldReceiptsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
        return this.http.get<any>(_url+'getPayableOldReceiptsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
      }
    
      updatePayableOldReceiptRecordStatus(transNo, action) : Observable<any>{
        return this.http.get<any>(_url+'updatePayableOldReceiptRecordStatus/'+transNo+'/'+action, this.BranchId );
      }
}
