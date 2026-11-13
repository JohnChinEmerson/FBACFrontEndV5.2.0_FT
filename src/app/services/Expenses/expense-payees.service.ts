import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensePayeesService {

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
    private toolbox : ToolBoxService,
  ) { 
    this.BranchId ={ headers: this.branch};
  }

  get requiredRefresh(){
    return this._refreshrequired;
  }
  
  getCBOPayees() : Observable<any>{
    return this.http.get<any>(_url+'getCBOPayees',this.BranchId );
  }

  getPayeesToDisplay() : Observable<any>{
    return this.http.get<any>(_url+'getPayeesToDisplay',this.BranchId );
  }

  getPayeeByPayeeId(PayeeId) : Observable<any>{
    return this.http.get<any>(_url+'getPayeeByPayeeId/'+PayeeId,this.BranchId );
  }

  saveEditPayees(data: any) : Observable<any>{
    return this.http.post<any>(_url+'saveEditPayees',data,this.BranchId ).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  deletePayee(id) : Observable<any>{
    return this.http.get<any>(_url+'deletePayee/'+id,this.BranchId ).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  getPayeeItemsByPayeeId(PayeeId) : Observable<any>{
    return this.http.get<any>(_url+'getPayeeItemsByPayeeId/'+PayeeId,this.BranchId );
  }

  getCBOPayeesByBranchId(BranchId): Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getCBOPayees', this.BranchId);
  }
  
  importPayees(data):Observable<any>
  {
    return this.http.post<any>(_url+"importPayees",data, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
}
