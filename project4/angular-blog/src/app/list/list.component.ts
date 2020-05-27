import { Component, OnInit } from '@angular/core';
import { BlogService, Post } from '../blog.service'; 
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
    ) { 
      this.route.paramMap.subscribe(() => {
        this.ngOnInit();
      });
    }
  draft: Post;
  username: string;
  postList: Post[];
  modifiedList: string[];
  nextPostid: number;
  // curUrlPostid: number;
  // singlePost: Post;
  // postid: any;
  ngOnInit(): void {
    this.getUsername();
    // this.getUrlPostid();
    this.getPostList();
    // this.getDraft();
    this.blogService.eventEmit.subscribe((value: any) => {
      if(value == "fresh") {
        this.getPostList();
      }
    })
    
  }

  // getDraft(): void {
  //   this.draft = new Post();
  //   var postid = +this.route.snapshot.paramMap.get('id');
  //   if(postid > 0) {
  //     this.draft = this.blogService.getCurrentDraft();
  //   } else {
  //     this.draft.postid = 0;
  //   }
  // }

  // getUrlPostid(): void {
   
  //   this.curUrlPostid =  +this.route.snapshot.paramMap.get('id');
  // }
  //TEST BLOCK
  // draftTest(): void {
  //   var singlePost: Post = new Post();
  //   singlePost.postid = 1;
    
  //   // singlePost.created = data[0].created;
  //   singlePost.title = "TEST DRAFT";
  //   singlePost.body = "TEST DRAFT";
  //   // this.blogService.setCurrentDraft(singlePost);
  //   console.log(this.blogService.getCurrentDraft());
  // }

  // deletePost(): void {
  //   this.blogService.deletePost(this.username, 1);
  // }

  // updatePost(): void {
  //   var post: Post = new Post();
  //   post.postid = 1;
  //   post.body = "testPUTAng2";
  //   post.title = "testPUTAng2";
  //   // console.log(JSON.stringify(post))
  //   this.blogService.updatePost(this.username, post);
  // }

  newPost(): void {
    this.draft = new Post();
    this.draft.postid = this.nextPostid;
    this.nextPostid = this.nextPostid + 1;
    this.draft.body = "";
    this.draft.title = "";
    // console.log(JSON.stringify(post))
    this.blogService.newPost(this.username, this.draft);
    this.blogService.setCurrentDraft(this.draft);
    this.ngOnInit();
  }

  // getSinglePost(): void {
  //   this.blogService.getPost(this.username, 1)
  //   .then((res) => this.singlePost = res);
  // }

  compare() {
    return function(obj1, obj2) {
      var postid1 = obj1.postid;
      var postid2 = obj2.postid;
      if(postid1 < postid2) {
        return -1;
      } else if (postid1 > postid2) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  
  setDraft(post: Post): void {
    this.blogService.setCurrentDraft(post);
    // console.log(this.blogService.getCurrentDraft());
  }

  getPostList(): void {
    // this.getUrlPostid();
    // console.log("Current URL postid = " + this.curUrlPostid);
    this.blogService.fetchPosts(this.username)
    .then((res) => {
      res.sort(this.compare());
      this.nextPostid = res[res.length - 1].postid + 1;
      this.postList = res;

    });
  }
  
  getUsername(): void {
    let jwt = this.parseJWT(document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
    this.username = jwt.usr;
    // this.username = "1";
    
  }

  parseJWT(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

}
