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
      .then((response: { type: string, content: any, data: any }) => {
        console.log(' ::>> response >>>> ', response);
        this.play(response, index);
      });
  }

  private play(response: { type: string, content: any, data: any }, index: number):void {
    let base64 = `data:${response.type};base64,${response.content}`;
    let audio: HTMLAudioElement = document.querySelector(`#js-audio-${index}`);

    audio.src = base64;
    audio.autoplay = true;
    audio.controls = true;
  }
}

function manageAudio(source: string): void {
  try {
    var audio = new Audio(source);
    audio.preload = "auto";

    audio.addEventListener('ended', function() {
        alert('ended');
    }, false);
    audio.addEventListener('canplaythrough', function() {
        audio.loop = true;
        audio.play();
    }, false);

    audio.onerror = function(event) {
      // @ts-ignore
      console.log(' ::>> error >>>>> ', event);
    }

    audio.load();
  } catch(e) {
    console.error('this broke ', e);
  }
}

function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}