import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@autoinject()
export class Error {
  
  public code: string;

  constructor(private router: Router) {}
  
  public activate(params: { code: string },): void {
    console.log(' ::>> params >>> ', params);
    this.code = params.code;
  }
  
  public back(): void {
    if (this.code === '2') {
      this.router.navigateBack();
    } else {
    this.router.navigate('login');
    }
  }
}