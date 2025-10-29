import { Component } from '@angular/core';
import { AddMatchComponent } from '../add-match/add-match.component';
import { MatchesComponent} from "../matches/matches-component";

@Component({
  selector: 'app-matches-page',
  standalone: true,
  imports: [ MatchesComponent],
  templateUrl: './matches-page.component.html',
  styleUrl: './matches-page.component.css',

})
export class MatchesPageComponent {}
