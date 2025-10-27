import { Component } from '@angular/core';
import { AddMatchComponent } from '../add-match/add-match.component';
import { MatchesComponent} from "../matches/matches-component";

@Component({
  selector: 'app-matches-page',
  standalone: true,
  imports: [AddMatchComponent, MatchesComponent, MatchesComponent],
  template: `
    <div class="container mt-3">
      <app-matches></app-matches>
    </div>
  `
})
export class MatchesPageComponent {}
