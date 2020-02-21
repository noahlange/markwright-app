import { ProjectMetadata } from '@common/types';
import size, { PaperSize } from 'paper-size';

interface PaperDimensions {
  width: string;
  height: string;
}

export const defaults: ProjectMetadata = {
  columns: 1,
  dpi: 96,
  manual: false,
  margins: {
    bottom: '1.125in',
    inner: '0.875in',
    outer: '1.125in',
    top: '1.125in'
  },
  paper: {
    width: '8.5in',
    height: '11in'
  }
};

export function variables(user: ProjectMetadata): string {
  const metadata = { ...defaults, ...user };
  const margins = { ...defaults.margins, ...metadata.margins };
  const paper: PaperSize | PaperDimensions = metadata.paper || defaults.paper;
  const columns = metadata.columns || defaults.columns;

  const { count, gutter } =
    typeof columns === 'number' ? { count: columns, gutter: 0 } : columns;

  const [width, height] =
    typeof paper === 'string'
      ? size.getSize(paper)
      : [paper.width, paper.height];

  return Object.entries({
    $dpi: metadata.dpi,
    '$margin-outer': margins.outer,
    '$margin-inner': margins.inner,
    '$margin-top': margins.top,
    '$margin-bottom': margins.bottom,
    '$page-width': typeof width === 'string' ? width : width + 'mm',
    '$page-height': typeof height === 'string' ? height : height + 'mm',
    '$page-inner-width': '$page-width - $margin-inner - $margin-outer',
    '$page-inner-height': '$page-height - $margin-top - $margin-bottom',
    '$column-count': count,
    '$column-gutter': gutter,
    '$column-height': '$page-inner-height',
    '$column-width':
      '($page-inner-width / $column-count) + $column-gutter * ($column-count - 1)'
  }).reduce((a, [key, value]) => a + `${key}: ${value};\n`, '');
}

export function document(): string {
  return `
    @mixin page-align($orientation, $align, $left, $right) {
    &.#{$orientation} {
      .header,.pagination {
        margin-left: $left;
        margin-right: $right;
        text-align: left;
      }

      .body {
        margin-left: $left;
        margin-right: $right;
      }
    }
  }

  .page {
    @include page-align('even', right, $margin-inner, $margin-outer);
    @include page-align('odd', left, $margin-outer, $margin-inner);

    height: $page-height;
    width: $page-width;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    font-size: 1rem;
    overflow: hidden;
    page-break-after: always;
    position: relative;
  }

  .page-display {
    display: flex;
    & > div {
      margin-right: 1rem;
    }
  }

  .section {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    & > div {
      outline: none;
    }
  }

  .pagination {
    height: 1rem;
    margin-top: calc((#{$margin-bottom} - 1rem) / 2);
    margin-bottom: calc((#{$margin-bottom} - 1rem)  / 2);
  }

  .header {
    height: 1rem;
    margin-top: calc((#{$margin-top} - 1rem) / 2);
    margin-bottom: calc((#{$margin-top} - 1rem) / 2);
  }

  .body {
    display: flex;
    flex-basis: $column-height;
    flex-direction: column;
    width: $page-inner-width;

    .content {
      display: flex;
      flex-direction: row;
      flex-grow: 1;
      overflow: hidden;

      .column {
        flex: 0 0 $column-width;
        width: $column-width;
        min-height: $column-height;
        height: $column-height;
        word-wrap: break-word;
      }

      .column-separator {
        border: none;
        display: block;
        flex: 0 0 $column-gutter;
        height: 100%;
        margin: 0;
      }
    }
  }`;
}

export function markwright(): string {
  return `
    @import 'variables';
    @import 'document';

    $font-mono: 'Fira Code', monospace;
    $font-sans: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI',
      Roboto, Arial, sans-serif, 'Apple Color  ', 'Segoe UI Emoji',
      'Segoe UI Symbol';

    @media screen {
      .page {
        background-color: white;
        border-radius: 3px;
        margin: 0 0 1rem;
      }
    }

    pre,
    code {
      font-family: $font-mono;
    }

    blockquote {
      padding: 0 0.5rem;
    }

    .footnotes {
      &:not(.empty) {
        border-top: 1px solid #ccc;
        margin-top: 0.5rem;
        padding-top: 0.5rem;
      }
      .footnote {
        display: block;
      }
    }
  `;
}
