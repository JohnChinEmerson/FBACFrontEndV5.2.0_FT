import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { _systemTitle } from 'src/global-variables';
import { ClientLicenseUIComponent } from '../client-license-ui/client-license-ui.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-validate-license-ui',
  templateUrl: './validate-license-ui.component.html',
  styleUrls: ['./validate-license-ui.component.css']
})
export class ValidateLicenseUIComponent implements OnInit {

  licenseValidated : boolean = false;
  constructor(
    public router: Router,
    private dialog              : MatDialog,
    public auth_service : AuthService
  ) { 
    if(!this.auth_service.isLoggedIn()){
      this.validateLicense();
    }else{
      this.router.navigate(['home']);  
    }
  }

  ngOnInit(): void {
  }

  validateLicense(){
    setTimeout(() => {
      this.auth_service.validateLicense().subscribe({
        next:(res)=>{
          this.licenseValidated = true;
          if(res){
            this.router.navigate(['/landing']);
          }else{
            this.setUpLicense();
          }
        },
        error:(err)=>{
            console.log(err.error.message)
        },
  
      });
    }, 4000);
  }

  setUpLicense(){
     const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '600px';
      this.dialog.open(ClientLicenseUIComponent,dialogConfig).beforeClosed().subscribe(license => {
        if(license){
        
        }
      });
  }


}
