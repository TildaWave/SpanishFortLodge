import { NewsComponent } from './news/news.component';
import { EventsComponent } from './events/events.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'About', component: AboutComponent
  },
  {
    path: 'Events', component: EventsComponent
  },
  {
    path: 'News', component: NewsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
