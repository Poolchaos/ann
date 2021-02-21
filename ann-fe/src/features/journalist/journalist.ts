import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@autoinject()
export class Journalist {

  constructor(private router: Router) {}

  public activate(): void {
    this.goToArticles();
  }

  public goToArticles(): void {
    this.router.navigate('articles');
  }

}