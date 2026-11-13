import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
 
  constructor(
    public toastr: ToastrService
  ) { }


  toastrSuccess(msg:any){
    this.toastr.success(msg);
  }

  toastrError(msg:any){
    this.toastr.error(msg);
  }

  // an API error as readable text: a plain message, Laravel validation errors ({errors: {field: [..]}}) or
  // {message}; never "[object Object]" / "undefined"
  httpErrorMessage(err:any, fallback:string = 'Something went wrong. Please try again.'): string {
    var e = err?.error;
    if (typeof e === 'string' && e.trim() && !e.trim().startsWith('<')) return e;
    if (e?.errors && typeof e.errors === 'object') {
      var messages: any[] = [];
      Object.values(e.errors).forEach((m: any) => messages = messages.concat(m));
      messages = messages.filter(m => typeof m === 'string');
      if (messages.length) return messages.join(' ');
    }
    if (typeof e?.message === 'string' && e.message.trim()) return e.message;
    if (err?.status === 0) return 'Cannot reach the server. Check the connection.';
    return fallback;
  }

  toastrHttpError(err:any, fallback?:string){
    this.toastr.error(this.httpErrorMessage(err, fallback));
  }

  toastrWarning(msg:any){
    this.toastr.warning(msg);
  }

  toastrInfo(msg:any){
    this.toastr.info(msg);
  }

  // stays until closed or tapped
  toastrSticky(msg:any, title:string){
    return this.toastr.success(msg, title, { disableTimeOut: true, closeButton: true, tapToDismiss: true });
  }

  // closes by itself after the given seconds (or when tapped / closed)
  toastrTimed(msg:any, title:string, seconds:number, type: 'success' | 'error' = 'success'){
    var options = { timeOut: seconds * 1000, extendedTimeOut: 1000, closeButton: true, tapToDismiss: true, progressBar: true };
    return type == 'error' ? this.toastr.error(msg, title, options) : this.toastr.success(msg, title, options);
  }

  // short alert sound for kitchen notices (Web Audio: no sound file). The browser plays it only after the user
  // has clicked / tapped the page once; otherwise it stays quiet.
  private audioContext: any = null;
  playAlert(kind: 'notice' | 'cancelled' = 'notice'){
    try {
      var AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext) this.audioContext = new AudioCtx();
      var ctx = this.audioContext;
      if (ctx.state == 'suspended') ctx.resume();
      // notice: two rising beeps; cancelled: three low beeps
      var tones = kind == 'cancelled' ? [440, 440, 440] : [660, 880];
      tones.forEach((frequency, i) => {
        var start = ctx.currentTime + i * 0.22;
        var oscillator = ctx.createOscillator();
        var gain = ctx.createGain();
        oscillator.type = kind == 'cancelled' ? 'square' : 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
        oscillator.connect(gain).connect(ctx.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.2);
      });
    } catch (e) {
      // no audio on this device: the toast is enough
    }
  }

  popupWarning(title:string, text:string){
    return Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor :'#3f51b5',
            cancelButtonColor :'#f44336',
            cancelButtonText: 'No'
          });
  }
  popupWarning2(title:string, text:string, confirmButtonText:string, cancelButtonText:string){
    return Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            confirmButtonColor :'#3f51b5',
            cancelButtonColor :'#f44336',
            cancelButtonText: cancelButtonText
          });
  }
  popup(title:string, text:string){
    return Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: false,
            confirmButtonText: 'OK',
            confirmButtonColor :'#3f51b5',
            cancelButtonColor :'#f44336',
            cancelButtonText: 'No'
          });
  }
  popupSuccess(title:string, text:string){
    return Swal.fire({
            title: title,
            text: text,
            icon: "success",
            showCancelButton: false,
            confirmButtonText: 'OK',
            confirmButtonColor :'#3f51b5',
            cancelButtonColor :'#f44336',
            cancelButtonText: 'No'
          });
  }
  popupWarning3Buttons(title:string, text:string, denyText:string, confirmText:string,cancelText:string,  ){
    return Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            confirmButtonColor :'#3f51b5',
            cancelButtonColor :'#f44336',
            denyButtonText: denyText
          });
  }

}
