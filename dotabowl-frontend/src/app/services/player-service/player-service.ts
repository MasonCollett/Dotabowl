import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Player {
  id?: number;
  name: string;
  steamName: string;

  wins: number;
  losses: number;
  games: number;

  adWins: number;
  adLosses: number;
  adGames: number;

  totalGames: number;

  winRate: number; // decimal(5,2) on backend
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private apiUrl = '/api/players';

  constructor(private http: HttpClient) { }

  addPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(this.apiUrl, player);
  }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }
}

