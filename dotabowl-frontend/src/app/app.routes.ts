import { Routes } from '@angular/router';
import { AddMatchComponent } from './add-match/add-match.component';
import { PlayersComponent } from './players/players.component';
import { MatchesPageComponent } from './matches-page.component/matches-page.component';
import { WelcomeComponent } from './welcome/welcome-component';
import { AboutComponent } from './about-component/about-component';

export const routes: Routes = [
    { path: 'matches', component: MatchesPageComponent },
    { path: 'players', component: PlayersComponent },
    { path: 'welcome', component: WelcomeComponent},
    { path: 'about', component: AboutComponent},
    { path: '', component: WelcomeComponent},
    { path: '**', redirectTo: 'welcome' }
];

