import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { SVGManager } from "../../services/svg-manager-service";

@autoinject
export class User {

  constructor(private router: Router) {}
  
  public viewArticleByCategory(category: string): void {
    this.router.navigate(`articles?category=${category}`);
  }

  public SVGManager = SVGManager;
  public categories = [

  ];
}
