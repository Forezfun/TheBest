import { Injectable } from '@angular/core';
import compress from 'compress-base64';
@Injectable({
  providedIn: 'platform'
})
export class ImageControlService {
  async compressBase64(readerResult: string) {
    const COMPRESSED_STRING = await compress(readerResult, {
      width: 350,
      type: 'image/png'
    }).then(result => {
      return result
    }).catch(() => {
      return readerResult
    })
    return COMPRESSED_STRING
  }
}
