import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../app-material.module";
import { AppRoutingModule } from "../app-routing.module";
import {PostCreateComponent} from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component'

@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent,
    ],
    imports:[
        ReactiveFormsModule,
        AngularMaterialModule,
        AppRoutingModule,
        CommonModule
    ]
})
export class PostModule {

}