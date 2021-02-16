import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DataStore } from 'stores/data-store';

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
}