import { rejects } from 'assert';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

import { DataStore } from 'stores/data-store';

@autoinject()
export class ArticleService {

  private route: string = 'articles';

  constructor(
    private httpClient: HttpClient,
    private dataStore: DataStore
  ) {}

  public createArticle(
    name: string,
    category: string,
    content: string
  ): Promise<any> {
    console.log(' ::>> createArticle >>> ');

    return new Promise(resolve => {
      this.httpClient.createRequest(this.route)
        .asPost()
        .withContent({ 
          name,
          category,
          content
        })
        .send()
        .then(
          (response) => resolve(response),
          (error) => {
            console.warn(' ::>> error ', error);
          }
        );
    });
  }

  public activateArticle(articleId: string): Promise<void> {
    console.log(' ::>> createArticle >>> ');

    return new Promise((resolve, reject) => {
      // todo: read environment from .env
      this.httpClient.createRequest(this.route + '/review')
        .asPost()
        .withContent({ articleId })
        .send()
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }

  public getArticles(params?: { [key: string]: string }): Promise<any> {
    if (this.dataStore.isAdmin) {
      return this.retrieveArticlesToReview();
    } else if (this.dataStore.isJournalist) {
      return this.retrieveArticles();
    } else if (this.dataStore.isUser) {
      return this.retrieveCateredArticles(params);
    }
  }

  public retrieveArticlesToReview(): Promise<any> {
    return new Promise(resolve => {
      this.httpClient.createRequest(this.route + '/review')
        .asGet()
        .send()
        .then(
          (response) => resolve(response),
          (error) => {
            console.warn(' ::>> error ', error);
          }
        );
    });
  }
  
  public retrieveArticles(): Promise<any> {
    return new Promise(resolve => {
      this.httpClient.createRequest(this.route)
        .asGet()
        .send()
        .then(
          (response) => resolve(response),
          (error) => {
            console.warn(' ::>> error ', error);
          }
        );
    });
  }
  
  public retrieveCateredArticles(params: { [key: string]: string }): Promise<any> {
    console.log(' ::>> params >>>> ', params);
    return new Promise(resolve => {
      // resolve([]);

      this.httpClient.createRequest(this.route + '/category')
        .asGet()
        .withParams(params)
        .send()
        .then(
          (response) => resolve(response),
          (error) => {
            console.warn(' ::>> error ', error);
          }
        );
    });
  }

  public uploadAudio(file: {
    name: string;
    data: string | ArrayBuffer;
    type: string;
    size: string;
    articleId: string
  }, progressCallback: any): Promise<{ articleId: string }> {
    console.log(' ::>> createArticle >>> ');

    return new Promise((resolve, reject) => {
      // todo: read environment from .env
      this.httpClient.createRequest('audio')
        .asPost()
        .withContent(file)
        .withProgressCallback(progressCallback)
        .send()
        .then(
          (response) => {
            // @ts-ignore
            resolve(response);
          },
          (error) => reject(error)
        );
    });
  }

  public playAudio(file: string): Promise<any> {
    return new Promise((resolve, reject) => {
      
      this.httpClient.createRequest('audio')
        .asPut()
        .withContent({ audioId: file })
        .send()
        .then(
          (response) => resolve(response),
          (error) => reject(error)
        );
    });
  }
}
