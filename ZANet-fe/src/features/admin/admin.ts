import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { ArticleService } from "./../journalist/articles/articles-service";
import "./admin.scss"
import { SVGManager } from "services/svg-manager-service";

@autoinject()
export class Admin {
  public SVGManager= SVGManager
  public widgetData = {};

  constructor(private router: Router, private articleService: ArticleService) {}

  public async activate(): Promise<void> {
    try {
      this.widgetData = await this.articleService.retrieveWidgetArticles();
      console.log(" ::>> widgetData >>>> ", this.widgetData);
    } catch (e) {
      console.error(" > Failed to retrieve articles widget due to:", e);
    }
  }

  public goToMembers(): void {
    this.router.navigate("users");
  }

  public goToReviewArticles(): void {
    this.router.navigate("articles");
  }
}

// const format = {
//   totalArticles: {
//     news: 2,
//     sport: 1,
//     politics: 0,
//     crime: 1,
//     technical: 10,
//     business: 0,
//     travel: 0
//   },
//   readyForReview: {
//     news: 1,
//     sport: 0,
//     politics: 0,
//     crime: 1,
//     technical: 2,
//     business: 0,
//     travel: 0
//   },
//   reviewed: {
//     news: 1,
//     sport: 1,
//     politics: 1,
//     crime: 0,
//     technical: 8,
//     business: 0,
//     travel: 0
//   },
// };
