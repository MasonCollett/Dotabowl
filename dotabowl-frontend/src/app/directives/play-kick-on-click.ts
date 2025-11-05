import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPlayKickOnClick]',
  standalone: true
})
export class PlayKickOnClick {
  @Input() soundSrc: string = 'assets/sounds/kick.mp3';

  private audio = new Audio();

  constructor(private el: ElementRef<HTMLImageElement>) {}

 @HostListener('click')
  onClick() {
    const imgSrc = this.el.nativeElement.src;

    if (imgSrc.includes('donnie.jpg')) {
      this.audio.src = this.soundSrc;
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {
        console.warn('Audio playback failed (maybe blocked until user interacts).');
      });
    }
  }
}
