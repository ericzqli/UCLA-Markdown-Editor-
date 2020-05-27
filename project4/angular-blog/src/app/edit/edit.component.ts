import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { BlogService, Post } from '../blog.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router
    ) {
      this.route.paramMap.subscribe(() => {
        this.ngOnInit();
      });
     }
  @Input() post: Post;
  username: string;
  urlpostid: number;


  ngOnInit(): void {
    this.getUsername();
    this.getUrlPostid();
    this.getPost();
    // this.refreshList();    
  }

  refreshList(): void {
    this.blogService.eventEmit.emit("fresh");
  }

  getUrlPostid(): void{
    this.urlpostid = +this.route.snapshot.paramMap.get('id');
  }
  //FOR TEST PURPOSE
  // getSinglePost(): void {
    
  //   console.log("getSingle");
  //   console.log(this.post);
  // }
  //for test purpost
  getPost(): void {
    this.post = this.blogService.getCurrentDraft();
    // console.log(this.post);
    if(this.post == null || this.post.postid != this.urlpostid) {
      this.blogService.getPost(this.username, this.urlpostid)
      .then((res) => {
        this.blogService.setCurrentDraft(res);
        this.post = this.blogService.getCurrentDraft();
        // console.log(this.blogService.getCurrentDraft());
      }).catch((err) => this.router.navigateByUrl("error"));
    }
  }

  deletePost(): void {
    this.blogService.deletePost(this.username, this.post.postid);
    this.post = null;
    this.refreshList();
  }

  savePost(): void {
    this.blogService.updatePost(this.username, this.post);
    this.blogService.getPost(this.username, this.urlpostid)
      .then((res) => {
        this.blogService.setCurrentDraft(res);
        this.post = this.blogService.getCurrentDraft();
        this.refreshList();
      }).catch((err) => console.log("POST NOT FOUND"));
  }

  getUsername(): void {
    let jwt = this.parseJWT(document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
    this.username = jwt.usr;
    // this.username = "1";
    
  }

  previewPost(): void {
    this.blogService.setCurrentDraft(this.post);
  }

  parseJWT(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }


}
