import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";
import { PostService } from "../posts.service";
import { mimeType } from "./mime-type.validator"; 

@Component({
    selector: 'app-post-create',                //name
    templateUrl: './post-create.component.html', //templateURL
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy{

    enteredTitle="";
    enteredContent="";
    post!:Post;
    isLoading = false;
    mode!:string;
    form!:FormGroup
    imagePreview!:string;
    private postId!:string;  
    private authStatusSub!:Subscription;

    constructor(private postService:PostService, 
        private route:ActivatedRoute,
        private authService:AuthService
        ){}

    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStateListener()
        .subscribe({
            next:(authStatus) => {
                this.isLoading = false;
            }
        })
        this.form = new FormGroup({
            'title': new FormControl(null, 
                {validators:[Validators.required, Validators.minLength(3)]}),
            'content': new FormControl(null, {validators:[Validators.required]}),
            'image': new FormControl(null, 
                {validators: [Validators.required],
                // asyncValidators: [mimeType]
                })
        })

        this.route.paramMap.subscribe({
            next: (paramMap:ParamMap) => {
                if(paramMap.has('postID')){
                    this.mode = 'edit';
                    this.postId = paramMap.get('postID')!;
                    this.isLoading = true;
                    this.postService.getPost(this.postId).subscribe({
                        next: (postData) => {
                            this.isLoading = false;
                            this.post = {
                                _id: postData._id, 
                                title: postData.title, 
                                content: postData.content,
                                image: postData.image,
                                creator: postData.creator
                            };
                            this.form.setValue({
                                title: this.post.title,
                                content:this.post.content,
                                image: this.post.image
                            })
                            console.log(this.post.image);
                            console.log(this.imagePreview);
                        }
                    });
                }else {
                    this.mode = 'create';
                    this.postId = "";
                }
            }
        });
    }

    onImagePicked(event:Event){
        const file = (event.target as HTMLInputElement).files?.item(0); //picking only the firstfile user has selected
        this.form.patchValue({image: file});
        this.form.get('image')?.updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file as Blob);
    }

    onSavePost(){
        console.log(this.form);
        
        if(this.form.invalid){
            return;
        }
        if(this.mode === 'create'){
            this.isLoading = true;
            this.postService.addPosts(
                this.form.value.title,
                this.form.value.content, 
                this.form.value.image
            );
        }
        else {
            this.postService.updatePosts(
                this.postId,
                this.form.value.title,
                this.form.value.content,
                this.form.value.image
            );
            
        }
        // this.form.reset();
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }
}