import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authStateListenerSubs!:Subscription;
  userIsAuthenticated = false;
  user!:string;

  constructor(private authService:AuthService,
      private _snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    this.user = localStorage.getItem("user")!;
    this.userIsAuthenticated = this.authService.getAuth();
    this.authStateListenerSubs = this.authService.getAuthStateListener()
    .subscribe({
      next: (isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        }
      })
  }

  onLogout(){
    this.authService.logOut();
    this._snackBar.open("Logged out as "+this.user, "", {
      duration: 2*1000,
      panelClass: "logout",
      verticalPosition: "top"
    })
  }

  ngOnDestroy() {
    this.authStateListenerSubs.unsubscribe();      
  }

}
