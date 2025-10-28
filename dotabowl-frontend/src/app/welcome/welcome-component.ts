import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
export class WelcomeComponent {
  cards = [
    {
      title: 'MVP of the Week',
      subtitle: 'Invoker dominates again',
      image: 'assets/images/invoker.jpg',
      description: '25 kills, 2 deaths'
    },
    {
      title: 'Epic Match',
      subtitle: 'Terrorblade vs Phantom Lancer',
      image: 'assets/images/terrorblade.jpg',
      description: 'A battle of illusions that came down to the final second.'
    },
    {
      title: 'Top Support',
      subtitle: 'Crystal Maiden’s Redemption Arc',
      image: 'assets/images/crystalmaiden.jpg',
      description: 'Saved 7 teammates with clutch Frostbite + Glimmer Cape plays.'
    }
  ];
}
