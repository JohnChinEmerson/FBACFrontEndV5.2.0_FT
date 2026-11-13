// Desktop SharedRoutines.GenerateDynamicButtons: a page of buttons holds as many as fit in the panel.
// Used by Sales Transaction and Order Transaction (CATEGORY / PRODUCT / TABLE tiles, PREV / NEXT).

// Number of tiles (columns x rows) of the rendered grid (.tile-grid / .item-grid) that fit in the container
// without scrolling; 0 when nothing is rendered yet. Tiles must have a uniform height.
export function fitTilePageSize(container: HTMLElement): number {
  var grid = container?.querySelector('.tile-grid, .item-grid') as HTMLElement;
  var tiles = grid ? Array.from(grid.querySelectorAll(':scope > button')) as HTMLElement[] : [];
  if (!container || tiles.length == 0) return 0;

  var style = getComputedStyle(grid);
  var cols = style.gridTemplateColumns.split(' ').filter(x => x).length || 1;
  var rowGap = parseFloat(style.rowGap) || 0;
  var available = container.clientHeight - (parseFloat(style.paddingTop) || 0) - (parseFloat(style.paddingBottom) || 0);
  var tileHeight = Math.max(...tiles.map(t => t.offsetHeight));
  if (tileHeight <= 0) return 0;
  var rows = Math.max(1, Math.floor((available + rowGap) / (tileHeight + rowGap)));
  return cols * rows;
}
