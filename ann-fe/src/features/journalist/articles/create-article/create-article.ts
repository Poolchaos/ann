import { autoinject } from 'aurelia-framework';
import {
  ValidationControllerFactory,
  ValidationController,
  validateTrigger
} from 'aurelia-validation';
import { Router } from 'aurelia-router';

import { ArticleService } from '../articles-service';

@autoinject()
export class CreateArticle {

  public title: string;
  public category: string;
  public submitted: boolean = false;
  private fileContents: {
    name: string;
    data: string | ArrayBuffer;
    type: string;
    size: string;
  }[] = [];
  
  private validation: ValidationController;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    validationControllerFactory: ValidationControllerFactory
  ) {
    this.validation = validationControllerFactory.createForCurrentScope();
    this.validation.validateTrigger = validateTrigger.change;
  }

  public selectionChanged(event: Event): void {
    this.fileContents = [];
    // @ts-ignore
    const files = event.target.files;
    console.log(' ::>> files >>> ', files);
    if (files.length > 0) {
      console.log(' ::>> has files >>> ', typeof files);
      let list = Object.keys(files);

      list.forEach(key => {
        let file = files[key];
        console.log(' ::>> file >>> ', file);
        
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (evt: any) => {
          try {
            this.fileContents.push({
              name: file.name,
              data: reader.result,
              type: file.type,
              size: file.size
            });
          } catch(e) {
            console.warn('::>> Failed to parse uploaded file ', evt);
          }
        }
        reader.onerror = (evt: any) =>  {
            console.warn('::>> Failed to upload file ', evt);
        }
      });
    }
  }
  
  public createArticle(): void {
    let element: any = document.querySelector('#x');
    let content = element.value;

    // todo: validate

    if (content) {
      const messageContent = content.replace(/<div>|<\/div>/gi, '');
      const payload = {
        title: this.title,
        category: this.category,
        content: messageContent,
        files: this.fileContents
      };

      console.log(' ::>> payload >>> ', payload);

      this.articleService
        .createArticle(
          this.title,
          this.category,
          messageContent
        )
        .then((article: { articleId: string }) => {
          console.log(' ::>> article created >>>> ');
            this.uploadAudio(article.articleId);
        })
        .catch(error => {
          console.log(' ::>> failed to create article >>>> ');
        });
    }
  }

  private uploadAudio(articleId: string): void {
    if (this.fileContents.length > 0) {
      let uploadCount = 0;
      // todo: base64 

      this.fileContents.forEach(file => {
        this.articleService
          .uploadAudio(
            { ...file, articleId },
            data => this.fileUploadProgressCallback(data)
          )
          .then(() => {
            console.log(' ::>> uplaoded ');
            uploadCount++;

            if (uploadCount >= this.fileContents.length) {
              this.handleArticleCreated();
            }

          })
          .catch(() => {
            console.log(' ::>> failed to uplaod ');
          });
      });
    } else {
      this.handleArticleCreated();
    }
  }

  private handleArticleCreated(): void {
    // todo: do something here. Route or notify of upload complete
    // this.router.navigate('articles');
  }

  private fileUploadProgressCallback(data: any): void {
    console.log(' ::>> fileUploadProgressCallback >>>> ', data);
  }
}