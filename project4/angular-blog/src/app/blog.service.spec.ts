import { TestBed } from '@angular/core/testing';

import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    // TestBed.configureTestingModule({});
    // service = TestBed.inject(BlogService);
    // let test = BlogService();
    service = new BlogService();
  });

  it('should be true', () => {
    expect(service.fetchPosts("cs144")).toBeTruthy();
  });
});
