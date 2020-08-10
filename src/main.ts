import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';

if (process.env.NODE_ENV !== 'development') {
    enableProdMode();
}

platformBrowser().bootstrapModule(AppModule)
                 .catch(console.error);
