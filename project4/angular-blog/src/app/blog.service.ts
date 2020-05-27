import { Injectable,EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class BlogService {
  // posts: Post;
  draft: Post;

  public eventEmit: any;

  constructor( ) { 
    this.draft = null;

    this.eventEmit = new EventEmitter();
    
  }
 
  
  
  fetchPosts(username: string): Promise<Post[]> {
    return new Promise(function(resolve, reject) {
        var postList = [];
        fetch('/api/' + username)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data[0]);
          // postList = data;
          for(var i = 0; i < data.length; i++) {
            var post: Post = new Post();
            post.postid = data[i].postid;
            post.modified = data[i].modified;
            post.created = data[i].created;
            post.title = data[i].title;
            post.body = data[i].body;
            // console.log(typeof(post));
            postList.push(post);
            if(postList.length == data.length) {
              resolve(postList);
            }
          }})
        .catch((err) => {
          reject(new Error("404 USER NOT FOUND"));
        });
  })
}

getPost(username: string, postid: number): Promise<Post> {
  return new Promise(function(resolve, reject) {
    var url = '/api/' + username + '/' + postid;
    // console.log(url);
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      var singlePost: Post = new Post();
      singlePost.postid = data[0].postid;
      singlePost.modified = data[0].modified;
      singlePost.created = data[0].created;
      singlePost.title = data[0].title;
      singlePost.body = data[0].body;
      // this.setCurrentDraft(singlePost);
      
      resolve(singlePost);
      
    })
    .catch((err) => {
      reject(new Error("404 POST NOT FOUND"));
    }) 
  });
}

newPost(username: string, post: Post): Promise<void> {
  return new Promise(function(resolve, reject) {
    var url = '/api/' + username + '/' + post.postid;
    var data = [];
    
    data.push(encodeURIComponent("title") + "=" + encodeURIComponent(post.title));
    data.push(encodeURIComponent("body") + "=" + encodeURIComponent(post.body));   
    
    // console.log(post.title);
    // console.log(post.body);
    var formBody = data.join("&");
    // console.log(data);
    fetch(url, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
     },
     body: formBody
    })
    .then((res) => resolve())
    .catch((err) => reject(new Error("SAVE FAILED")));
  });
}

updatePost(username: string, post: Post): Promise<void> {
  return new Promise(function(resolve, reject) {
    var url = '/api/' + username + '/' + post.postid;
    var data = [];
    
    data.push(encodeURIComponent("title") + "=" + encodeURIComponent(post.title));
    data.push(encodeURIComponent("body") + "=" + encodeURIComponent(post.body));   

    var formBody = data.join("&");
    // console.log(data);
    fetch(url, {
     method: 'PUT',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
     },
     body: formBody
    })
    .then((res) => resolve())
    .catch((err) => reject(new Error("UPDATE FAILED")));
  });
}

deletePost(username: string, postid: number): Promise<void> {
  return new Promise(function(resolve, reject) {
    var url = '/api/' + username + '/' + postid;
    fetch(url, {
     method: 'DELETE',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
     }
    })
    .then((res) => resolve())
    .catch((err) => reject(new Error("DELETE FAILED")));
  });
}

// @Output() change: EventEmitter = n/ew EventEmitter();
setCurrentDraft(post: Post): void {
  this.draft = post;
}

getCurrentDraft(): Post {
  return this.draft;
}



}


export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}