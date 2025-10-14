import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddPlayerComponent } from './add-player/add-player-component';
import { MatchesComponent } from './matches/matches-component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-root',
  standalone: true,             
  imports: [
    RouterOutlet,
    AddPlayerComponent,
    MatchesComponent,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']        
})
export class App {
  protected readonly title = signal('dotabowl-frontend');
}
