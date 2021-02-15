import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@autoinject()
export class Articles {

  constructor(private router: Router) {}
    
  public navToCreateArticle(): void {
    this.router.navigate('create-article');
  }
}