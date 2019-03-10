import { Component, PureComponent, ReactNode } from "react";

export type OnSectionRenderedParams = RenderedSection;

export type ChildProps = {
    onSectionRendered: (params: RenderedSection) => void;
    scrollToColumn: number;
    scrollToRow: number;
};
/**
 * This HOC decorates a virtualized component and responds to arrow-key events by scrolling one row or column at a time.
 */
export type ArrowKeyStepperProps = {
    children: (props: ChildProps) => React.ReactNode;
    className?: string;
    columnCount: number;
    rowCount: number;
    mode?: "edges" | "cells";
    disabled?: boolean;
    isControlled?: boolean;
    onScrollToChange?: (params: ScrollIndices) => void;
    scrollToColumn?: number;
    scrollToRow?: number;
    /**
     * PLEASE NOTE
     * The [key: string]: any; line is here on purpose
     * This is due to the need of force re-render of PureComponent
     * Check the following link if you want to know more
     * https://github.com/bvaughn/react-virtualized#pass-thru-props
     */
    [key: string]: any;
};
export type ScrollIndices = {
    scrollToRow: number;
    scrollToColumn: number;
};

export type ScrollIndexes = ScrollIndices;

export class ArrowKeyStepper extends PureComponent<
    ArrowKeyStepperProps,
    ScrollIndices
> {
    static defaultProps: {
        disabled: false;
        isControlled: false;
        mode: "edges";
        scrollToColumn: 0;
        scrollToRow: 0;
    };
}


export type Size = {
    height: number;
    width: number;
};
export type Dimensions = Size;

export type AutoSizerProps = {
    /**
     * Function responsible for rendering children.
     * This function should implement the following signature:
     * ({ height, width }) => PropTypes.element
     */
    children: (props: Size) => React.ReactNode;
    /**
     * 	Optional custom CSS class name to attach to root AutoSizer element.
     * This is an advanced property and is not typically necessary.
     */
    className?: string;
    /**
     * Height passed to child for initial render; useful for server-side rendering.
     * This value will be overridden with an accurate height after mounting.
     */
    defaultHeight?: number;
    /**
     * Width passed to child for initial render; useful for server-side rendering.
     * This value will be overridden with an accurate width after mounting.
     */
    defaultWidth?: number;
    /** Disable dynamic :height property */
    disableHeight?: boolean;
    /** Disable dynamic :width property */
    disableWidth?: boolean;
    /** Nonce of the inlined stylesheet for Content Security Policy */
    nonce?: string;
    /** Callback to be invoked on-resize: ({ height, width }) */
    onResize?: (info: Size) => any;
    /**
     * Optional custom inline style to attach to root AutoSizer element.
     * This is an advanced property and is not typically necessary.
     */
    style?: React.CSSProperties;
    /**
     * PLEASE NOTE
     * The [key: string]: any; line is here on purpose
     * This is due to the need of force re-render of PureComponent
     * Check the following link if you want to know more
     * https://github.com/bvaughn/react-virtualized#pass-thru-props
     */
    [key: string]: any;
};
/**
 * Decorator component that automatically adjusts the width and height of a single child.
 * Child component should not be declared as a child but should rather be specified by a `ChildComponent` property.
 * All other properties will be passed through to the child component.
 */
export class AutoSizer extends PureComponent<AutoSizerProps, Size> {
    static defaultProps: {
        onResize: () => void;
        disableHeight: false;
        disableWidth: false;
        style: {};
    };

    constructor(props: AutoSizerProps);

    componentDidMount(): void;

    componentWillUnmount(): void;

    render(): JSX.Element;
}


export type CellMeasurerCacheInterface = {
    hasFixedWidth(): boolean;
    hasFixedHeight(): boolean;
    has(rowIndex: number, columnIndex: number): boolean;
    set(
        rowIndex: number,
        columnIndex: number,
        width: number,
        height: number
    ): void;
    getHeight(rowIndex: number, columnIndex?: number): number;
    getWidth(rowIndex: number, columnIndex?: number): number;
};

export type KeyMapper = (rowIndex: number, columnIndex: number) => any;

export type CellMeasurerCacheParams = {
    defaultHeight?: number;
    defaultWidth?: number;
    fixedHeight?: boolean;
    fixedWidth?: boolean;
    minHeight?: number;
    minWidth?: number;
    keyMapper?: KeyMapper;
};
export class CellMeasurerCache implements CellMeasurerCacheInterface {
    constructor(params?: CellMeasurerCacheParams);
    clear(rowIndex: number, columnIndex: number): void;
    clearAll(): void;
    columnWidth: (params: { index: number }) => number;
    readonly defaultHeight: number;
    readonly defaultWidth: number;
    hasFixedHeight(): boolean;
    hasFixedWidth(): boolean;
    getHeight(rowIndex: number, columnIndex: number): number;
    getWidth(rowIndex: number, columnIndex: number): number;
    has(rowIndex: number, columnIndex: number): boolean;
    rowHeight: (params: { index: number }) => number;
    set(
        rowIndex: number,
        columnIndex: number,
        width: number,
        height: number
    ): void;
}

export type CellPosition = {
    columnIndex: number;
    rowIndex: number;
};

export type MeasuredCellParent = {
    invalidateCellSizeAfterRender?: (cell: CellPosition) => void;
    recomputeGridSize?: (cell: CellPosition) => void;
};

export type CellMeasurerProps = {
    cache: CellMeasurerCacheInterface;
    children:
        | ((props: { measure: () => void }) => React.ReactNode)
        | React.ReactNode;
    columnIndex?: number;
    index?: number;
    parent: MeasuredCellParent;
    rowIndex?: number;
    style?: React.CSSProperties;
    /**
     * PLEASE NOTE
     * The [key: string]: any; line is here on purpose
     * This is due to the need of force re-render of PureComponent
     * Check the following link if you want to know more
     * https://github.com/bvaughn/react-virtualized#pass-thru-props
     */
    [key: string]: any;
};
/**
 * Wraps a cell and measures its rendered content.
 * Measurements are stored in a per-cell cache.
 * Cached-content is not be re-measured.
 */
export class CellMeasurer extends PureComponent<CellMeasurerProps> {}


export type CollectionCellSizeAndPosition = {
    height: number;
    width: number;
    x: number;
    y: number;
};

export type CollectionCellSizeAndPositionGetter = (params: Index) => CollectionCellSizeAndPosition;

export type CollectionCellGroupRendererParams = {
    cellSizeAndPositionGetter: CollectionCellSizeAndPositionGetter;
    indices: number[];
    cellRenderer: CollectionCellRenderer;
};
export type CollectionCellGroupRenderer = (
    params: CollectionCellGroupRendererParams
) => React.ReactNode[];
export type CollectionCellRendererParams = {
    index: number;
    isScrolling: boolean;
    key: number;
    style: React.CSSProperties;
};
export type CollectionCellRenderer = (params: CollectionCellRendererParams) => React.ReactNode;


export type CollectionProps = {
    "aria-label"?: string;
    /**
     * Outer height of Collection is set to "auto". This property should only be
     * used in conjunction with the WindowScroller HOC.
     */
    autoHeight?: boolean;
    /**
     * Number of cells in Collection.
     */
    cellCount: number;
    /**
     * Responsible for rendering a group of cells given their indices.
     * Should implement the following interface: ({
     *   cellSizeAndPositionGetter:Function,
     *   indices: Array<number>,
     *   cellRenderer: Function
     * }): Array<PropTypes.node>
     */
    cellGroupRenderer?: CollectionCellGroupRenderer;
    /**
     * Responsible for rendering a cell given an row and column index.
     * Should implement the following interface: ({ index: number, key: string, style: object }): PropTypes.element
     */
    cellRenderer: CollectionCellRenderer;
    /**
     * Callback responsible for returning size and offset/position information for a given cell (index).
     * ({ index: number }): { height: number, width: number, x: number, y: number }
     */
    cellSizeAndPositionGetter: CollectionCellSizeAndPositionGetter;
    /**
     * Optional custom CSS class name to attach to root Collection element.
     */
    className?: string;
    height: number;
    horizontalOverscanSize?: number;
    /**
     * Optional custom id to attach to root Collection element.
     */
    id?: string;
    noContentRenderer?: () => JSX.Element;
    /**
     * Callback invoked whenever the scroll offset changes within the inner
     * scrollable region: ({ clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth }): void
     */
    onScroll?: (params: ScrollParams) => any;
    /**
     * Callback invoked with information about the section of the Collection
     * that was just rendered: ({ indices: Array<number> }): void
     */
    onSectionRendered?: (params: SectionRenderedParams) => any;
    /**
     * Horizontal offset
     */
    scrollLeft?: number;
    /**
     * Controls the alignment of scrolled-to-cells. The default ("auto") scrolls
     * the least amount possible to ensure that the specified cell is fully
     * visible. Use "start" to always align cells to the top/left of the
     * Collection and "end" to align them bottom/right. Use "center" to align
     * specified cell in the middle of container.
     */
    scrollToAlignment?: Alignment;
    scrollToCell?: number;
    /**
     * Vertical Offset
     */
    scrollTop?: number;
    /**
     * Optionally override the size of the sections a Collection's cells are split into.
     */
    sectionSize?: number;
    /**
     * Optional custom inline style to attach to root Collection element.
     */
    style?: React.CSSProperties;
    verticalOverscanSize?: number;
    /**
     * Width of Collection; this property determines the number of visible
     * (vs virtualized) columns.
     */
    width: number;
    /**
     * PLEASE NOTE
     * The [key: string]: any; line is here on purpose
     * This is due to the need of force re-render of PureComponent
     * Check the following link if you want to know more
     * https://github.com/bvaughn/react-virtualized#pass-thru-props
     */
    [key: string]: any;
};

type VirtualizedCollection = {
    "aria-label": string
    cellCount: number
    cellGroupRenderer: CollectionCellGroupRenderer
    cellRenderer: CollectionCellRenderer
    cellSizeAndPositionGetter: CollectionCellSizeAndPositionGetter
    sectionSize: number
}
/**
 * Renders scattered or non-linear data.
 * Unlike Grid, which renders checkerboard data, Collection can render arbitrarily positioned- even overlapping- data.
 */
export class Collection extends PureComponent<CollectionProps> implements VirtualizedCollection {
    static propTypes: {
        "aria-label": string
        cellCount: number
        cellGroupRenderer: CollectionCellGroupRenderer
        cellRenderer: CollectionCellRenderer
        cellSizeAndPositionGetter: CollectionCellSizeAndPositionGetter
        sectionSize: number
    };

    static defaultProps: {
        "aria-label": "grid";
        cellGroupRenderer: CollectionCellGroupRenderer;
    };

    forceUpdate(): void;

    /** See Collection#recomputeCellSizesAndPositions */
    recomputeCellSizesAndPositions(): void;

    /** CellLayoutManager interface */

    calculateSizeAndPositionData(): void;

    /**
     * Returns the most recently rendered set of cell indices.
     */
    getLastRenderedIndices(): number[];

    /**
     * Calculates the minimum amount of change from the current scroll position to ensure the specified cell is (fully) visible.
     */
    getScrollPositionForCell(params: {
        align: "auto" | "start" | "end" | "center";
        cellIndex: number;
        height: number;
        scrollLeft: number;
        scrollTop: number;
        width: number;
    }): ScrollPosition;

    getTotalSize(): SizeInfo;

    cellRenderers(
        params: {
            isScrolling: boolean;
        } & SizeInfo
    ): React.ReactNode[];
}


export type SizedColumnProps = {
    adjustedWidth: number;
    columnWidth: number;
    getColumnWidth: () => number;
    registerChild: any;
};

export type ColumnSizerProps = {
    /**
     * Function responsible for rendering a virtualized Grid.
     * This function should implement the following signature:
     * ({ adjustedWidth, getColumnWidth, registerChild }) => PropTypes.element
     *
     * The specified :getColumnWidth function should be passed to the Grid's :columnWidth property.
     * The :registerChild should be passed to the Grid's :ref property.
     * The :adjustedWidth property is optional; it reflects the lesser of the overall width or the width of all columns.
     */
    children: (props: SizedColumnProps) => React.ReactNode;
    /** Optional maximum allowed column width */
    columnMaxWidth?: number;
    /** Optional minimum allowed column width */
    columnMinWidth?: number;
    /** Number of columns in Grid or Table child */
    columnCount?: number;
    /** Width of Grid or Table child */
    width: number;
    /**
     * PLEASE NOTE
     * The [key: string]: any; line is here on purpose
     * This is due to the need of force re-render of PureComponent
     * Check the following link if you want to know more
     * https://github.com/bvaughn/react-virtualized#pass-thru-props
     */
    [key: string]: any;
};

type VirtualizedColumnSizer = {
    children: (props: SizedColumnProps) => React.ReactNode
    columnMaxWidth: number
    columnMinWidth: number
    columnCount: number
    width: number
}
/**
 * High-order component that auto-calculates column-widths for `Grid` cells.
 */
export class ColumnSizer extends PureComponent<ColumnSizerProps> implements VirtualizedColumnSizer {
    static propTypes: {
        children: (props: SizedColumnProps) => React.ReactNode
        columnMaxWidth: number
        columnMinWidth: number
        columnCount: number
        width: number
    };
}


export type RenderedSection = {
    columnOverscanStartIndex: number;
    columnOverscanStopIndex: number;
    columnStartIndex: number;
    columnStopIndex: number;
    rowOverscanStartIndex: number;
    rowOverscanStopIndex: number;
    rowStartIndex: number;
    rowStopIndex: number;
};

export type GridCellProps = {
    columnIndex: number;
    isScrolling: boolean;
    isVisible: boolean;
    key: string;
    parent: MeasuredCellParent;
    rowIndex: number;
    style: React.CSSProperties;
};
export type GridCellRenderer = (props: GridCellProps) => React.ReactNode;

export type ConfigureParams = {
    cellCount: number;
    estimatedCellSize: number;
};
export type ContainerSizeAndOffset = {
    containerSize: number;
    offset: number;
};
export type SizeAndPositionData = {
    offset: number;
    size: number;
};
export type GetVisibleCellRangeParams = {
    containerSize: number;
    offset: number;
};
export type VisibleCellRange = {
    start: number;
    stop: number;
};
export type ScrollParams = {
    clientHeight: number;
    clientWidth: number;
    scrollHeight: number;
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
};
export type ScrollbarPresenceParams = {
    horizontal: boolean;
    size: number;
    vertical: boolean;
};
export type SectionRenderedParams = RenderedSection;
export type SCROLL_DIRECTION_HORIZONTAL = "horizontal";
export type SCROLL_DIRECTION_VERTICAL = "vertical";
export type OverscanIndicesGetterParams = {
    direction?: SCROLL_DIRECTION_HORIZONTAL | SCROLL_DIRECTION_VERTICAL;
    cellCount: number;
    overscanCellsCount: number;
    scrollDirection: SCROLL_DIRECTION_HORIZONTAL | SCROLL_DIRECTION_VERTICAL;
    startIndex: number;
    stopIndex: number;
};
export type OverscanIndices = {
    overscanStartIndex: number;
    overscanStopIndex: number;
};
export type OverscanIndicesGetter = (
    params: OverscanIndicesGetterParams
) => OverscanIndices;

export type ScrollOffset = {
    scrollLeft: number;
    scrollTop: number;
};

export type CellSizeAndPositionManager = {
    areOffsetsAdjusted(): boolean;
    configure({ cellCount, estimatedCellSize }: ConfigureParams): void;
    getCellCount(): number;
    getEstimatedCellSize(): number;
    getLastMeasuredIndex(): number;
    getOffsetAdjustment({
        containerSize,
        offset /*safe*/
    }: ContainerSizeAndOffset): number;
    /**
     * This method returns the size and position for the cell at the specified index.
     * It just-in-time calculates (or used cached values) for cells leading up to the index.
     */
    getSizeAndPositionOfCell(index: number): SizeAndPositionData;
    getSizeAndPositionOfLastMeasuredCell(): SizeAndPositionData;
    /**
     * Total size of all cells being measured.
     * This value will be completedly estimated initially.
     * As cells as measured the estimate will be updated.
     */
    getTotalSize(): number;
    /**
     * Determines a new offset that ensures a certain cell is visible, given the current offset.
     * If the cell is already visible then the current offset will be returned.
     * If the current offset is too great or small, it will be adjusted just enough to ensure the specified index is visible.
     *
     * @param align Desired alignment within container; one of "auto" (default), "start", or "end"
     * @param containerSize Size (width or height) of the container viewport
     * @param currentOffset Container's current (x or y) offset
     * @param totalSize Total size (width or height) of all cells
     * @return Offset to use to ensure the specified cell is visible
     */
    getUpdatedOffsetForIndex(params: {
        align: string;
        containerSize: number;
        currentOffset: number;
        targetIndex: number;
    }): number;
    getVisibleCellRange(params: GetVisibleCellRangeParams): VisibleCellRange;
    /**
     * Clear all cached values for cells after the specified index.
     * This method should be called for any cell that has changed its size.
     * It will not immediately perform any calculations; they'll be performed the next time getSizeAndPositionOfCell() is called.
     */
    resetCell(index: number): void;
};

export type GridCellRangeProps = {
    cellCache: Map<any>;
    cellRenderer: GridCellRenderer;
    columnSizeAndPositionManager: CellSizeAndPositionManager;
    columnStartIndex: number;
    columnStopIndex: number;
    isScrolling: boolean;
    rowSizeAndPositionManager: CellSizeAndPositionManager;
    rowStartIndex: number;
    rowStopIndex: number;
    scrollLeft: number;
    scrollTop: number;
    deferredMeasurementCache: CellMeasurerCache;
    horizontalOffsetAdjustment: number;
    parent: MeasuredCellParent;
    styleCache: Map<React.CSSProperties>;
    verticalOffsetAdjustment: number;
    visibleColumnIndices: VisibleCellRange;
    visibleRowIndices: VisibleCellRange;
};
export type GridCellRangeRenderer = (
    params: GridCellRangeProps
) => React.ReactNode[];

export type GridCoreProps = {
    "aria-label"?: string;
    "aria-readonly"?: boolean;
    /**
     * Set the width of the inner scrollable container to 'auto'.
     * This is useful for single-column Grids to ensure that the column doesn't extend below a vertical scrollbar.
     */
    autoContainerWidth?: boolean;
    /**
     * Removes fixed height from the scrollingContainer so that the total height of rows can stretch the window.
     * Intended for use with WindowScroller
     */
    autoHeight?: boolean;
    /**
     * Removes fixed width from the scrollingContainer so that the total width of rows can stretch the window.
     * Intended for use with WindowScroller
     */
    autoWidth?: boolean;
    /**
     * Responsible for rendering a group of cells given their index ranges.
     * Should implement the following interface: ({
     *   cellCache: Map,
     *   cellRenderer: Function,
     *   columnSizeAndPositionManager: CellSizeAndPositionManager,
     *   columnStartIndex: number,
     *   columnStopIndex: number,
     *   isScrolling: boolean,
     *   rowSizeAndPositionManager: CellSizeAndPositionManager,
     *   rowStartIndex: number,
     *   rowStopIndex: number,
     *   scrollLeft: number,
     *   scrollTop: number
     * }): Array<PropTypes.node>
     */
    cellRangeRenderer?: GridCellRangeRenderer;
    /**
     * Optional custom CSS class name to attach to root Grid element.
     */
    className?: string;
    /** Unfiltered props for the Grid container. */
    containerProps?: object;
    /** ARIA role for the cell-container.  */
    containerRole?: string;
    /** Optional inline style applied to inner cell-container */
    containerStyle?: React.CSSProperties;
    /**
     * If CellMeasurer is used to measure this Grid's children, this should be a pointer to its CellMeasurerCache.
     * A shared CellMeasurerCache reference enables Grid and CellMeasurer to share measurement data.
     */
    deferredMeasurementCache?: CellMeasurerCache;
    /**
     * Used to estimate the total width of a Grid before all of its columns have actually been measured.
     * The estimated total width is adjusted as columns are rendered.
     */
    estimatedColumnSize?: number;
    /**
     * Used to estimate the total height of a Grid before all of its rows have actually been measured.
     * The estimated total height is adjusted as rows are rendered.
     */
    estimatedRowSize?: number;
    /**
     * Exposed for testing purposes only.
     */
    getScrollbarSize?: () => number;
    /**
     * Height of Grid; this property determines the number of visible (vs virtualized) rows.
     */
    height: number;
    /**
     * Optional custom id to attach to root Grid element.
     */
    id?: string;
    /**
     * Override internal is-scrolling state tracking.
     * This property is primarily intended for use with the WindowScroller component.
     */
    isScrolling?: boolean;
    /**
     * Optional renderer to be used in place of rows when either :rowCount or :columnCount is 0.
     */
    noContentRenderer?: () => React.ReactNode;
    /**
     * Callback invoked whenever the scroll offset changes within the inner scrollable region.
     * This callback can be used to sync scrolling between lists, tables, or grids.
     * ({ clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth }): void
     */
    onScroll?: (params: ScrollParams) => any;
    /**
     * Called whenever a horizontal or vertical scrollbar is added or removed.
     * ({ horizontal: boolean, size: number, vertical: boolean }): void
     */
    onScrollbarPresenceChange?: (params: ScrollbarPresenceParams) => any;
    /**
     * Callback invoked with information about the section of the Grid that was just rendered.
     * ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }): void
     */
    onSectionRendered?: (params: SectionRenderedParams) => any;
    /**
     * Number of columns to render before/after the visible section of the grid.
     * These columns can help for smoother scrolling on touch devices or browsers that send scroll events infrequently.
     */
    overscanColumnCount?: number;
    /**
     * Calculates the number of cells to overscan before and after a specified range.
     * This function ensures that overscanning doesn't exceed the available cells.
     * Should implement the following interface: ({
     *   cellCount: number,
     *   overscanCellsCount: number,
     *   scrollDirection: number,
     *   startIndex: number,
     *   stopIndex: number
     * }): {overscanStartIndex: number, overscanStopIndex: number}
     */
    overscanIndicesGetter?: OverscanIndicesGetter;
    /**
     * Number of rows to render above/below the visible section of the grid.
     * These rows can help for smoother scrolling on touch devices or browsers that send scroll events infrequently.
     */
    overscanRowCount?: number;
    /**
     * ARIA role for the grid element.
     */
    role?: string;
    /**
     * Either a fixed row height (number) or a function that returns the height of a row given its index.
     * Should implement the following interface: ({ index: number }): number
     */
    rowHeight: number | ((params: Index) => number);
    /**
     * Number of rows in grid.
     */
    rowCount: number;
    /** Wait this amount of time after the last scroll event before resetting Grid `pointer-events`. */
    scrollingResetTimeInterval?: number;
    /** Horizontal offset. */
    scrollLeft?: number;
    /**
     * Controls scroll-to-cell behavior of the Grid.
     * The default ("auto") scrolls the least amount possible to ensure that the specified cell is fully visible.
     * Use "start" to align cells to the top/left of the Grid and "end" to align bottom/right.
     */
    scrollToAlignment?: Alignment;
    /**
     * Column index to ensure visible (by forcefully scrolling if necessary)
     */
    scrollToColumn?: number;
    /** Vertical offset. */
    scrollTop?: number;
    /**
     * Row index to ensure visible (by forcefully scrolling if necessary)
     */
    scrollToRow?: number;
    /** Optional inline style */
    style?: React.CSSProperties;
    /** Tab index for focus */
    tabIndex?: number | null;
    /**
     * Width of Grid; this property determines the number of visible (vs virtualized) columns.
     */
    width: number;
    /**
     * PLEASE NOTE
     * The [key: string]: any; line is here on purpose
     * This is due to the need of force re-render of PureComponent
     * Check the following link if you want to know more
     * https://github.com/bvaughn/react-virtualized#pass-thru-props
     */
    [key: string]: any;
};

export type GridProps = GridCoreProps & {
    /**
     * Responsible for rendering a cell given an row and column index.
     * Should implement the following interface: ({ columnIndex: number, rowIndex: number }): PropTypes.node
     */
    cellRenderer: GridCellRenderer;
    /**
     * Number of columns in grid.
     */
    columnCount: number;
    /**
     * Either a fixed column width (number) or a function that returns the width of a column given its index.
     * Should implement the following interface: (index: number): number
     */
    columnWidth: number | ((params: Index) => number);
};

export type ScrollDirection = "horizontal" | "vertical";

export type GridState = {
    isScrolling: boolean;
    scrollDirectionHorizontal: ScrollDirection;
    scrollDirectionVertical: ScrollDirection;
    scrollLeft: number;
    scrollTop: number;
};

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export const DEFAULT_SCROLLING_RESET_TIME_INTERVAL = 150;

/**
 * Renders tabular data with virtualization along the vertical and horizontal axes.
 * Row heights and column widths must be known ahead of time and specified as properties.
 */
export class Grid extends PureComponent<GridProps, GridState> {
    static defaultProps: {
        "aria-label": "grid";
        "aria-readonly": true;
        autoContainerWidth: false;
        autoHeight: false;
        autoWidth: false;
        cellRangeRenderer: GridCellRangeRenderer;
        containerRole: "rowgroup";
        containerStyle: {};
        estimatedColumnSize: 100;
        estimatedRowSize: 30;
        getScrollbarSize: () => number;
        noContentRenderer: () => React.ReactNode;
        onScroll: () => void;
        onScrollbarPresenceChange: () => void;
        onSectionRendered: () => void;
        overscanColumnCount: 0;
        overscanIndicesGetter: OverscanIndicesGetter;
        overscanRowCount: 10;
        role: "grid";
        scrollingResetTimeInterval: typeof DEFAULT_SCROLLING_RESET_TIME_INTERVAL;
        scrollToAlignment: "auto";
        scrollToColumn: -1;
        scrollToRow: -1;
        style: {};
        tabIndex: 0;
    };

    /**
     * Gets offsets for a given cell and alignment.
     */
    getOffsetForCell(params?: {
        alignment?: Alignment;
        columnIndex?: number;
        rowIndex?: number;
    }): ScrollOffset;

    /**
     * This method handles a scroll event originating from an external scroll control.
     * It's an advanced method and should probably not be used unless you're implementing a custom scroll-bar solution.
     */
    handleScrollEvent(params: Partial<ScrollOffset>): void;

    /**
     * Invalidate Grid size and recompute visible cells.
     * This is a deferred wrapper for recomputeGridSize().
     * It sets a flag to be evaluated on cDM/cDU to avoid unnecessary renders.
     * This method is intended for advanced use-cases like CellMeasurer.
     */
    // @TODO (bvaughn) Add automated test coverage for this.
    invalidateCellSizeAfterRender(params: {
        columnIndex: number;
        rowIndex: number;
    }): void;

    /**
     * Pre-measure all columns and rows in a Grid.
     * Typically cells are only measured as needed and estimated sizes are used for cells that have not yet been measured.
     * This method ensures that the next call to getTotalSize() returns an exact size (as opposed to just an estimated one).
     */
    measureAllCells(): void;

    /**
     * Forced recompute of row heights and column widths.
     * This function should be called if dynamic column or row sizes have changed but nothing else has.
     * Since Grid only receives :columnCount and :rowCount it has no way of detecting when the underlying data changes.
     */
    recomputeGridSize(params?: {
        columnIndex?: number;
        rowIndex?: number;
    }): void;

    /**
     * Ensure column and row are visible.
     */
    scrollToCell(params: { columnIndex: number; rowIndex: number }): void;

    /**
     * Scroll to the specified offset(s).
     * Useful for animating position changes.
     */
    scrollToPosition(params?: { scrollLeft: number; scrollTop: number }): void;
}

export const defaultCellRangeRenderer: GridCellRangeRenderer;

export const accessibilityOverscanIndicesGetter: OverscanIndicesGetter;

export const defaultOverscanIndicesGetter: OverscanIndicesGetter;


export type InfiniteLoaderChildProps = {
    onRowsRendered: (params: { startIndex: number; stopIndex: number }) => void;
    registerChild: (registeredChild: any) => void;
};

export type InfiniteLoaderProps = {
    /**
     * Function responsible for rendering a virtualized component.
     * This function should implement the following signature:
     * ({ onRowsRendered, registerChild }) => PropTypes.element
     *
     * The specified :onRowsRendered function should be passed through to the child's :onRowsRendered property.
     * The :registerChild callback should be set as the virtualized component's :ref.
     */
    children: (props: InfiniteLoaderChildProps) => React.ReactNode;
    /**
     * Function responsible for tracking the loaded state of each row.
     * It should implement the following signature: ({ index: number }): boolean
     */
    isRowLoaded: (params: Index) => boolean;
    /**
     * Callback to be invoked when more rows must be loaded.
     * It should implement the following signature: ({ startIndex, stopIndex }): Promise
     * The returned Promise should be resolved once row data has finished loading.
     * It will be used to determine when to refresh the list with the newly-loaded data.
     * This callback may be called multiple times in reaction to a single scroll event.
     */
    loadMoreRows: (params: IndexRange) => Promise<any>;
    /**
     * Minimum number of rows to be loaded at a time.
     * This property can be used to batch requests to reduce HTTP requests.
     */
    minimumBatchSize?: number;
    /**
     * Number of rows in list; can be arbitrary high number if actual number is unknown.
     */
    rowCount?: number;
    /**
     * Threshold at which to pre-fetch data.
     * A threshold X means that data will start loading when a user scrolls within X rows.
     * This value defaults to 15.
     */
    threshold?: number;
    /**
     * PLEASE NOTE
     * The [key: string]: any; line is here on purpose
     * This is due to the need of force re-render of PureComponent
     * Check the following link if you want to know more
     * https://github.com/bvaughn/react-virtualized#pass-thru-props
     */
    [key: string]: any;
};


 type VirtualizedInfiniteLoader = {
    children: (props: InfiniteLoaderChildProps) => React.ReactNode
    isRowLoaded: (params: Index) => boolean
    loadMoreRows: (params: IndexRange) => Promise<any>
    minimumBatchSize: number
    rowCount: number
    threshold: number
 }

/**
 * Higher-order component that manages lazy-loading for "infinite" data.
 * This component decorates a virtual component and just-in-time prefetches rows as a user scrolls.
 * It is intended as a convenience component; fork it if you'd like finer-grained control over data-loading.
 */


export class InfiniteLoader extends PureComponent<InfiniteLoaderProps> {
    static propTypes: {
        children: 
            (props: InfiniteLoaderChildProps) => React.ReactNode
        
        isRowLoaded: (params: Index) => boolean
        loadMoreRows: (params: IndexRange) => Promise<any>
        minimumBatchSize: number
        rowCount: number
        threshold: number
    };

    static defaultProps: {
        minimumBatchSize: 10;
        rowCount: 0;
        threshold: 15;
    };

    resetLoadMoreRowsCache(autoReload?: boolean): void;
}


export type ListRowProps = Pick<GridCellProps, Exclude<keyof GridCellProps, 'rowIndex'>> & {
    index: GridCellProps['rowIndex'];
};

export type ListRowRenderer = (props: ListRowProps) => React.ReactNode;
export type ListProps = GridCoreProps & {
    deferredMeasurementCache?: CellMeasurerCache;
    /**
     * Removes fixed height from the scrollingContainer so that the total height
     * of rows can stretch the window. Intended for use with WindowScroller
     */
    autoHeight?: boolean;
    /** Optional CSS class name */
    className?: string;
    /**
     * Used to estimate the total height of a List before all of its rows have actually been measured.
     * The estimated total height is adjusted as rows are rendered.
     */
    estimatedRowSize?: number;
    /** Height constraint for list (determines how many actual rows are rendered) */
    height: number;
    /** Optional renderer to be used in place of rows when rowCount is 0 */
    noRowsRenderer?: () => JSX.Element;
    /**
     * Callback invoked with information about the slice of rows that were just rendered.
     * ({ startIndex, stopIndex }): void
     */
    onRowsRendered?: (
        info: {
            overscanStartIndex: number;
            overscanStopIndex: number;
            startIndex: number;
            stopIndex: number;
        }
    ) => void;
    /**
     * Number of rows to render above/below the visible bounds of the list.
     * These rows can help for smoother scrolling on touch devices.
     */
    overscanRowCount?: number;
    /**
     * Callback invoked whenever the scroll offset changes within the inner scrollable region.
     * This callback can be used to sync scrolling between lists, tables, or grids.
     * ({ clientHeight, scrollHeight, scrollTop }): void
     */
    onScroll?: (
        info: { clientHeight: number; scrollHeight: number; scrollTop: number }
    ) => void;
    /** See Grid#overscanIndicesGetter */
    overscanIndicesGetter?: OverscanIndicesGetter;
    /**
     * Either a fixed row height (number) or a function that returns the height of a row given its index.
     * ({ index: number }): number
     */
    rowHeight: number | ((info: Index) => number);
    /** Responsible for rendering a row given an index; ({ index: number }): node */
    rowRenderer: ListRowRenderer;
    /** Number of rows in list. */
    rowCount: number;
    /** See Grid#scrollToAlignment */
    scrollToAlignment?: string;
    /** Row index to ensure visible (by forcefully scrolling if necessary) */
    scrollToIndex?: number;
    /** Vertical offset. */
    scrollTop?: number;
    /** Optional inline style */
    style?: React.CSSProperties;
    /** Tab index for focus */
    tabIndex?: number | null;
    /** Width of list */
    width: number;
};
/**
 * It is inefficient to create and manage a large list of DOM elements within a scrolling container
 * if only a few of those elements are visible. The primary purpose of this component is to improve
 * performance by only rendering the DOM nodes that a user is able to see based on their current
 * scroll position.
 *
 * This component renders a virtualized list of elements with either fixed or dynamic heights.
 */
export class List extends PureComponent<ListProps> {
    static defaultProps: {
        autoHeight: false;
        estimatedRowSize: 30;
        onScroll: () => void;
        noRowsRenderer: () => null;
        onRowsRendered: () => void;
        overscanIndicesGetter: OverscanIndicesGetter;
        overscanRowCount: 10;
        scrollToAlignment: "auto";
        scrollToIndex: -1;
        style: {};
    };

    Grid?: Grid;

    forceUpdateGrid(): void;

    /** See Grid#getOffsetForCell */
    getOffsetForRow(params: { alignment?: Alignment; index?: number }): number;

    /** CellMeasurer compatibility */
    invalidateCellSizeAfterRender({
        columnIndex,
        rowIndex
    }: CellPosition): void;

    /** See Grid#measureAllCells */
    measureAllRows(): void;

    /** CellMeasurer compatibility */
    recomputeGridSize(params?: Partial<CellPosition>): void;

    /** See Grid#recomputeGridSize */
    recomputeRowHeights(index?: number): void;

    /** See Grid#scrollToPosition */
    scrollToPosition(scrollTop?: number): void;

    /** See Grid#scrollToCell */
    scrollToRow(index?: number): void;
}

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export const DEFAULT_SCROLLING_RESET_TIME_INTERVAL = 150;

export type OnCellsRenderedCallback = (
    params: {
        startIndex: number;
        stopIndex: number;
    }
) => void;

export type OnScrollCallback = (
    params: {
        clientHeight: number;
        scrollHeight: number;
        scrollTop: number;
    }
) => void;

export type MasonryCellProps = {
    index: number;
    isScrolling: boolean;
    key: React.Key;
    parent: MeasuredCellParent;
    style?: React.CSSProperties;
};

export type CellRenderer = (props: MasonryCellProps) => React.ReactNode;

export type MasonryProps = {
    autoHeight: boolean;
    cellCount: number;
    cellMeasurerCache: CellMeasurerCacheInterface;
    cellPositioner: Positioner;
    cellRenderer: CellRenderer;
    className?: string;
    height: number;
    id?: string;
    keyMapper?: KeyMapper;
    onCellsRendered?: OnCellsRenderedCallback;
    onScroll?: OnScrollCallback;
    overscanByPixels?: number;
    role?: string;
    scrollingResetTimeInterval?: number;
    style?: React.CSSProperties;
    tabIndex?: number | null;
    width: number;
    /**
     * PLEASE NOTE
     * The [key: string]: any; line is here on purpose
     * This is due to the need of force re-render of PureComponent
     * Check the following link if you want to know more
     * https://github.com/bvaughn/react-virtualized#pass-thru-props
     */
    [key: string]: any;
};

export type MasonryState = {
    isScrolling: boolean;
    scrollTop: number;
};

/**
 * This component efficiently displays arbitrarily positioned cells using windowing techniques.
 * Cell position is determined by an injected `cellPositioner` property.
 * Windowing is vertical; this component does not support horizontal scrolling.
 *
 * Rendering occurs in two phases:
 * 1) First pass uses estimated cell sizes (provided by the cache) to determine how many cells to measure in a batch.
 *    Batch size is chosen using a fast, naive layout algorithm that stacks images in order until the viewport has been filled.
 *    After measurement is complete (componentDidMount or componentDidUpdate) this component evaluates positioned cells
 *    in order to determine if another measurement pass is required (eg if actual cell sizes were less than estimated sizes).
 *    All measurements are permanently cached (keyed by `keyMapper`) for performance purposes.
 * 2) Second pass uses the external `cellPositioner` to layout cells.
 *    At this time the positioner has access to cached size measurements for all cells.
 *    The positions it returns are cached by Masonry for fast access later.
 *    Phase one is repeated if the user scrolls beyond the current layout's bounds.
 *    If the layout is invalidated due to eg a resize, cached positions can be cleared using `recomputeCellPositions()`.
 *
 * Animation constraints:
 *   Simple animations are supported (eg translate/slide into place on initial reveal).
 *   More complex animations are not (eg flying from one position to another on resize).
 *
 * Layout constraints:
 *   This component supports multi-column layout.
 *   The height of each item may vary.
 *   The width of each item must not exceed the width of the column it is "in".
 *   The left position of all items within a column must align.
 *   (Items may not span multiple columns.)
 */
export class Masonry extends PureComponent<MasonryProps, MasonryState> {
    static defaultProps: {
        autoHeight: false;
        keyMapper: identity;
        onCellsRendered: noop;
        onScroll: noop;
        overscanByPixels: 20;
        role: "grid";
        scrollingResetTimeInterval: typeof DEFAULT_SCROLLING_RESET_TIME_INTERVAL;
        style: emptyObject;
        tabIndex: 0;
    };

    clearCellPositions(): void;

    // HACK This method signature was intended for Grid
    invalidateCellSizeAfterRender(params: { rowIndex: number }): void;

    recomputeCellPositions(): void;

    static getDerivedStateFromProps(
        nextProps: MasonryProps,
        prevState: MasonryState
    ): MasonryState | null;
}

export type emptyObject = {};

export type identity = <T>(value: T) => T;

export type noop = () => void;

export type Position = {
    left: number;
    top: number;
};

export type createCellPositionerParams = {
    cellMeasurerCache: CellMeasurerCacheInterface;
    columnCount: number;
    columnWidth: number;
    spacer?: number;
};

export type resetParams = {
    columnCount: number;
    columnWidth: number;
    spacer?: number;
};

export type Positioner = ((index: number) => Position) & {
    reset: (params: resetParams) => void;
};

export const createCellPositioner: (
    params: createCellPositionerParams
) => Positioner;


export type MultiGridProps = {
    classNameBottomLeftGrid?: string;
    classNameBottomRightGrid?: string;
    classNameTopLeftGrid?: string;
    classNameTopRightGrid?: string;
    enableFixedColumnScroll?: boolean;
    enableFixedRowScroll?: boolean;
    fixedColumnCount?: number;
    fixedRowCount?: number;
    style?: React.CSSProperties;
    styleBottomLeftGrid?: React.CSSProperties;
    styleBottomRightGrid?: React.CSSProperties;
    styleTopLeftGrid?: React.CSSProperties;
    styleTopRightGrid?: React.CSSProperties;
} & GridProps;

export type MultiGridState = {
    scrollLeft: number;
    scrollTop: number;
};

/**
 * Renders 1, 2, or 4 Grids depending on configuration.
 * A main (body) Grid will always be rendered.
 * Optionally, 1-2 Grids for sticky header rows will also be rendered.
 * If no sticky columns, only 1 sticky header Grid will be rendered.
 * If sticky columns, 2 sticky header Grids will be rendered.
 */
type VirtualizedMultiGrid = {
    classNameBottomLeftGrid: string
    classNameBottomRightGrid: string
    classNameTopLeftGrid: string
    classNameTopRightGrid: string
    enableFixedColumnScroll: boolean
    enableFixedRowScroll: boolean
    fixedColumnCount: number
    fixedRowCount: number
    style: React.CSSProperties
    styleBottomLeftGrid: React.CSSProperties
    styleBottomRightGrid: React.CSSProperties
    styleTopLeftGrid: React.CSSProperties
    styleTopRightGrid: React.CSSProperties
}
export class MultiGrid extends PureComponent<MultiGridProps, MultiGridState> implements VirtualizedMultiGrid {
    static propTypes: {
        classNameBottomLeftGrid: string
        classNameBottomRightGrid: string
        classNameTopLeftGrid: string
        classNameTopRightGrid: string
        enableFixedColumnScroll: boolean
        enableFixedRowScroll: boolean
        fixedColumnCount: number
        fixedRowCount: number
        style: React.CSSProperties
        styleBottomLeftGrid: React.CSSProperties
        styleBottomRightGrid: React.CSSProperties
        styleTopLeftGrid: React.CSSProperties
        styleTopRightGrid: React.CSSProperties
    };

    static defaultProps: {
        classNameBottomLeftGrid: "";
        classNameBottomRightGrid: "";
        classNameTopLeftGrid: "";
        classNameTopRightGrid: "";
        enableFixedColumnScroll: false;
        enableFixedRowScroll: false;
        fixedColumnCount: 0;
        fixedRowCount: 0;
        scrollToColumn: -1;
        scrollToRow: -1;
        style: {};
        styleBottomLeftGrid: {};
        styleBottomRightGrid: {};
        styleTopLeftGrid: {};
        styleTopRightGrid: {};
    };

    forceUpdateGrids(): void;

    /** See Grid#invalidateCellSizeAfterRender */
    invalidateCellSizeAfterRender(params?: Partial<CellPosition>): void;

    /** See Grid#measureAllCells */
    measureAllCells(): void;

    /** See Grid#recomputeGridSize */
    recomputeGridSize(params?: {
        columnIndex?: number;
        rowIndex?: number;
    }): void;
    static getDerivedStateFromProps(
        nextProps: MultiGridProps,
        prevState: MultiGridState
    ): MultiGridState | null;
}


export type OnScrollParams = {
    clientHeight: number;
    clientWidth: number;
    scrollHeight: number;
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
};

export type ScrollSyncChildProps = {
    clientHeight: number;
    clientWidth: number;
    onScroll: (params: OnScrollParams) => void;
    scrollHeight: number;
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
};

export type ScrollSyncProps = {
    /**
     * Function responsible for rendering 2 or more virtualized components.
     * This function should implement the following signature:
     * ({ onScroll, scrollLeft, scrollTop }) => PropTypes.element
     */
    children: (props: ScrollSyncChildProps) => React.ReactNode;
    /**
     * PLEASE NOTE
     * The [key: string]: any; line is here on purpose
     * This is due to the need of force re-render of PureComponent
     * Check the following link if you want to know more
     * https://github.com/bvaughn/react-virtualized#pass-thru-props
     */
    [key: string]: any;
};

export type ScrollSyncState = {
    clientHeight: number;
    clientWidth: number;
    scrollHeight: number;
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
};

/**
 * HOC that simplifies the process of synchronizing scrolling between two or more virtualized components.
 */

type ScrollSync_type = {
    children: (props: ScrollSyncChildProps) => React.ReactNode
};

export class ScrollSync extends PureComponent<ScrollSyncProps,ScrollSyncState> {}


export type SortParams = {
    defaultSortDirection: SortDirectionType;
    event: MouseEvent;
    sortBy: string;
};

export type SortDirectionMap = { [key: string]: SortDirectionType };

export type MultiSortOptions = {
    defaultSortBy?: string[];
    defaultSortDirection?: SortDirectionMap;
};

export type MultiSortReturn = {
    /**
     * Sort property to be passed to the `Table` component.
     * This function updates `sortBy` and `sortDirection` values.
     */
    sort: (params: SortParams) => void;

    /**
     * Specifies the fields currently responsible for sorting data,
     * In order of importance.
     */
    sortBy: string[];

    /**
     * Specifies the direction a specific field is being sorted in.
     */
    sortDirection: SortDirectionMap;
};

export function createMultiSort(
    sortCallback: (
        params: { sortBy: string; sortDirection: SortDirectionType }
    ) => void,
    options?: MultiSortOptions
): MultiSortReturn;

export type TableCellDataGetterParams = {
    columnData?: any;
    dataKey: string;
    rowData: any;
};
export type TableCellProps = {
    cellData?: any;
    columnData?: any;
    columnIndex: number;
    dataKey: string;
    isScrolling: boolean;
    parent?: any;
    rowData: any;
    rowIndex: number;
};
export type TableHeaderProps = {
    columnData?: any;
    dataKey: string;
    disableSort?: boolean;
    label?: ReactNode;
    sortBy?: string;
    sortDirection?: SortDirectionType;
};
export type TableHeaderRowProps = {
    className: string;
    columns: React.ReactNode[];
    style: React.CSSProperties;
    scrollbarWidth: number;
    height: number;
    width: number;
};
export type TableRowProps = {
    className: string;
    columns: any[];
    index: number;
    isScrolling: boolean;
    onRowClick?: (params: RowMouseEventHandlerParams) => void;
    onRowDoubleClick?: (params: RowMouseEventHandlerParams) => void;
    onRowMouseOver?: (params: RowMouseEventHandlerParams) => void;
    onRowMouseOut?: (params: RowMouseEventHandlerParams) => void;
    onRowRightClick?: (params: RowMouseEventHandlerParams) => void;
    rowData: any;
    style: any;
};

export type TableCellDataGetter = (params: TableCellDataGetterParams) => any;
export type TableCellRenderer = (props: TableCellProps) => React.ReactNode;
export type TableHeaderRenderer = (props: TableHeaderProps) => React.ReactNode;
export type TableHeaderRowRenderer = (
    props: TableHeaderRowProps
) => React.ReactNode;
export type TableRowRenderer = (props: TableRowProps) => React.ReactNode;

// https://github.com/bvaughn/react-virtualized/blob/master/docs/Column.md
export type ColumnProps = {
    /** Optional aria-label value to set on the column header */
    "aria-label"?: string;
    /**
     * Callback responsible for returning a cell's data, given its :dataKey
     * ({ columnData: any, dataKey: string, rowData: any }): any
     */
    cellDataGetter?: TableCellDataGetter;
    /**
     * Callback responsible for rendering a cell's contents.
     * ({ cellData: any, columnData: any, dataKey: string, rowData: any, rowIndex: number }): node
     */
    cellRenderer?: TableCellRenderer;
    /** Optional CSS class to apply to cell */
    className?: string;
    /** Optional additional data passed to this column's :cellDataGetter */
    columnData?: any;
    /** Uniquely identifies the row-data attribute correspnding to this cell */
    dataKey: any;
    /** Default sort order when clicked for the first time. Valid options include "ASC" and "DESC". Defaults to "ASC" */
    defaultSortDirection?: SortDirectionType;
    /** If sort is enabled for the table at large, disable it for this column */
    disableSort?: boolean;
    /** Flex grow style; defaults to 0 */
    flexGrow?: number;
    /** Flex shrink style; defaults to 1 */
    flexShrink?: number;
    /** Optional CSS class to apply to this column's header */
    headerClassName?: string;
    /**
     * Optional callback responsible for rendering a column header contents.
     * ({ columnData: object, dataKey: string, disableSort: boolean, label: string, sortBy: string, sortDirection: string }): PropTypes.node
     */
    headerRenderer?: TableHeaderRenderer;
    /** Optional inline style to apply to this column's header */
    headerStyle?: React.CSSProperties;
    /** Optional id to set on the column header; used for aria-describedby */
    id?: string;
    /** Header label for this column */
    label?: ReactNode;
    /** Maximum width of column; this property will only be used if :flexGrow is > 0. */
    maxWidth?: number;
    /** Minimum width of column. */
    minWidth?: number;
    /** Optional inline style to apply to cell */
    style?: React.CSSProperties;
    /** Flex basis (width) for this column; This value can grow or shrink based on :flexGrow and :flexShrink properties. */
    width: number;
};

type VirtualizedColumn = {
    "aria-label": string
    cellDataGetter: TableCellDataGetter
    cellRenderer: TableCellRenderer
    className: string
    columnData: object
    dataKey: string
    disableSort: boolean
    flexGrow: number
    flexShrink: number
    headerClassName: string
    headerRenderer: TableHeaderRowRenderer
    label: string
    maxWidth: number
    minWidth: number
    style: React.CSSProperties
    width: number
    id: string
}
export class Column extends Component<ColumnProps> implements VirtualizedColumn {
        "aria-label": string
        cellDataGetter: TableCellDataGetter
        cellRenderer: TableCellRenderer
        className: string
        columnData: object
        dataKey: string
        disableSort: boolean
        flexGrow: number
        flexShrink: number
        headerClassName: string
        headerRenderer: TableHeaderRowRenderer
        label: string
        maxWidth: number
        minWidth: number
        style: React.CSSProperties
        width: number
        id: string
    

    static defaultProps: {
        cellDataGetter: TableCellDataGetter;
        cellRenderer: TableCellRenderer;
        flexGrow: 0;
        flexShrink: 1;
        headerRenderer: TableHeaderRenderer;
        style: {};
    };
}

export type RowMouseEventHandlerParams = {
    rowData: {
        columnData: object;
        id: string;
        index: number;
    };
    index: number;
    event: React.MouseEvent<any>;
};

export type HeaderMouseEventHandlerParams = {
    dataKey: string;
    columnData: any;
    event: React.MouseEvent<any>;
};

// ref: https://github.com/bvaughn/react-virtualized/blob/master/docs/Table.md
export type TableProps = GridCoreProps & {
    "aria-label"?: string;
    deferredMeasurementCache?: CellMeasurerCache;
    /**
     * Removes fixed height from the scrollingContainer so that the total height
     * of rows can stretch the window. Intended for use with WindowScroller
     */
    autoHeight?: boolean;
    /** One or more Columns describing the data displayed in this row */
    children?: React.ReactNode;
    /** Optional CSS class name */
    className?: string;
    /** Disable rendering the header at all */
    disableHeader?: boolean;
    /**
     * Used to estimate the total height of a Table before all of its rows have actually been measured.
     * The estimated total height is adjusted as rows are rendered.
     */
    estimatedRowSize?: number;
    /** Optional custom CSS class name to attach to inner Grid element. */
    gridClassName?: string;
    /** Optional inline style to attach to inner Grid element. */
    gridStyle?: any;
    /** Optional CSS class to apply to all column headers */
    headerClassName?: string;
    /** Fixed height of header row */
    headerHeight: number;
    /**
     * Responsible for rendering a table row given an array of columns:
     * Should implement the following interface: ({
     *   className: string,
     *   columns: any[],
     *   style: any
     * }): PropTypes.node
     */
    headerRowRenderer?: TableHeaderRowRenderer;
    /** Optional custom inline style to attach to table header columns. */
    headerStyle?: any;
    /** Fixed/available height for out DOM element */
    height?: number;
    /** Optional id */
    id?: string;
    /** Optional renderer to be used in place of table body rows when rowCount is 0 */
    noRowsRenderer?: () => void;
    /**
     * Optional callback when a column's header is clicked.
     * ({ columnData: any, dataKey: string }): void
     */
    onHeaderClick?: (params: HeaderMouseEventHandlerParams) => void;
    /**
     * Callback invoked when a user clicks on a table row.
     * ({ index: number }): void
     */
    onRowClick?: (info: RowMouseEventHandlerParams) => void;
    /**
     * Callback invoked when a user double-clicks on a table row.
     * ({ index: number }): void
     */
    onRowDoubleClick?: (info: RowMouseEventHandlerParams) => void;
    /**
     * Callback invoked when the mouse leaves a table row.
     * ({ index: number }): void
     */
    onRowMouseOut?: (info: RowMouseEventHandlerParams) => void;
    /**
     * Callback invoked when a user moves the mouse over a table row.
     * ({ index: number }): void
     */
    onRowMouseOver?: (info: RowMouseEventHandlerParams) => void;
    /**
     * Callback invoked with information about the slice of rows that were just rendered.
     * ({ startIndex, stopIndex }): void
     */
    onRowsRendered?: (info: IndexRange & OverscanIndexRange) => void;
    /**
     * Callback invoked whenever the scroll offset changes within the inner scrollable region.
     * This callback can be used to sync scrolling between lists, tables, or grids.
     * ({ clientHeight, scrollHeight, scrollTop }): void
     */
    onScroll?: (info: ScrollEventData) => void;
    /**
     * Number of rows to render above/below the visible bounds of the list.
     * These rows can help for smoother scrolling on touch devices.
     */
    overscanRowCount?: number;
    /**
     * Optional CSS class to apply to all table rows (including the header row).
     * This property can be a CSS class name (string) or a function that returns a class name.
     * If a function is provided its signature should be: ({ index: number }): string
     */
    rowClassName?: string | ((info: Index) => string);
    /**
     * Callback responsible for returning a data row given an index.
     * ({ index: number }): any
     */
    rowGetter?: (info: Index) => any;
    /**
     * Either a fixed row height (number) or a function that returns the height of a row given its index.
     * ({ index: number }): number
     */
    rowHeight: number | ((info: Index) => number);
    /** Number of rows in table. */
    rowCount: number;
    /**
     * Responsible for rendering a table row given an array of columns:
     * Should implement the following interface: ({
     *   className: string,
     *   columns: Array,
     *   index: number,
     *   isScrolling: boolean,
     *   onRowClick: ?Function,
     *   onRowDoubleClick: ?Function,
     *   onRowMouseOver: ?Function,
     *   onRowMouseOut: ?Function,
     *   rowData: any,
     *   style: any
     * }): PropTypes.node
     */
    rowRenderer?: TableRowRenderer;
    /** Optional custom inline style to attach to table rows. */
    rowStyle?: React.CSSProperties | ((info: Index) => React.CSSProperties);
    /** See Grid#scrollToAlignment */
    scrollToAlignment?: string;
    /** Row index to ensure visible (by forcefully scrolling if necessary) */
    scrollToIndex?: number;
    /** Vertical offset. */
    scrollTop?: number;
    /**
     * Sort function to be called if a sortable header is clicked.
     * ({ sortBy: string, sortDirection: SortDirection }): void
     */
    sort?: (info: { sortBy: string; sortDirection: SortDirectionType }) => void;
    /** Table data is currently sorted by this :dataKey (if it is sorted at all) */
    sortBy?: string;
    /** Table data is currently sorted in this direction (if it is sorted at all) */
    sortDirection?: SortDirectionType;
    /** Optional inline style */
    style?: React.CSSProperties;
    /** Tab index for focus */
    tabIndex?: number | null;
    /** Width of list */
    width?: number;
};

export const defaultCellDataGetter: TableCellDataGetter;
export const defaultCellRenderer: TableCellRenderer;
export const defaultHeaderRenderer: () => React.ReactElement<
    TableHeaderProps
>[];
export const defaultHeaderRowRenderer: TableHeaderRowRenderer;
export const defaultRowRenderer: TableRowRenderer;

export type SortDirectionStatic = {
    /**
     * Sort items in ascending order.
     * This means arranging from the lowest value to the highest (e.g. a-z, 0-9).
     */
    ASC: "ASC";

    /**
     * Sort items in descending order.
     * This means arranging from the highest value to the lowest (e.g. z-a, 9-0).
     */
    DESC: "DESC";
};

export const SortDirection: SortDirectionStatic;

export type SortDirectionType = "ASC" | "DESC";

export const SortIndicator: React.StatelessComponent<{
    sortDirection?: SortDirectionType;
}>;

/**
 * Table component with fixed headers and virtualized rows for improved performance with large data sets.
 * This component expects explicit width, height, and padding parameters.
 */

type VirtualizedTable = {
    "aria-label": string
        autoHeight: boolean
        children: Column
        className: string
        disableHeader: boolean
        estimatedRowSize: number
        gridClassName: string
        gridStyle: React.CSSProperties
        headerClassName: string
        headerHeight: number
        headerRowRenderer: TableHeaderRowRenderer
        headerStyle: React.CSSProperties
        height: number
        id: string
        noRowsRenderer: () => JSX.Element
        onHeaderClick: 
            (params: HeaderMouseEventHandlerParams) => void
        
        onRowClick: (params: RowMouseEventHandlerParams) => void
        onRowDoubleClick: 
            (params: RowMouseEventHandlerParams) => void
        
        onRowMouseOut: 
            (params: RowMouseEventHandlerParams) => void
        
        onRowMouseOver: 
            (params: RowMouseEventHandlerParams) => void
        
        onRowsRendered: 
            (params: RowMouseEventHandlerParams) => void
        
        onScroll: (params: ScrollEventData) => void
        overscanRowCount: number
        rowClassName: string | ((params: Index) => string)
        rowGetter: (params: Index) => any
        rowHeight: number | ((params: Index) => number)
        rowCount: number
        rowRenderer: (props: TableRowProps) => React.ReactNode
        rowStyle: 
            React.CSSProperties | ((params: Index) => React.CSSProperties)
        
        scrollToAlignment: Alignment
        scrollToIndex: number
        scrollTop: number
        sort: 
            (
                params: { sortBy: string; sortDirection: SortDirectionType }
            ) => void
        
        sortBy: string
        sortDirection: SortDirectionType
        style: React.CSSProperties
        tabIndex: number
        width: number
}
export class Table extends PureComponent<TableProps> implements VirtualizedTable {
    static propTypes: {
        "aria-label": string
        autoHeight: boolean
        children: Column
        className: string
        disableHeader: boolean
        estimatedRowSize: number
        gridClassName: string
        gridStyle: React.CSSProperties
        headerClassName: string
        headerHeight: number
        headerRowRenderer: TableHeaderRowRenderer
        headerStyle: React.CSSProperties
        height: number
        id: string
        noRowsRenderer: () => JSX.Element
        onHeaderClick: 
            (params: HeaderMouseEventHandlerParams) => void
        
        onRowClick: (params: RowMouseEventHandlerParams) => void
        onRowDoubleClick: 
            (params: RowMouseEventHandlerParams) => void
        
        onRowMouseOut: 
            (params: RowMouseEventHandlerParams) => void
        
        onRowMouseOver: 
            (params: RowMouseEventHandlerParams) => void
        
        onRowsRendered: 
            (params: RowMouseEventHandlerParams) => void
        
        onScroll: (params: ScrollEventData) => void
        overscanRowCount: number
        rowClassName: string | ((params: Index) => string)
        rowGetter: (params: Index) => any
        rowHeight: number | ((params: Index) => number)
        rowCount: number
        rowRenderer: (props: TableRowProps) => React.ReactNode
        rowStyle: 
            React.CSSProperties | ((params: Index) => React.CSSProperties)
        
        scrollToAlignment: Alignment
        scrollToIndex: number
        scrollTop: number
        sort: 
            (
                params: { sortBy: string; sortDirection: SortDirectionType }
            ) => void
        
        sortBy: string
        sortDirection: SortDirectionType
        style: React.CSSProperties
        tabIndex: number
        width: number
    };

    static defaultProps: {
        disableHeader: false;
        estimatedRowSize: 30;
        headerHeight: 0;
        headerStyle: {};
        noRowsRenderer: () => null;
        onRowsRendered: () => null;
        onScroll: () => null;
        overscanRowCount: 10;
        rowRenderer: TableRowRenderer;
        headerRowRenderer: TableHeaderRenderer;
        rowStyle: {};
        scrollToAlignment: "auto";
        scrollToIndex: -1;
        style: {};
    };

    Grid: Grid;

    forceUpdateGrid(): void;

    /** See Grid#getOffsetForCell */
    getOffsetForRow(params: { alignment?: Alignment; index?: number }): number;

    /** See Grid#scrollToPosition */
    scrollToPosition(scrollTop?: number): void;

    /** See Grid#measureAllCells */
    measureAllRows(): void;

    /** See Grid#recomputeGridSize */
    recomputeRowHeights(index?: number): void;

    /** See Grid#scrollToCell */
    scrollToRow(index?: number): void;
}


/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export const IS_SCROLLING_TIMEOUT = 150;

export type WindowScrollerChildProps = {
    height: number;
    width: number;
    isScrolling: boolean;
    scrollTop: number;
    scrollLeft: number;
    onChildScroll: (params: { scrollTop: number }) => void;
};

export type WindowScrollerProps = {
    /**
     * Function responsible for rendering children.
     * This function should implement the following signature:
     * ({ height, isScrolling, scrollLeft, scrollTop, width, onChildScroll }) => PropTypes.element
     */
    children: (params: WindowScrollerChildProps) => React.ReactNode;

    /** Callback to be invoked on-resize: ({ height, width }) */
    onResize?: (params: { height: number; width: number }) => void;

    /** Callback to be invoked on-scroll: ({ scrollLeft, scrollTop }) */
    onScroll?: (params: { scrollLeft: number; scrollTop: number }) => void;

    /** Element to attach scroll event listeners. Defaults to window. */
    scrollElement?: typeof window | Element;
    /**
     * Wait this amount of time after the last scroll event before resetting child `pointer-events`.
     */
    scrollingResetTimeInterval?: number;

    /** Height used for server-side rendering */
    serverHeight?: number;

    /** Width used for server-side rendering */
    serverWidth?: number;
    /**
     * PLEASE NOTE
     * The [key: string]: any; line is here on purpose
     * This is due to the need of force re-render of PureComponent
     * Check the following link if you want to know more
     * https://github.com/bvaughn/react-virtualized#pass-thru-props
     */
    [key: string]: any;
};

export type WindowScrollerState = {
    height: number;
    width: number;
    isScrolling: boolean;
    scrollLeft: number;
    scrollTop: number;
};

export class WindowScroller extends PureComponent<
    WindowScrollerProps,
    WindowScrollerState
> {
    static defaultProps: {
        onResize: () => void;
        onScroll: () => void;
        scrollingResetTimeInterval: typeof IS_SCROLLING_TIMEOUT;
        scrollElement: Window | undefined;
        serverHeight: 0;
        serverWidth: 0;
    };

    updatePosition(scrollElement?: HTMLElement): void;
}
