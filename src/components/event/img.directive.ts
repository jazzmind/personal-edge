import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'img[src]',
  host: {
    '[src]': 'src',
    '(error)': 'handleError()',
  },
})

export class ImgDirective {
  @Input() src: string;

  // Handle error when:
  // - broken link
  // - bad image
  handleError() {
    this.src = '';
  }
}
