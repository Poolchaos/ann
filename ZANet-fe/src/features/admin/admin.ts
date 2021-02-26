import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@autoinject()
export class Admin {
  
  constructor(private router: Router) {}

  public goToMembers(): void {
    this.router.navigate('users');
  }

  public goToReviewArticles(): void {
    this.router.navigate('articles');
  }
}