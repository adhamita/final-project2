import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
@Injectable({
  providedIn: "root",
})
export class LanguagesService {
constructor(private translate: TranslateService, @Inject(PLATFORM_ID) private platformId: string) {
    this.translate.addLangs(['ar', 'en']);
        this.translate.use('en');
        if(isPlatformBrowser(this.platformId)){
            this.changeDirection('ar');
        }
}
   
changeLang(lang:string){
        this.translate.use(lang);
    this.changeDirection(lang);
    }



changeDirection(lang:string){
        const direction = lang === 'ar' ? 'rtl' : 'ltr';
        document.querySelector('html')!.dir = direction;
    }
}
