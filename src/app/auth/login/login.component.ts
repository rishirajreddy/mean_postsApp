import { Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ErrorInterceptor } from 'src/app/error.iterceptor';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private authService:AuthService,
    private modalService: NgbModal,
    private _snackBar: MatSnackBar
    ) { }

  isLoading = false;
  closeResult="";
  ifError = true;
  authStatusSub!:Subscription;
  errorMessage!:string;

  @ViewChild('content') content!:ElementRef;

  ngOnInit() {
    this.authService.errMsg.subscribe({
      next: (v) => {
        this.errorMessage = v;
      }
    })
    this.authStatusSub = this.authService.getAuthStateListener()
    .subscribe({
      next: (authStatus) => {
        this.isLoading = false;
        this.ifError = authStatus;
        if(!this.ifError){
          this.modalService.open(this.content);
        } else {
          this._snackBar.open(`Logged In`,"", {
            duration: 3*1000,
            panelClass: "auth",
            verticalPosition: "top"
          }) 
        }
      }
    });
  }

  onSignIn(form:NgForm){
      if(form.invalid){
        return;
      }
      this.isLoading = true;
      this.authService.login(form.value.email, form.value.password);
  }

  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered:true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnDestroy() {
      this.authStatusSub.unsubscribe();

  }

}
