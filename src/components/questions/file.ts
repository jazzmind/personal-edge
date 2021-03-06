import { Component, Input, OnInit, NgZone } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { FilestackService, FilestackUpload } from '../../shared/filestack/filestack.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { PreviewComponent } from '../preview/preview.component';
import { WindowRef } from '../../shared/window';
import { CacheService } from '../../shared/cache/cache.service';

import * as _ from 'lodash';

@Component({
  selector: 'file-question',
  templateUrl: './file.html',
})
export class FileQuestionComponent implements OnInit {
  @Input() question;
  @Input() disabled;
  @Input() form: FormGroup;

  uploaded: any; // uploaded file (support single only)
  // uploaded: Array<any> = []; // uploaded files

  constructor(
    private fs: FilestackService,
    private zone: NgZone,
    private modalCtrl: ModalController,
    private win: WindowRef,
    private utils: UtilsService,
    private cache: CacheService,
  ) {}

  /**
   * @description at file type question initiation,
   * uploaded files is retrieved from cached form  (if available)
   */
  ngOnInit() {
    this.uploaded = _.isEmpty(this.form.controls.answer.value) ? false : this.form.controls.answer.value;
  }

  /**
   * @description Upload file and trigger ngzone to update this.uploaded variable
   */
  async upload(event) {
    let self = this;

    const user = this.cache.getLocalObject('user');
    const fs = await this.fs.pick(user.userhash, {
      maxFiles: 1, // default by max 5 files
      onUploadDone: (response) => {
        if (response.filesUploaded && response.filesUploaded[0]) {
          self.zone.run(() => {
            const file = response.filesUploaded[0]; // pick the first file
            file.icon = self.utils.getIcon(file.mimetype);
            self.uploaded = file;
            this.form.controls.answer.setValue(self.uploaded);
          });
        }

        return this.pickUploaded(response);
      },
      onFileUploadFailed: (err) => {
        console.log(err);
      }
    });

    return fs;
  }

  /**
   * @name viewUploaded
   * @description preview viewable file, otherwise force download
   * @param {Object} uploaded singled uploaded filestack file object
   */
  viewUploaded(uploaded) {
    if (!this.utils.isViewable(uploaded.mimetype)) {
      let win = this.win.nativeWindow;
      let openedWindow = win.open(uploaded.url, '_blank');
    } else {
      let previewModal = this.modalCtrl.create(PreviewComponent, {file: uploaded});
      previewModal.present();
    }
  }

  private pickUploaded(uploaded) {
    let self = this;
    if (uploaded.filesUploaded.length > 0) {
      let file = uploaded.filesUploaded.shift();
      file.icon = self.utils.getIcon(file.mimetype);

      // post_assessment_submission API requirement "key"
      file.key = file.handle;

      self.uploaded = file;
      this.form.controls.answer.setValue(self.uploaded);
    }

    if (uploaded.filesFailed.length > 0) {
      console.log(uploaded.filesFailed.length, ' file(s) not uploaded.');
    }
  }

  private injectIcon = (files: any[]) => {
    let result = [];
    files.forEach((file, index) => {
      file.icon = this.utils.getIcon(file.mimetype);
      result.push(file);
    });

    return result;
  };
}
