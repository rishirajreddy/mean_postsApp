import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, Subject, throwError } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    

    constructor(){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler){
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                // alert();
                return throwError(error.error.msg);
            })
        );
        
    }
}