import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { ArticleService } from './articles-service';
import { DataStore } from 'stores/data-store';
import { PurchaseService } from 'features/admin/purchases/purchase-service';

@autoinject()
export class Articles {

  public articles = [];

  private params: { [key: string]: string };

  constructor(
    private router: Router,
    private articlesService: ArticleService,
    private purchaseService: PurchaseService,
    public dataStore: DataStore
  ) {}

  public activate(params?: any): void {
    this.params = params;
    this.retrieveArticles();
  }

  private retrieveArticles(): void {
    try {
      this.articlesService
        .getArticles(this.params)
        .then((articles) => {
          this.articles = articles;
        });
      } catch(e) {
        console.warn('Unauthorised access. Routing to dashboard.');
        // this.router.navigate('dashboard');
      }
  }

  public navToCreateArticle(): void {
    this.router.navigate('create-article');
  }

  public playAudio(file: string, index: number): void {
    this.articlesService
      .playAudio(file)
      .then((response: { type: string, content: any }) => {
        this.play(response, index);
      });
  }

  private play(response: { type: string, content: string }, index: number):void {
    const base64 = `data:${response.type};base64,${response.content}`;
    const audio: HTMLAudioElement = document.querySelector(`#js-audio-${index}`);

    audio.src = base64;
    audio.autoplay = true;
    audio.controls = true;
  }

  public activateArticle(articleId: string): void {
    this.articlesService
      .activateArticle(articleId)
      .then(() => {
        console.log(' ::>> successfully activated article ');
        this.articles = this.articles.filter(article => article._id !== articleId);
      })
      .catch(() => {
        console.log(' ::>> failed to activate article ');
      });
  }

  private cart: any[] = [];

  public addToCart(article: any) {
    const item = {
      _id: article._id,
      name: article.name,
      category: article.category
    };
    console.log(' ::>> adding article ', item);
    this.cart.push(item);
  }

  public checkout(): void {
    // todo: add validation

    const articleIds = this.cart.map(item => item._id);

    this.purchaseService
      .checkout(articleIds)
      .then(() => {
        console.log(' ::>> successfully activated article ');
      })
      .catch(() => {
        console.log(' ::>> failed to activate article ');
      });
  }
}