import { HttpClient } from "@angular/common/http";
import { ThisReceiver } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { ErrorInterceptor } from "../error.iterceptor";
import { User } from "./auth-data.model";
import { environment } from "src/environments/environment.prod";

@Injectable({
    providedIn: "root"
})

export class AuthService{
    url = `${environment.apiUrl}/user`;

    private token!:string;
    private authStateListener = new Subject<boolean>();
    private isAuthenticated = false;
    private tokenTimer!:NodeJS.Timer;
    private userId!:string;
    private user!: string;
    errMsg = new Subject<string>();

    constructor(private http:HttpClient, 
        private router:Router,
        ){}

    getToken(){
        return this.token;
    }

    getAuthStateListener(){
        return this.authStateListener.asObservable();
    }

    getAuth(){
        return this.isAuthenticated;
    }

    getUserId(){
        return this.userId;
    }

    createUser(email:string, password:string){
        const user:User = {email: email, password:password};
        this.http.post(`${this.url}/signup`, user)
        .subscribe({
            next: (response) => {
                this.router.navigate(['/']);
                console.log(response);
            },
            error: (err) => {
                this.authStateListener.next(false);
                this.errMsg.next(err);
                console.log(err);
            }
        })
    }

    login(email:string, password: string){
        const user:User = {email: email, password:password};
        this.http.post<{msg:string,token:string, expiresIn: number, userId:string, user:string}>(`${this.url}/login`, user)
        .subscribe({
            next: (response) => {
                const token = response.token;
                this.token = token;
                if(token){
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.user = response.user;
                    this.authStateListener.next(true);
                    const newDate = new Date();
                    const expirationDate = new Date(newDate.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token,expirationDate, this.userId, this.user);
                    this.router.navigate(['/']);
                }
                console.log(response);
            },
            error: (err) => {
                this.authStateListener.next(false);
                this.errMsg.next(err);
                console.log("err: "+err);
            }
        })
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation) {
            return ;
        }
        const now = new Date();
        const expiresIn = authInformation?.expirationDate.getTime()! - now.getTime();
        if(expiresIn > 0){
            this.token = authInformation?.token!;
            this.isAuthenticated = true;
            this.userId = authInformation.userId!;
            this.setAuthTimer(expiresIn / 1000)
            this.authStateListener.next(true);
        }
    }

    
    logOut(){
        this.token = "";
        this.isAuthenticated = false;
        this.authStateListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.userId = "";
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration:number){
        console.log("Setting timer: "+ duration);
        this.tokenTimer = setTimeout(() => {
            this.logOut();
        }, duration * 1000)
    }


    private saveAuthData(token:string, expirationDate: Date, userId:string, user:string){
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
        localStorage.setItem('user', user);
    }

    private clearAuthData(){
        localStorage.clear();
    }

    private getAuthData(){
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem("userId");
        if(!token || !expirationDate){
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId:userId
        }
    }
}