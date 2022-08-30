export interface ImageSrcSetSource {
  media: string | null
  srcset: string
}

export interface ImageSrcSet {
  source: Array<ImageSrcSetSource>
  src: string
}

export interface MediaSize {
  breakPoint: string
  size: string
}

const breakPoints = {
  $xl: '',
  $md: '1279',
  $sm: '767',
}

class ResponsiveImage {
  private _DEFAULT_FILE_FORMAT = 'webp'
  private _SUPPORTED_DPR = 3
  private _IMGIX_AUTO_SETTINGS = 'auto=format'

  constructor(private $imagePath: string, private $mediaSizes: Array<MediaSize>, private $width: string | number) {}

  createImgixSet(): ImageSrcSet {
    if (!this.$mediaSizes.length) return this._defaultSrcSet()
    return this._mediaSrcSet()
  }

  private _dprSet(format: string, width: string | number = this.$width): string {
    let dprArr: string = ''
    for (let i = 1; i <= this._SUPPORTED_DPR; i++) {
      const isLast = i === this._SUPPORTED_DPR
      dprArr += `${this.$imagePath}?${this._IMGIX_AUTO_SETTINGS}&fm=${format}&width=${width}&dpr=${i} ${i}x ${
        isLast ? '' : ','
      }`
    }
    return dprArr
  }

  private _defaultSrcSet(): ImageSrcSet {
    return {
      source: [
        {
          media: null,
          srcset: this._dprSet(this._DEFAULT_FILE_FORMAT),
        },
      ],
      src: `${this.$imagePath}?${this._IMGIX_AUTO_SETTINGS}&width=${this.$width}`,
    }
  }

  private _mediaSrcSet(): ImageSrcSet {
    const arraySet: ImageSrcSet = {
      source: [],
      src: `${this.$imagePath}?${this._IMGIX_AUTO_SETTINGS}&width=${this.$width}`,
    }
    const mediaSizes = [...this.$mediaSizes, { size: this.$width, breakPoint: '$xl' }]
    for (const media of mediaSizes) {
      arraySet.source.push({
        // @ts-ignore
        media: breakPoints[media.breakPoint] === '' ? null : `(max-width: ${breakPoints[media.breakPoint]}px)`,
        srcset: this._dprSet(this._DEFAULT_FILE_FORMAT, media.size),
      })
    }
    return arraySet
  }
}

export default ResponsiveImage
