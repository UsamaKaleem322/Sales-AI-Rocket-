import createCache from '@emotion/cache';

const isBrowser = typeof document !== 'undefined';

export default function createEmotionCache(options = { key: 'mui' }) {
  let insertionPoint;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      `meta[name="emotion-insertion-point"]`,
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ key: options.key, insertionPoint });
}