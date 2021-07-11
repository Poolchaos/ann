import { autoinject } from 'aurelia-framework';
import {
  ValidationControllerFactory,
  ValidationController,
  validateTrigger
} from 'aurelia-validation';
import { Router } from 'aurelia-router';

import { ArticleService } from '../articles-service';
import { DataStore } from 'stores/data-store';

@autoinject()
export class CreateArticle {

  private articleId: string;
  public title: string;
  public category: string;
  public submitted: boolean = false;
  private fileContents: {
    _id?: string;
    audioId?: string;
    name: string;
    data: string | ArrayBuffer;
    type: string;
    size: string;
    toBeRemoved?: boolean;
  }[] = [];
  private originalFileContents: {
    name: string;
    data: string | ArrayBuffer;
    type: string;
    size: string;
  }[] = [];
  private validation: ValidationController;
  private ready: boolean = false;

  public categoriesVisible: boolean = false;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private dataStore: DataStore,
    validationControllerFactory: ValidationControllerFactory
  ) {
    this.validation = validationControllerFactory.createForCurrentScope();
    this.validation.validateTrigger = validateTrigger.change;
  }

  public activate(params?: { articleId: string }): any {
    if (location.href.includes('/edit-article?') && this.dataStore.isJournalist) {
      this.articleId = params.articleId;
      this.retrieveArticle();
    } else {
      this.ready = true;
    }
  }

  private retrieveArticle() {
    if (!this.articleId) {
      return this.router.navigate('dashboard')
    }
    
    this.articleService
      .retrieveArticle(this.articleId)
      .then((article) => {
        console.log(' ::>> article retrieved >>>> ', article);
        
        this.title = article.name;
        this.category = article.category;
        this.originalFileContents = JSON.parse(JSON.stringify(article.files));
        this.fileContents = article.files;

        let element: any = document.querySelector('#x');
        element.value = article.content;

        this.ready = true;
      });
  }

  public removeAudio(id: string): void {
    console.log(' ::>> removeAudio >>>>> ', id, this.fileContents);
    this.fileContents.forEach(file => {
      if (file._id === id) {
        file.toBeRemoved = true;
      }
    });
  }

  public toggleCategories(): void {
    this.categoriesVisible = !this.categoriesVisible;
  }

  private hideCategories(): void {
    this.categoriesVisible = false;
  }

  public selectCategory(category: string, event): void {
    event.stopPropagation();
    this.hideCategories();
    this.category = category;
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

  public submitForm(): void {
    if (this.dataStore.isJournalist && location.href.includes('/edit-article?') && this.articleId) {
      this.updateArticle();
    } else {
      this.createArticle();
    }
  }
  
  private createArticle(): void {
    let element: any = document.querySelector('#x');
    let content = element.value;

    // todo: validate

    if (content) {
      const messageContent = content.replace(/<div>|<\/div>/gi, '');

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

  private updateArticle(): void {
    let element: any = document.querySelector('#x');
    let content = element.value;
    
    // todo: validate

    if (content) {
      const messageContent = content.replace(/<div>|<\/div>/gi, '');
     
      this.articleService
        .updateArticle(
          this.articleId,
          this.title,
          this.category,
          messageContent
        )
        .then((article: { articleId: string }) => {
          console.log(' ::>> article created >>>> ');
          // todo: resolve race condition to update state
          // maybe stay on view and clear state
          // notify of updated/completed
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
      console.log(' ::>> this.fileContents >>>>> ', {
        fileContents: this.fileContents,
        originalFileContents: this.originalFileContents
      }, (JSON.stringify(this.originalFileContents) === JSON.stringify(this.fileContents)));

      if (JSON.stringify(this.originalFileContents) === JSON.stringify(this.fileContents)) {
        return this.handleArticleCreated();
      }

      // todo: cater for removing an audio file

      this.fileContents.forEach(file => {
        if (!this.originalFileContents.includes(file)) {

          if (file.toBeRemoved) {
            this.articleService
              .removeAudio(this.articleId, file._id, file.audioId)
              .then(() => {
                uploadCount++;
  
                if (uploadCount >= this.fileContents.length) {
                  this.handleArticleCreated();
                }
  
              })
              .catch(() => {
                console.log(' ::>> failed to uplaod ');
              });

            return;
          }

          this.articleService
            .uploadAudio(
              {name: file.name, data: file.data, type: file.type, size: file.size, articleId},
              data => this.fileUploadProgressCallback(data)
            )
            .then(() => {
              uploadCount++;

              if (uploadCount >= this.fileContents.length) {
                this.handleArticleCreated();
              }

            })
            .catch(() => {
              console.log(' ::>> failed to uplaod ');
            });
        }
      });
    } else {
      this.handleArticleCreated();
    }
  }

  private handleArticleCreated(): void {
    this.router.navigate('articles');
  }

  private fileUploadProgressCallback(data: any): void {
    console.log(' ::>> fileUploadProgressCallback >>>> ', data);
    // todo: implement file upload progress
  }

  public cancel(): void {
    this.router.navigate('articles');
  }
}