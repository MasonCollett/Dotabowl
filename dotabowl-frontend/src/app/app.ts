import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AddPlayerComponent } from './add-player/add-player-component';
import { MatchesComponent } from './matches/matches-component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,             
  imports: [
    RouterOutlet,
    AddPlayerComponent,
    MatchesComponent,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']        
})
export class App {
  protected readonly title = signal('D O T A B O W L');
}
