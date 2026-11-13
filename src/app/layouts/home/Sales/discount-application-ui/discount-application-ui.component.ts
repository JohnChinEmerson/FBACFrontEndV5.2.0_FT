import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiscountApplicationsService } from 'src/app/services/Sales/discount-applications.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DateTimesService } from 'src/app/services/date-times.service';

// Desktop DiscountPersonUI: details of one discount applied to the sale (add or update)
@Component({
  selector: 'app-discount-application-ui',
  templateUrl: './discount-application-ui.component.html',
  styleUrls: ['./discount-application-ui.component.css']
})
export class DiscountApplicationUIComponent implements OnInit {
  btnText       : string = "Add";
  loading       : boolean = false;
  discountTypes : any = ['percent', 'amount'];
  transNo       : string;
  paxCount      : number = 1;
  totalAmount   : number = 0;
  vatType       : string = '';
  isRegular     : boolean = false;
  isSoloParent  : boolean = false;
  discountAmount: number = 0;
  discountForm = new FormGroup({
    id             : new FormControl(0),
    DiscountName   : new FormControl(''),
    DiscountPercent: new FormControl(0, [Validators.required, Validators.min(0)]),
    DiscountType   : new FormControl('percent'),
    DiscountPerson : new FormControl(''),
    DiscountId     : new FormControl(''),
    DiscountTIN    : new FormControl(''),
    DiscountedPax  : new FormControl(1, [Validators.required, Validators.min(1)]),
    NameOfChild    : new FormControl(''),
    ChildAge       : new FormControl(''),
    ChildBirthDate : new FormControl(new Date()),
  });
  constructor(
    private dialogRef                   : MatDialogRef<DiscountApplicationUIComponent>,
    private discountApplicationsService : DiscountApplicationsService,
    private notif                       : NotificationService,
    private dateTimesService            : DateTimesService,
    @Inject(MAT_DIALOG_DATA) public data: any, // [discount person or applied discount, transNo, paxCount, totalAmount, vatType]
  ) { }

  ngOnInit(): void {
    var discount      = this.data[0];
    this.transNo    = this.data[1];
    this.paxCount     = Math.max(1, +this.data[2] || 1);
    this.totalAmount  = +this.data[3] || 0;
    this.vatType      = (this.data[4] || '').toLowerCase();

    if (discount.id && discount.DiscountName) {
      this.btnText = "Update";
      this.discountForm.patchValue({
        id             : discount.id,
        DiscountName   : discount.DiscountName,
        DiscountPercent: +discount.DiscountPercent,
        DiscountType   : discount.DiscountType,
        DiscountPerson : this.blankIfDash(discount.DiscountPerson),
        DiscountId     : this.blankIfDash(discount.DiscountId),
        DiscountTIN    : this.blankIfDash(discount.DiscountTIN),
        DiscountedPax  : +discount.DiscountedPax,
        NameOfChild    : this.blankIfDash(discount.NameOfChild),
        ChildAge       : this.blankIfDash(discount.ChildAge),
        ChildBirthDate : discount.ChildBirthDate ? new Date(discount.ChildBirthDate) : new Date(),
      });
    } else {
      this.discountForm.patchValue({
        DiscountName   : discount.DiscountPerson,
        DiscountPercent: +discount.DiscountPercent,
        DiscountType   : 'percent',
        DiscountedPax  : 1,
      });
    }
    var name = (this.discountForm.controls['DiscountName'].value || '').toLowerCase();
    this.isRegular    = name == 'regular';
    this.isSoloParent = name == 'solo parent';
    if (!this.isRegular) {
      this.discountForm.controls['DiscountPercent'].disable();
      this.discountForm.controls['DiscountType'].disable();
    }
    this.discountForm.controls['DiscountedPax'].setValidators([Validators.required, Validators.min(1), Validators.max(this.paxCount)]);
    if (this.paxCount <= 1)
      this.discountForm.controls['DiscountedPax'].disable();
    this.computeDiscount();
  }

  // preview of SaleHeadersBAL.GetComputedAmounts for this row; the server computes the saved amount
  computeDiscount(){
    var form    = this.discountForm.getRawValue();
    var name    = (form.DiscountName || '').toLowerCase();
    var value   = +form.DiscountPercent || 0;
    var dPax    = +form.DiscountedPax || 0;
    if (form.DiscountType != 'percent') {
      this.discountAmount = value;
      return;
    }
    // Desktop: Regular, NAAC and MOV are a percent of the amount itself, the others of the amount less VAT
    var base = (this.vatType == 'no vat' || ['regular', 'naac', 'mov'].includes(name)) ? this.totalAmount : this.totalAmount / 1.12;
    this.discountAmount = (base / this.paxCount) * dPax * (value / 100);
  }

  onSubmit(){
    if (this.discountForm.invalid) return;
    this.loading = true;
    var form = this.discountForm.getRawValue();
    form.PaxCount = this.paxCount;
    form.VATType = this.vatType;
    form.ChildBirthDate = form.ChildBirthDate ? this.dateTimesService.ConvertToDateFormat(new Date(form.ChildBirthDate)) : null;
    this.discountApplicationsService.saveDiscountApplication(this.transNo, form).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.loading = false;
        this.dialogRef.close(res.discountApplications);
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  onClose(){
    this.dialogRef.close();
  }

  private blankIfDash(value){
    return value == null || value == '-' ? '' : value;
  }
}
