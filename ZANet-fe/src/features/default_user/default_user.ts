import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@autoinject
export class User {

  constructor(private router: Router) {}
  
  public viewArticleByCategory(category: string): void {
    this.router.navigate(`articles?category=${category}`);
  }
}