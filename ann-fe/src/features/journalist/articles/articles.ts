import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogService } from 'aurelia-dialog';

import { ArticleService } from './articles-service';
import { DataStore } from 'stores/data-store';
import { EVENTS } from 'stores/events';
import { RemoveArticleDialog } from './remove-article-dialog/remove-article-dialog';

@autoinject()
export class Articles {

  public articles = [];

  private params: { [key: string]: string };

  constructor(
    private router: Router,
    private articleService: ArticleService,
    private eventAggregator: EventAggregator,
    public dataStore: DataStore,
    private dialogService: DialogService
  ) {}

  public activate(params?: any): void {
    this.params = params;
    this.retrieveArticles();
  }

  private retrieveArticles(): void {
    try {
      this.articleService
        .getArticles(this.params)
        .then((articles) => {
          this.articles = articles;
        });
    } catch(e) {
      console.warn('Unauthorised access. Routing to dashboard.');
      // this.router.navigate('dashboard');
    }
  }

  public goToCreateArticle(): void {
    this.router.navigate('create-article');
  }

  public playAudio(file: string, parentIndex: number, index: number): void {
    this.articleService
      .playAudio(file)
      .then((response: { type: string, content: any }) => {
        this.play(response, parentIndex, index);
      });
  }

  private play(response: { type: string, content: string }, parentIndex: number, index: number):void {
    const base64 = `data:${response.type};base64,${response.content}`;
    const audio: HTMLAudioElement = document.querySelector(`#js-audio-${parentIndex}-${index}`);

    audio.src = base64;
    audio.autoplay = true;
    audio.controls = true;
  }

  public editArticle(articleId: string): void {
    this.router.navigate(`edit-article?articleId=${articleId}`);
  }

  public removeArticle(article: any): void {
    this.dialogService
      .open({ viewModel: RemoveArticleDialog, model: article })
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.confirmRemoveArticle(article._id);
        } else {
          console.log('dialog cancelled');
        }
        console.log(response.output);
      });
  }

  public confirmRemoveArticle(articleId: string): void {
    this.articleService
      .removeArticle(articleId)
      .then(() => {
        console.log(' ::>> successfully activated article ');
        this.articles = this.articles.filter(article => article._id !== articleId);
      })
      .catch(() => {
        console.log(' ::>> failed to activate article ');
      });
  }

  public activateArticle(articleId: string): void {
    this.articleService
      .activateArticle(articleId)
      .then(() => {
        console.log(' ::>> successfully activated article ');
        this.articles = this.articles.filter(article => article._id !== articleId);
      })
      .catch(() => {
        console.log(' ::>> failed to activate article ');
      });
  }

  public addToCart(article: any) {
    const item = {
      _id: article._id,
      name: article.name,
      category: article.category
    };
    console.log(' ::>> adding article ', item);
    // this.cart.push(item);
    this.eventAggregator.publish(EVENTS.ADD_ITEM_TO_CART, item);
  }
}