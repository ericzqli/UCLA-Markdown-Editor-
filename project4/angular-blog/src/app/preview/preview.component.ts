import { Component, OnInit } from '@angular/core';
import { Parser, HtmlRenderer } from 'commonmark';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService, Post } from '../blog.service'; 

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  post: Post;
  markdown: Post;
  urlpostid: number;
  username: string;

  constructor( private route: ActivatedRoute,
              private blogService: BlogService,
              private router: Router
              ) {
    this.route.paramMap.subscribe(() => {
      this.markdown = new Post();
      this.getUsername();
      this.getUrlPostid();
      this.getPost();
      this.markdownProcess();
    });
   }

  ngOnInit(): void {
    this.getUsername();
    this.getUrlPostid();
    this.getPost();
    this.markdownProcess();
  }

  markdownProcess(): void {
    var reader = new Parser();
    var writer = new HtmlRenderer();
    // console.log(this.markdown);
    var parsed = reader.parse(this.markdown.body)
    this.markdown.body = writer.render(parsed);
    parsed = reader.parse(this.markdown.title)
    this.markdown.title = writer.render(parsed);
  }

  getUrlPostid(): void{
    this.urlpostid = +this.route.snapshot.paramMap.get('id');
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

  getPost(): void {
    this.post = this.blogService.getCurrentDraft();
    // if(this.post == null || this.post.postid != this.urlpostid) {
    //   this.blogService.getPost(this.username, this.urlpostid)
    //   .then((res) => {   
    //     this.copyMarkdown(res);
    //     this.markdownProcess();
    //   }).catch((err) => console.log("POST NOT FOUND"));
    // } else {\
    if (this.post == null || this.post.postid != this.urlpostid) {
      console.log("goto error");
      this.router.navigateByUrl('/error');
    }
    this.copyMarkdown(this.post);
    this.markdownProcess();
    // }   
  }

  copyMarkdown(post): void {
    this.markdown.body = post.body;
    this.markdown.title = post.title;
    this.markdown.postid = post.postid;
  }


}
