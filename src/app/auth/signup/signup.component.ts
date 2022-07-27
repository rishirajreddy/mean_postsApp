import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  authStatusSub!:Subscription;
  errorMessage!:string;
  ifError = true;
  closeResult!:string;

  @ViewChild('content') content!:ElementRef;

  constructor(private authService:AuthService,
    private modalService: NgbModal,
    private _snackBar:MatSnackBar
    ) { }

  ngOnInit(){
    this.authService.errMsg.subscribe({
      next: (v) => {
        this.errorMessage = v;
      }
    })
    this.authStatusSub = this.authService.getAuthStateListener()
    .subscribe({
      next: (authStatus) => {
        this.isLoading = false
        this.ifError = authStatus;
        console.log(this.ifError);
        if(!this.ifError){
          this.modalService.open(this.content);
        }else {
          this._snackBar.open("SigneUp !!", "", {
            duration: 3*1000,
            panelClass: "auth",
            verticalPosition: "top"
          })
        }
      }
    });
  }

  onSignUp(form:NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
    console.log(form);
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
