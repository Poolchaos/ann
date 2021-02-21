import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@autoinject()
export class VoiceOver {

  constructor(private router: Router) {}

  public goToArticles(): void {
    this.router.navigate('articles');
  }
}