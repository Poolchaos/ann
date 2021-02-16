import { rejects } from 'assert';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

@autoinject()
export class ArticleService {

  constructor(private httpClient: HttpClient) {}

  public createArticle(
    name: string,
    category: string,
    content: string
  ): Promise<any> {
    console.log(' ::>> createArticle >>> ');

    return new Promise(resolve => {
      // todo: read environment from .env
      // todo: make interceptor for httpClient to map response.response
      this.httpClient.createRequest('http://localhost:3000/articles')
        .asPost()
        .withContent({ 
          name,
          category,
          content
        })
        .send()
        .then(
          (response) => {
            console.log(' ::>> created ', response);
            try {
              const article = JSON.parse(response.response);
              resolve(article);
            } catch(e) {
              resolve(response.response);
            }
          },
          (error) => {
            console.warn(' ::>> error ', error);
          }
        );
    });
  }
  
  public retrieveArticles(): Promise<any> {

    return new Promise(resolve => {
      this.httpClient.createRequest('http://localhost:3000/articles')
        .asGet()
        .send()
        .then(
          (response) => {
            try {
              const user = JSON.parse(response.response);
              resolve(user);
            } catch(e) {
              resolve(response.response);
            }
          },
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
      // todo: make interceptor for httpClient to map response.response
      this.httpClient.createRequest('http://localhost:3000/audio')
        .asPost()
        .withContent(file)
        .withProgressCallback(progressCallback)
        .send()
        .then(
          (response) => resolve(response.response),
          (error) => reject(error)
        );
    });
  }

  public playAudio(file: string): Promise<any> {
    return new Promise((resolve, reject) => {
      
      this.httpClient.createRequest('http://localhost:3000/audio')
        .asPut()
        .withContent({ audioId: file })
        .send()
        .then(
          (response) => resolve(JSON.parse(response.response)),
          (error) => reject(error)
        );
    });
  }
}
