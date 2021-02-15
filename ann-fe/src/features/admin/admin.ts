import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@autoinject()
export class Admin {
  
  constructor(private router: Router) {}

  public navToMembers(): void {
    this.router.navigate('users');
  }
}