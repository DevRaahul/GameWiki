import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Game } from '../../models/game';
import { GameService } from '../../sevices/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
})
export class GameDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private actiRout: ActivatedRoute,
    private $gameService: GameService
  ) {}
  ngOnDestroy(): void {
    this.gameSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  public gameRating: any = 0;
  gameId: string;
  gameDetails: Game;
  routeSub: Subscription;
  gameSub: Subscription;

  ngOnInit(): void {
    this.routeSub = this.actiRout.params.subscribe((params: Params) => {
      this.gameId = params['id'];
    });

    if (this.gameId) {
      this.gameById(this.gameId);
    }
  }
  gameById(gameId: string) {
    this.gameSub = this.$gameService
      .getGameDetails(this.gameId)
      .subscribe((res: Game) => {
        this.gameDetails = res;

        setTimeout(() => {
          this.gameRating = this.gameDetails.metacritic;
        }, 1000);
      });
  }

  colorSelector = (data: number): string => {
    if (data > 75) return '#5ee432';
    if (data > 50) return '#fffa50';
    if (data > 75) return '#f7aa38';

    return '#ef4655';
  };
}
