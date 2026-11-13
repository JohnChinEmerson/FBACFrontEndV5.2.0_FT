import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignaturesService } from 'src/app/services/Config/signatures.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-signature-ui',
  templateUrl: './signature-ui.component.html',
  styleUrls: ['./signature-ui.component.css']
})
export class SignatureUIComponent implements OnInit {

  btnText           : string = "Save";
  loading           : boolean = false;
  signature: any=[];
  signatures: any=[];
  type:string;
  transTable:string;
  transNo:string;
  signatureForm = new FormGroup({
      TransId            : new FormControl(''),
      SignLabel    : new FormControl(''),
      SignName  : new FormControl(''),
      SignPosition : new FormControl(''),
      SignLine     : new FormControl('_________________________'),
      Sequence       : new FormControl(''),
      TransTable       : new FormControl(''),
  });

  constructor(
    private dialogRef         : MatDialogRef<SignatureUIComponent>,
    private dialog                      : MatDialog,
    private signaturesService  : SignaturesService,
    private notif             : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.signature = this.data[0];
      this.type     = this.data[1];
      this.signatures = this.data[2];
      this.transTable = this.data[3];
      this.transNo = this.data[4];
      this.signatureForm.controls['TransTable'].setValue(this.transTable);
      if (this.signature) {
        this.btnText = "Update";
        this.getsignatureFormData();
      }

    }
  }

  
  getsignatureFormData(){
    this.signatureForm.controls['TransId'].setValue(this.signature.TransId);
    this.signatureForm.controls['SignLabel'].setValue(this.signature.SignLabel);
    this.signatureForm.controls['SignName'].setValue(this.signature.SignName);
    this.signatureForm.controls['SignPosition'].setValue(this.signature.SignPosition);
    this.signatureForm.controls['SignLine'].setValue(this.signature.SignLine);
    this.signatureForm.controls['Sequence'].setValue(this.signature.Sequence);
    // this.signatureForm.controls['TransTable'].setValue(this.signature.TransTable);
  }
  onSubmit(){
    this.loading = true;
    this.signaturesService.saveEditSignatures(this.signatureForm.getRawValue(), this.btnText, this.transNo).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.loading = false;

        if(this.transNo == null){
          if(this.btnText == "Save"){
            this.signatures = [res.signature,...this.signatures]; 
            this.resetForm();
          }
          else
            this.dialogRef.close(res.signature);
        }else{
          this.dialogRef.close();
        }
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  resetForm(){
    this.signatureForm.controls['SignLabel'].setValue('');
    this.signatureForm.controls['SignName'].setValue('');
    this.signatureForm.controls['SignPosition'].setValue('');
    this.signatureForm.controls['SignLine'].setValue('_________________________');
    this.signatureForm.controls['Sequence'].setValue('');
  }

  onClose(){
    if(this.type == 'signatures'){
      this.dialogRef.close(this.signatures);
    }else{
      this.dialogRef.close();
    }
  }

}
