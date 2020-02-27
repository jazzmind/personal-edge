import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const zipMime = [
  'application/x-compressed',
  'application/x-zip-compressed',
  'application/zip',
  'multipart/x-zip',
];

@Injectable()
export class UtilsService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {

  }

  changeThemeColor(color) {
    this.document.documentElement.style.setProperty('$primary', color);
    // this.document.documentElement.style.setProperty('$primary-shade', color);
    // get the tint version of the color(20% opacity)
    // this.document.documentElement.style.setProperty('$primary-tint', color + '33');
    // convert hex color to rgb and update css variable
    const hex = color.replace('#', '');
    const red = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4, 6), 16);

    this.document.documentElement.style.setProperty('$primary-rgb', red + ',' + green + ',' + blue);
  }

  getIcon(mimetype: string) {
    let result: string = '';

    if (zipMime.indexOf(mimetype) >= 0) {
      result = 'fa-zip';

    // set icon to different document type (excel, word, powerpoint, audio, video)
    } else if (mimetype.indexOf('audio/') >= 0) {
      result = 'fa-sound';
    } else if (mimetype.indexOf('image/') >= 0) {
      result = 'fa-image';
    } else if (mimetype.indexOf('text/') >= 0) {
      result = 'fa-text';
    } else if (mimetype.indexOf('video/') >= 0) {
      result = 'fa-movie';
    } else {
      switch (mimetype) {
        case 'application/pdf':
          result = 'fa-pdf';
          break;
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          result = 'fa-word';
          break;
        case 'application/excel':
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/x-excel':
        case 'application/x-msexcel':
          result = 'fa-excel';
          break;
        case 'application/mspowerpoint':
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'application/x-mspowerpoint':
          result = 'fa-powerpoint';
          break;
        default:
          result = 'fa-file';
          break;
      }
    }

    return result;
  }

  isCompressed(type: string) {
    if (zipMime.indexOf(type) >= 0) {
      return true;
    }
    return false;
  }

  // check if a file could be previewed (eg. zip or unknown file is not viewable)
  isViewable(type: string) {
    let result = true;
    if (this.isCompressed(type)) {
      result = false;
    }
    if (result && (this.getIcon(type) === 'fa-file' || this.getIcon(type) === 'fa-movie' || this.getIcon(type) === 'fa-sound')) {
      result = false;
    }
    return result;
  }
}
