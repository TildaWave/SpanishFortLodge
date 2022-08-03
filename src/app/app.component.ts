import { ApplicationInsightsService } from './application-insights.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Spanish Fort Lodge No. 916';

  constructor(private applicationInsightsService: ApplicationInsightsService) {
  }
}
