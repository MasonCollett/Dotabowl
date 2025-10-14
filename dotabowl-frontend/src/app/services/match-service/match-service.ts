import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface MatchParticipant {
  playerId: number;
  team: string;
  isWinner: boolean;
  playerName?: string; // optional if you fetch Player info separately
}

export interface Match {
  id?: number;
  length: string;
  type: string;

  winner: string;
  radiantKills: number;

  direKills: number;

  date: string; 
  participants?: MatchParticipant[];

  radiantPlayers?: MatchParticipant[];
  direPlayers?: MatchParticipant[];
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private apiUrl = '/api/match';

  private matchesSubject = new BehaviorSubject<Match[]>([]);
  matches$ = this.matchesSubject.asObservable();

  constructor(private http: HttpClient) { }

  loadMatches(): void {
    this.http.get<Match[]>(this.apiUrl).subscribe(matches => {
      this.matchesSubject.next(matches);
    });
  }

  addMatch(match: Match): void {
    this.http.post<Match>(this.apiUrl, match).subscribe({
      next: addedMatch => {
        const current = this.matchesSubject.value;
        this.matchesSubject.next([...current, addedMatch]);
      },
      error: err => console.error('Failed to add match', err)
    });
  }

  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }
}
