import { Inject, Input, Component } from '@angular/core';

@Component({
  selector: 'score-board',
  templateUrl: './score-board.html'
})

export class ScoreBoardComponent {
  @Input() experienceBackgroundUrl;
  @Input() openEvent;
  @Input() bookedEventsCount;
  @Input() sameFontSize;
  @Input() openLeaderboard;
  @Input() userExperiencePoint;
  @Input() experiencePrimaryColor;
  @Input() characterCurrentExperience;
  @Input() openPortfolio;
  @Input() show_badge;
  @Input() finalAverageScoreShow;
  @Input() view_portfolio;
  @Input() portfolio_request;
  @Input() whatsThis;

  constructor() {}
}
