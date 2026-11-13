import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { BusinessInfoService } from 'src/app/services/Config/business-info.service';
import { NotificationService } from 'src/app/services/notification.service';
import { _url } from 'src/global-variables';

@Component({
  selector: 'app-business-background-logo-ui',
  templateUrl: './business-background-logo-ui.component.html',
  styleUrls: ['./business-background-logo-ui.component.css']
})
export class BusinessBackgroundLogoUIComponent implements OnInit {

  businessInfo              : any;
  btnSave           : string = "Save";
  photo             : any;
  loading           : boolean = false;
  hasPhoto          : boolean = false;
  isFileSelected    : boolean= false;  // Flag to track if a file is selected
  photoUrl          : string = _url+"img/config/businessinfo/";
  photoForm         = new FormGroup({
      Photo     : new FormControl(''),
  });
  column: string='';
  previewWidth: number = 300;
  previewHeight: number = 150;
  originalImage: any;
  constructor(
    private dialog            : MatDialog,
    private dialogRef         : MatDialogRef<BusinessBackgroundLogoUIComponent>,
    private businessInfoService      : BusinessInfoService,
    private notif             : NotificationService,
    private auth              : AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  ngOnInit(): void {
    this.businessInfo     = this.data[0];
    this.column     = this.data[1];
    if(this.column == 'BackgroundLogo'){
      this.hasPhoto = this.businessInfo.BackgroundLogo != null;
      this.photoUrl += this.businessInfo.BackgroundLogo;

      this.previewWidth = 1500;
      this.previewHeight = 600;
    }
    if(this.column == 'OrdinaryPrinterLogo'){
      this.hasPhoto = this.businessInfo.OrdinaryPrinterLogo != null;
      this.photoUrl += this.businessInfo.OrdinaryPrinterLogo;
      this.previewWidth = 150;
      this.previewHeight = 60;
    }
    if(this.column == 'POSPrinterLogo'){
      this.hasPhoto = this.businessInfo.POSPrinterLogo != null;
      this.photoUrl += this.businessInfo.POSPrinterLogo;
      this.previewWidth = 30;
      this.previewHeight = 15;
    }
    this.photoUrl =  this.photoUrl.replace('/api','');
    this.photo    =  this.photoUrl;
  }

  
  patchPhoto(event: Event) {
    this.isFileSelected = true;
    const file = (event.target as HTMLInputElement)?.files?.[0];

    if (!file) return;

    this.originalImage = file;

    this.resizeImage();
  }

  resizeImage() {

    if (!this.originalImage) return;

    const width = Number(this.previewWidth);
    const height = Number(this.previewHeight);

    const reader = new FileReader();

    reader.onload = (e: any) => {

      const img = new Image();

      img.onload = () => {

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        ctx?.clearRect(0, 0, width, height);

        ctx?.drawImage(
          img,
          0,
          0,
          width,
          height
        );

        // preview resized image
        this.photo = canvas.toDataURL('image/jpeg');

        this.hasPhoto = true;

        // convert resized image into file
        canvas.toBlob((blob: any) => {

          if (!blob) return;

          const resizedFile = new File(
            [blob],
            this.originalImage.name,
            {
              type: 'image/jpeg'
            }
          );

          this.photoForm.patchValue({
            Photo: resizedFile
          });

        }, 'image/jpeg', 1);

      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(this.originalImage);
  }

  onSubmit(){
    this.loading = true;

    const formData : any = new FormData();
    formData.append("Photo", this.photoForm.controls['Photo'].value);
    formData.append("Column", this.column);
    formData.append("BranchId", `${this.auth.Branch ? this.auth.Branch.BranchId : ""}`);
    formData.append("UserId", this.auth.LoginId);
    formData.append("Edition", this.auth.Edition);
    formData.append("Token", localStorage.getItem('SessionToken'));

    this.businessInfoService.addBackgroundLogo(formData).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
          this.dialogRef.close();
          this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error);
        this.notif.toastrError(err.error.message);
        this.notif.toastrError(err.message);
        this.loading = false;
      },
    });
  }

  onClickResetToDefault(){
    this.businessInfoService.resetToDefault(this.column).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
          this.dialogRef.close();
          this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error);
        this.notif.toastrError(err.error.message);
        this.notif.toastrError(err.message);
        this.loading = false;
      },
    });
  }

}
