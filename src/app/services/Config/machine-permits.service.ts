import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class MachinePermitsService {

  private _refreshrequired=new Subject<void>();
  branch = new HttpHeaders({
    'Content-Type': 'application/json',
    'AuthBranchId': `${this.auth.Branch ? this.auth.Branch.BranchId : null}`,
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

  getMachinePermitsToDisplay(BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getMachinePermitsToDisplay',this.BranchId);
  }

  getCBOTerminals() : Observable<any>{
    return this.http.get<any>(_url+'getCBOTerminals',this.BranchId);
  }
  getMachinePermitById(Id) : Observable<any>{
    return this.http.get<any>(_url+'getMachinePermitById/'+Id,this.BranchId);
  }
  getMachinePermitByComputerName(ComputerName) : Observable<any>{
    return this.http.get<any>(_url+'getMachinePermitByComputerName/'+ComputerName,this.BranchId);
  }
  saveEditMachinePermit(data: any,btnText) : Observable<any>{
    return this.http.post<any>(_url+'saveEditMachinePermit/'+btnText,data,this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
  deleteMachinePermitById(Id) : Observable<any>{
    return this.http.get<any>(_url+'deleteMachinePermitById/'+Id,this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
  
}
