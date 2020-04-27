import { Injectable, Optional } from '@angular/core';
import { CacheService } from '../cache/cache.service';

declare var filestack: any;

export class FilestackUpload {
  filesFailed: Array<any>;
  filesUploaded: Array<any>;
}

const FILESTACK_CONFIG = {
  s3: {
    location: 's3',
    container: 'practera-aus',
    region: 'ap-southeast-2',
    paths: {
      any: '/pe/skills/uploads/',
      image: '/pe/skills/uploads/',
      video: '/pe/skills/video/upload/'
    }
  }
};

const FILESTACK_CONFIG_CN = {
  s3: {
    location: 's3',
    container: 'practera-kr',
    region: 'ap-northeast-2',
    paths: {
      any: '/pe/skills/uploads/',
      image: '/pe/skills/uploads/',
      video: '/pe/skills/video/upload/'
    }
  }
};

@Injectable()
export class FilestackConfig {
  apikey = null;
}

@Injectable()
export class FilestackService {
  private filestack: any;
  version: any;

  constructor(
    private cache: CacheService,
    @Optional() config: FilestackConfig,
  ) {
    this.filestack = filestack.init(config.apikey);
    this.version = filestack.version;
  }

  getS3Config(hash) {
    // Pick the correct config based on geographical location
    const isInChina = this.cache.getLocalObject('country') === 'China';
    const conf = (isInChina ? FILESTACK_CONFIG_CN : FILESTACK_CONFIG).s3;

    // add user hash to the path
    const path = `${conf.paths.any}${hash}/`;
    return {
      location: conf.location,
      container: conf.container,
      region: conf.region,
      path,
    };
  }

  /**
   * display pick/upload popup for file upload,
   * refer to filestack documentation for more config information
   * @link https://www.filestack.com/docs/javascript-api/pick-v3
   * @param  {object} config filestack object
   * @return {Promise} single resolved object
   */
  pick(hash, options?): Promise<any> {
    const config = {
      dropPane: {},
      maxFiles: 5, // default by max 5 files
      storeTo: this.getS3Config(hash),
      fromSources: [
        'local_file_system',
        'googledrive',
        'dropbox',
        'gmail',
        'video'
      ],
    };

    return this.filestack.picker(Object.assign(config, options)).open();
  }

  // single file picker
  // pickV1(config, onSuccess, onError?, onProgress?) {
  //   if (!config) {
  //     config = {
  //       // container: 'modal',
  //       // mimetypes: ['image/*', 'text/*',…],
  //       // maxSize: 1024*1024
  //       services: ['COMPUTER', 'FACEBOOK', 'INSTAGRAM', 'GOOGLE_DRIVE', 'DROPBOX']
  //     };
  //   }

  //   this.filestack.picker(config, onSuccess, onError, onProgress);
  // }

  getSecurity() {
    return this.filestack.getSecurity();
  }

  setSecurity (e) {
    return this.filestack.setSecurity(e);
  }

  storeURL (e, t) {
    return this.filestack.storeURL(e, t);
  }

  transform (e, t) {
    return this.filestack.transform(e, t);
  }

  upload (e, t, n, i) {
    return this.filestack.upload(e, t, n, i);
  }

  retrieve (e, t) {
    return this.filestack.retrieve(e, t);
  }

  remove (e) {
    return this.filestack.remove(e);
  }

  metadata (e, t) {
      return this.filestack.metadata(e, t);
  }
}
