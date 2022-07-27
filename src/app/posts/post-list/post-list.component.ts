import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  constructor(private postService:PostService, 
    private authService:AuthService,
    private _snackBar:MatSnackBar
    ) { }


  posts:Post[] = []
  isLoading = false;
  totalPages = 10;
  currentPage =1;
  postsPerPage = 2;
  pageSizeOptions = [1,2,5,10]
  userIsAuthenticated!:boolean;
  userId!:string;
  private postSub!:Subscription;
  private authStatusSub!:Subscription;

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSub = this.postService.getpostsUpdatedListener().subscribe({
      next:(postData: {posts: Post[], postCount:number}) => {
        this.posts = postData.posts;
        this.totalPages = postData.postCount;
        this.isLoading = false;
        console.log(postData.posts);
        console.log("posts: "+this.posts);
      }
    })
    this.userIsAuthenticated = this.authService.getAuth();
   this.authStatusSub = this.authService.getAuthStateListener().subscribe({
    next: (authenticated)=>{
      this.userIsAuthenticated = authenticated;
      this.userId = this.authService.getUserId();
    }
   })
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
    // console.log(pageData);
  }

  onDelete(postId:string){
    this.isLoading = true;
    this.postService.deletePosts(postId)
    .subscribe({
      next:(v) => {
        this._snackBar.open("Post Deleted successfully","", {
          duration: 3*1000,
          panelClass: "post-deleted",
          verticalPosition: "top"
      })
        this.postService.getPosts(this.postsPerPage, this.currentPage)
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
      }
    })
  }

  ngOnDestroy() {
      this.postSub.unsubscribe();
      this.authStatusSub.unsubscribe();
  }

}
