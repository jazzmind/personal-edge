import { Component, Input, OnInit, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilestackService, FilestackUpload } from '../../shared/filestack/filestack.service';
import { UtilsService } from '../../shared/utils/utils.service';
import * as _ from 'lodash';

@Component({
  selector: 'file-question',
  templateUrl: './file.html'
})
export class FileQuestionComponent implements OnInit {
  @Input() question;
  @Input() disabled;
  @Input() form: FormGroup;

  uploaded: any; // uploaded file (support single only)
  // uploaded: Array<any> = []; // uploaded files

  constructor(
    private fs: FilestackService,
    private util: UtilsService,
    private zone: NgZone
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
  upload(event) {
    let self = this;

    this.fs.pickV1(null, (uploaded) => {
      self.zone.run(() => {
        let file = uploaded;
        file.icon = self.util.getIcon(file.mimetype);
        self.uploaded = file;
        this.form.controls.answer.setValue(self.uploaded);
      });
    }, err => {
      console.log(err.code);
    });
  }

  private pickUploaded(uploaded) {
    if (uploaded.filesUploaded.length > 0) {
      let file = uploaded.filesUploaded.shift();
      file.icon = self.util.getIcon(file.mimetype);

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
      file.icon = this.util.getIcon(file.mimetype);
      result.push(file);
    });

    return result;
  };
}
