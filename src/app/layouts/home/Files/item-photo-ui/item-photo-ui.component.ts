import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ItemsService } from 'src/app/services/Files/items.service';
import { NotificationService } from 'src/app/services/notification.service';
import { _url } from 'src/global-variables';

@Component({
  selector: 'app-item-photo-ui',
  templateUrl: './item-photo-ui.component.html',
  styleUrls: ['./item-photo-ui.component.css']
})
export class ItemPhotoUIComponent implements OnInit {
  item              : any;
  btnSave           : string = "Save";
  photo             : any;
  loading           : boolean = false;
  hasPhoto          : boolean = false;
  isFileSelected    : boolean= false;  // Flag to track if a file is selected
  photoUrl          : string = _url+"img/files/items/";
  photoForm         = new FormGroup({
      ItemId        : new FormControl(''),
      Photo     : new FormControl(''),
  });
  constructor(
    private dialog            : MatDialog,
    private dialogRef         : MatDialogRef<ItemPhotoUIComponent>,
    private itemsService      : ItemsService,
    private notif             : NotificationService,
    private auth              : AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  ngOnInit(): void {
    this.item     = this.data;
    this.hasPhoto = this.item.Photo != null;
    this.photoUrl += this.item.Photo;
    this.photoUrl =  this.photoUrl.replace('/api','');
    this.photo    =  this.photoUrl;
    this.getphotoFormData();
  }

  getphotoFormData(){
    this.photoForm.controls['ItemId'].setValue(this.data.ItemId);
  }

  // patchPhoto(event: Event){
  //   this.isFileSelected = true;
  //   const Photo = (event.target as HTMLInputElement)?.files?.[0];
  //   this.photoForm.patchValue({
  //     Photo:Photo
  //   })
  // }

  patchPhoto(event: Event) {
  this.isFileSelected = true;

  const file = (event.target as HTMLInputElement)?.files?.[0];

  if (file) {

    // patch form value
    this.photoForm.patchValue({
      Photo: file
    });

    // preview image
    const reader = new FileReader();

    reader.onload = () => {
      this.photo = reader.result; // update image source
      this.hasPhoto = true;
    };

    reader.readAsDataURL(file);
  }
}


  onSubmit(){
    this.loading = true;

    const formData : any = new FormData();
    formData.append("ItemId", this.photoForm.controls['ItemId'].value);
    formData.append("Photo", this.photoForm.controls['Photo'].value);
    formData.append("BranchId", `${this.auth.Branch ? this.auth.Branch.BranchId : ""}`);
    formData.append("UserId", this.auth.LoginId);
    formData.append("Edition", this.auth.Edition);
    formData.append("Token", localStorage.getItem('SessionToken'));

    this.itemsService.addItemPhoto(formData).subscribe({
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
