import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseParticularsService {

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
    private toolbox: ToolBoxService,
  ) { 
    this.BranchId ={ headers: this.branch};
  }

  get requiredRefresh(){
    return this._refreshrequired;
  }

  getCBOParticulars() : Observable<any>{
    return this.http.get<any>(_url+'getCBOParticulars', this.BranchId);
  }

  getParticularsToDisplay() : Observable<any>{
    return this.http.get<any>(_url+'getParticularsToDisplay', this.BranchId);
  }
  getParticularsToBarcoding() : Observable<any>{
    return this.http.get<any>(_url+'getParticularsToBarcoding', this.BranchId);
  }
  getParticularByParticularId(ParticularId) : Observable<any>{
    return this.http.get<any>(_url+'getParticularByParticularId/'+ParticularId, this.BranchId);
  }
  
  saveEditParticulars(data: any) : Observable<any>{
    return this.http.post<any>(_url+'saveEditParticulars',data, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  deleteParticular(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteParticular/'+id, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
}
