import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map, Subject } from "rxjs";
import { Post } from "./post.model";
import { environment } from "src/environments/environment.prod";
import { MatSnackBar } from "@angular/material/snack-bar";


@Injectable({
    providedIn: "root"
})
export class PostService{
    private posts:Post[] = [];
    private postsUpdated = new Subject<{posts:Post[], postCount:number}>();

    constructor(private http:HttpClient, 
        private route:Router,
        private _snackBar:MatSnackBar
        ){}

    getPosts(postsPerPage:number,currentPage:number){
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
        return this.http.get<{msg:string, posts:Post[], maxCount:number}>(`${environment.apiUrl}/posts${queryParams}`)
        .pipe(map((postData) => {
            return {
                posts: postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    image: post.image,
                    _id: post._id,
                    creator: post.creator
                }
            }),
            maxPosts: postData.maxCount
        }
    }
    ))
        .subscribe({
            next: (posts) => {
                console.log(posts);
                this.posts = posts.posts;
                this.postsUpdated.next({posts:[...this.posts], postCount: posts.maxPosts});
                console.log("Fetched");
            }
        })
        // return [...this.posts];
    }

    getpostsUpdatedListener(){
        return this.postsUpdated.asObservable();
    }

    getPost(id:string){
        return this.http.get<Post>(`${environment.apiUrl}/posts/${id}`);
    }

    addPosts(title:string, content:string, image:File){
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.http.post<{msg:string, post:Post}>(`${environment.apiUrl}/posts`, postData)
        .subscribe({
            next:(resData) => {                
                this._snackBar.open("Post Added successfully","", {
                    duration: 3*1000,
                    panelClass: "post-saved",
                    verticalPosition: "top"
                })
                this.route.navigate(['/'])
            },
            error: (err) => {
                console.log(err);
            }
        })
    }

    deletePosts(postId:string){
        return this.http.delete(`${environment.apiUrl}/posts/${postId}`);
    }

    updatePosts(_id:string, title: string, content:string, image: string){
        let postData:Post | FormData;
        if(typeof(image) === 'object'){
            postData = new FormData();
            postData.append('_id', _id),
            postData.append('title', title),
            postData.append('content', content),
            postData.append('image', image, title)
        }else {
            postData = {
                _id:_id,
                title: title,
                content: content,
                image: image,
                creator: {
                    email: "",
                    userId: ""
                }
            }
        }
        this.http.put(`${environment.apiUrl}/posts/${_id}`, postData)
        .subscribe({
            next: (response) => {
                this._snackBar.open("Post Updated successfully","", {
                    duration: 3*1000,
                    panelClass: "post-saved",
                    verticalPosition: "top"
                })
                this.route.navigate(['/'])
            }
        })
    }
}