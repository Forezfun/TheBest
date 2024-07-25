import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/client-side/app.component';
import { config } from './app/client-side/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
