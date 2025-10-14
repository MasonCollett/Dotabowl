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
    return (match.radiantPlayers || []).map(p => p.playerName).sort().join(', ');
  }

  getDireNames(match: Match): string {
    return (match.direPlayers || []).map(p => p.playerName).sort().join(', ');
  }

//   typeOptions = ['Ability Draft', 'ADAR', 'All Pick', 'All Random', 'Captains Draft', 'Single Draft', 'Turbo']

  getTypeColor(type: string): string {
    switch(type) {
      case 'Ability Draft': return 'match-type-teal';
      case 'ADAR': return 'match-type-green';
      case 'All Pick': return 'match-type-yellow';
      case 'All Random': return 'match-type-pink';
      case 'Captains Draft': return 'match-type-orange';
      case 'Single Draft': return 'match-type-purple';
      case 'Turbo': return 'match-type-rainbow';
      default: return 'match-type-white';
    }
  }

    getWinnerColor(type: string): string {
    switch(type) {
      case 'Dire': return 'winner-dire';
      case 'Radiant': return 'winner-radiant';

      default: return 'match-type-white';
    }
  }
}
