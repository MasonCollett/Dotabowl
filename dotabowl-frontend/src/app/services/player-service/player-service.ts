import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Player {
  name: string;
  steamName: string;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  totalGameTime: number;
  profilePictureUrl: string;
  turboWins: number;
  turboLosses: number;
  singleDraftWins: number;
  singleDraftLosses: number;
  singleDraftGames: number;
  adarWins: number;
  adarLosses: number;
  adarGames: number;
  allPickWins: number;
  allPickLosses: number;
  allPickGames: number;
  allRandomWins: number;
  allRandomLosses: number;
  allRandomGames: number;
  captDraftWins: number;
  captDraftLosses: number;
  captDraftGames: number;
  randomDraftWins: number;
  randomDraftLosses: number;
  randomDraftGames: number;
  totalGames: number;
  adWins: number;
  adLosses: number;
  adGames: number;
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

