import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../app-material.module";
import { AuthRoutingModle } from "./auth-routing.module";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

@NgModule({
    declarations:[
        SignupComponent,
        LoginComponent,
    ],
    imports:[
        FormsModule,
        CommonModule,
        AngularMaterialModule,
        AuthRoutingModle
    ]
})
export class AuthModule {

}