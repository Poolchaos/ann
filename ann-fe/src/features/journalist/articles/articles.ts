import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { ArticleService } from './articles-service';

@autoinject()
export class Articles {

  public articles = [];

  constructor(
    private router: Router,
    private articlesService: ArticleService
  ) {}

  public activate(): void {
    this.retrieveArticles();
  }

  private retrieveArticles(): void {
    this.articlesService
      .retrieveArticles()
      .then((articles) => {
        this.articles = articles;
      })
  }

  public navToCreateArticle(): void {
    this.router.navigate('create-article');
  }
}