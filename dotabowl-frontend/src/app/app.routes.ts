import { Routes } from '@angular/router';
import { AddMatchComponent } from './add-match/add-match.component';
import { PlayersComponent } from './players/players.component';
import { MatchesPageComponent } from './matches-page.component/matches-page.component';

export const routes: Routes = [
    { path: 'matches', component: MatchesPageComponent },
    { path: 'players', component: PlayersComponent },
    { path: '**', redirectTo: 'matches' }
];

