import { useState } from 'react';
import { MasonryPhotoAlbum } from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

import 'react-photo-album/masonry.css';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

/**
 * A single rendition of one photo. `src` is already an optimized asset URL
 * emitted by Astro at build time — nothing here talks to the image service.
 */
export type GalleryImage = {
  src: string;
  width: number;
  height: number;
};

export type GalleryPhoto = GalleryImage & {
  alt: string;
  /** Narrower renditions for the grid's `srcset`. */
  srcSet: GalleryImage[];
  /** The largest rendition, shown when a photo is opened. */
  full: GalleryImage;
};

type Props = {
  photos: GalleryPhoto[];
  labels: {
    open: string;
    close: string;
    next: string;
    previous: string;
    zoomIn: string;
    zoomOut: string;
    enterFullscreen: string;
    exitFullscreen: string;
  };
};

/**
 * Masonry gallery with a full-screen viewer.
 *
 * The previous gallery was a CSS-only `:target` lightbox: it fixed the opened
 * image at `scale(1.5)` with no zoom, no swipe, no escape key, and its "close"
 * link navigated to `href=""` — which on a tour page meant reloading the page.
 * It also forced every tile to one aspect ratio, so portrait shots were
 * centre-cropped into landscape.
 *
 * `react-photo-album` and `yet-another-react-lightbox` are by the same author
 * and are designed to compose: the album computes a true masonry layout from
 * each photo's real dimensions, and the lightbox brings pinch-zoom, drag-pan,
 * swipe between slides, keyboard control and a focus trap — the parts that
 * make a gallery usable on a phone and that CSS alone cannot provide.
 */
export default function PhotoGallery({ photos, labels }: Props) {
  const [index, setIndex] = useState(-1);

  if (photos.length === 0) return null;

  return (
    <>
      <MasonryPhotoAlbum
        photos={photos.map((photo, i) => ({
          key: `${photo.src}-${i}`,
          src: photo.src,
          width: photo.width,
          height: photo.height,
          alt: photo.alt,
          srcSet: photo.srcSet,
          label: labels.open
        }))}
        // Mobile first: one column on a phone is not a grid, and three is a
        // contact sheet — two columns keeps each photo big enough to read.
        columns={(containerWidth) => {
          if (containerWidth < 480) return 2;
          if (containerWidth < 900) return 3;
          return 4;
        }}
        spacing={12}
        // Tells the browser how wide a tile will actually be, so it picks the
        // right rendition from `srcSet` instead of always taking the largest.
        sizes={{
          size: '1140px',
          sizes: [
            { viewport: '(max-width: 479px)', size: 'calc(50vw - 24px)' },
            { viewport: '(max-width: 899px)', size: 'calc(33vw - 24px)' },
            { viewport: '(max-width: 1199px)', size: 'calc(25vw - 24px)' }
          ]
        }}
        // Server-rendered at this width so the grid is visible and
        // crawlable before hydration, rather than collapsing to nothing.
        defaultContainerWidth={1140}
        onClick={({ index: current }) => setIndex(current)}
        render={{
          image: (props, { photo }) => (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img
              {...props}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              // Appended, not replaced: the album's own class is what sizes
              // the image to its column. Overwriting `className` outright left
              // photos rendering at their intrinsic width inside the tile.
              className={[props.className, 'gallery-tile']
                .filter(Boolean)
                .join(' ')}
            />
          )
        }}
      />

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos.map((photo) => ({
          src: photo.full.src,
          alt: photo.alt,
          width: photo.full.width,
          height: photo.full.height,
          srcSet: [...photo.srcSet, photo.full]
        }))}
        plugins={[Zoom, Fullscreen, Thumbnails, Counter]}
        // Below 3 slides the thumbnail strip is just chrome over the photo.
        thumbnails={{ showToggle: true, hidden: photos.length < 3 }}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
        carousel={{ finite: photos.length <= 1, padding: 0 }}
        // The backdrop belongs on the root's own custom property — setting it
        // on `container` left the toolbar strip transparent, so page copy read
        // straight through the top of the viewer. Fully opaque, not 96%: over
        // a white page even 4% is enough for body text to read through, and a
        // photo shown at max size should have nothing behind it.
        styles={{ root: { '--yarl__color_backdrop': '#0a0f0c' } }}
        labels={{
          Close: labels.close,
          Next: labels.next,
          Previous: labels.previous,
          'Zoom in': labels.zoomIn,
          'Zoom out': labels.zoomOut,
          'Enter Fullscreen': labels.enterFullscreen,
          'Exit Fullscreen': labels.exitFullscreen
        }}
        animation={{ fade: 200, swipe: 300 }}
      />
    </>
  );
}
