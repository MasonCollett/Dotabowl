import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatchService, Match, MatchParticipant } from '../services/match-service/match-service';
import { AddMatchComponent } from '../add-match/add-match.component';
import { HttpClient } from '@angular/common/http';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [FormsModule, CommonModule, AddMatchComponent],
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  matches: Match[] = [];

  private playersSubject = new BehaviorSubject<{ id: number; name: string }[]>([]);
  players$ = this.playersSubject.asObservable();

  constructor(private matchService: MatchService, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{ id: number; name: string }[]>('/api/players').subscribe({
      next: data => this.playersSubject.next(data),
      error: err => console.error('Failed to load players', err)
    });

    // Combine matches and players streams
    combineLatest([this.matchService.matches$, this.players$])
      .pipe(
        map(([matches, players]) =>
          matches.map(m => {
            const participantsWithNames: MatchParticipant[] = m.participants?.map(p => ({
              ...p,
              playerName: players.find(pl => pl.id === p.playerId)?.name || p.playerId.toString()
            })) || [];

            return {
              ...m,
              participants: participantsWithNames,
              radiantPlayers: participantsWithNames.filter(p => p.team === 'Radiant'),
              direPlayers: participantsWithNames.filter(p => p.team === 'Dire')
            };
          })
        )
      )
      .subscribe(mappedMatches => {
        this.matches = mappedMatches;
      });

    // Load matches
    this.matchService.loadMatches();
  }

  getRadiantNames(match: Match): string {
    return (match.radiantPlayers || []).map(p => p.playerName).join(', ');
  }

  getDireNames(match: Match): string {
    return (match.direPlayers || []).map(p => p.playerName).join(', ');
  }
}
