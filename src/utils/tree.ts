import { Panes } from '@editor/components/app/App';
import { MosaicParent } from 'react-mosaic-component';

interface Dimensions {
  width: number;
  height: number;
}

/**
 * We need to calculate the width/height of the Editor's window pane in order to
 * force the editor to recalculate its layout.
 */
export function getWindowPctFromTreeLayout(
  id: Panes,
  layout: MosaicParent<Panes>
): Dimensions {
  const recurse = (node: MosaicParent<Panes>, out: Dimensions): Dimensions => {
    if (!node) {
      return out;
    }

    const isRow = node.direction === 'row';
    const dir = isRow ? 'width' : 'height';
    const isFirst = node.first === id;
    const isLast = node.second === id;

    out[dir] *=
      ((isFirst && isRow) || (isLast && !isRow)
        ? 100 - (node.splitPercentage || 0)
        : node.splitPercentage || 100) / 100;

    if (isFirst || isLast) {
      return out;
    } else {
      const next = [node.first, node.second].find(
        val => typeof val !== 'number'
      );
      return next ? recurse(next as MosaicParent<Panes>, out) : out;
    }
  };

  return recurse(layout, { width: 1, height: 1 });
}
