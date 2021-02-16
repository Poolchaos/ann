import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { ArticleService } from './articles-service';
import { DataStore } from 'stores/data-store';

@autoinject()
export class Articles {

  public articles = [];

  constructor(
    private router: Router,
    private articlesService: ArticleService,
    public dataStore: DataStore
  ) {}

  public activate(): void {
    this.retrieveArticles();
  }

  private retrieveArticles(): void {
    this.articlesService
      .getArticles()
      .then((articles) => {
        this.articles = articles;
      })
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
    let base64 = `data:${response.type};base64,${response.content}`;
    let audio: HTMLAudioElement = document.querySelector(`#js-audio-${index}`);

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
}