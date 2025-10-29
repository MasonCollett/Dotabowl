import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HighlightService } from '../services/highlight-service/highlight.service';
import { PlayerService } from '../services/player-service/player-service';
import { MatchService } from '../services/match-service/match-service';
import { combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './welcome-component.html',
  styleUrl: './welcome-component.css'
})
export class WelcomeComponent implements OnInit {
  cards: any[] = [];
  totalMatchesPlayed$!: Observable<number>;
  totalGameTime$!: Observable<{ hours: number; minutes: number }>;
  totalGameTimeHours$!: Observable<number>;



  constructor(
    private highlightService: HighlightService,
    private playerService: PlayerService,
    private matchService: MatchService
  ) {}

  ngOnInit() {
    this.totalMatchesPlayed$ = this.matchService.getMatches().pipe(
      map(matches => matches.length)
    );

    this.totalGameTimeHours$ = this.playerService.getPlayers().pipe(
      map(players => {
        const totalMinutesDecimal = players.reduce((sum, player) => {
          const minutes = player.totalGameTime || 0;
          return sum + minutes;
        }, 0);
        return Math.round((totalMinutesDecimal / 60) * 10) / 10;
      })
    );


    this.totalGameTime$ = this.playerService.getPlayers().pipe(
      map(players => {
        const totalMinutesDecimal = players.reduce((sum, player) => {
          const minutes = player.totalGameTime || 0;
          return sum + minutes;
        }, 0);

        const hours = Math.floor(totalMinutesDecimal / 60);
        const minutes = Math.round(totalMinutesDecimal % 60);
        return { hours, minutes };
      })
    );

    combineLatest([
      this.playerService.getPlayers(),
      this.matchService.getMatches()
    ]).subscribe(([players, matches]) => {
      this.cards = this.highlightService.getHighlights(players, matches);
    });
  }
}
