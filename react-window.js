import memoizeOne from 'memoize-one';
import { createElement, PureComponent } from 'react';

function areEqual(prevProps, nextProps) {
    const { style: prevStyle, ...prevRest } = prevProps;
    const { style: nextStyle, ...nextRest } = nextProps;
    return !shallowDiffers(prevStyle, nextStyle) && !shallowDiffers(prevRest, nextRest);
}

const IS_SCROLLING_DEBOUNCE_INTERVAL = 150;
const defaultItemKey = ({ columnIndex, data, rowIndex }) => `${rowIndex}:${columnIndex}`;
let devWarningsTagName = null;
{
    if (typeof window.WeakSet !== 'undefined') {
        devWarningsTagName = new WeakSet();
    }
}
function createGridComponent({ getColumnOffset, getColumnStartIndexForOffset, getColumnStopIndexForStartIndex, getColumnWidth, getEstimatedTotalHeight, getEstimatedTotalWidth, getOffsetForColumnAndAlignment, getOffsetForRowAndAlignment, getRowHeight, getRowOffset, getRowStartIndexForOffset, getRowStopIndexForStartIndex, initInstanceProps, shouldResetStyleCacheOnItemSizeChange, validateProps }) {
    var _a;
    return _a = class Grid extends PureComponent {
            constructor(props) {
                super(props);
                this._instanceProps = initInstanceProps(this.props, this);
                this._resetIsScrollingTimeoutId = null;
                this.state = {
                    instance: this,
                    isScrolling: false,
                    horizontalScrollDirection: 'forward',
                    scrollLeft: typeof this.props.initialScrollLeft === 'number'
                        ? this.props.initialScrollLeft
                        : 0,
                    scrollTop: typeof this.props.initialScrollTop === 'number'
                        ? this.props.initialScrollTop
                        : 0,
                    scrollUpdateWasRequested: false,
                    verticalScrollDirection: 'forward',
                };
                this._callOnItemsRendered = memoizeOne((overscanColumnStartIndex, overscanColumnStopIndex, overscanRowStartIndex, overscanRowStopIndex, visibleColumnStartIndex, visibleColumnStopIndex, visibleRowStartIndex, visibleRowStopIndex) => this.props.onItemsRendered({
                    overscanColumnStartIndex,
                    overscanColumnStopIndex,
                    overscanRowStartIndex,
                    overscanRowStopIndex,
                    visibleColumnStartIndex,
                    visibleColumnStopIndex,
                    visibleRowStartIndex,
                    visibleRowStopIndex,
                }));
                this._callOnScroll = memoizeOne((scrollLeft, scrollTop, horizontalScrollDirection, verticalScrollDirection, scrollUpdateWasRequested) => this.props.onScroll({
                    horizontalScrollDirection,
                    scrollLeft,
                    scrollTop,
                    verticalScrollDirection,
                    scrollUpdateWasRequested,
                }));
                this._getItemStyle = (rowIndex, columnIndex) => {
                    const { columnWidth, direction, rowHeight } = this.props;
                    const itemStyleCache = this._getItemStyleCache(shouldResetStyleCacheOnItemSizeChange && columnWidth, shouldResetStyleCacheOnItemSizeChange && direction, shouldResetStyleCacheOnItemSizeChange && rowHeight);
                    const key = `${rowIndex}:${columnIndex}`;
                    let style;
                    if (itemStyleCache.hasOwnProperty(key)) {
                        style = itemStyleCache[key];
                    }
                    else {
                        itemStyleCache[key] = style = {
                            position: 'absolute',
                            [direction === 'rtl' ? 'right' : 'left']: getColumnOffset(this.props, columnIndex, this._instanceProps),
                            top: getRowOffset(this.props, rowIndex, this._instanceProps),
                            height: getRowHeight(this.props, rowIndex, this._instanceProps),
                            width: getColumnWidth(this.props, columnIndex, this._instanceProps),
                        };
                    }
                    return style;
                };
                this._getItemStyleCache = memoizeOne((_, __, ___) => ({}));
                this._onScroll = event => {
                    const { clientWidth, scrollLeft, scrollTop, scrollWidth, } = event.currentTarget;
                    this.setState(prevState => {
                        if (prevState.scrollLeft === scrollLeft &&
                            prevState.scrollTop === scrollTop) {
                            return null;
                        }
                        const { direction } = this.props;
                        let calculatedScrollLeft = scrollLeft;
                        if (direction === 'rtl') {
                            if (scrollLeft <= 0) {
                                calculatedScrollLeft = -scrollLeft;
                            }
                            else {
                                calculatedScrollLeft = scrollWidth - clientWidth - scrollLeft;
                            }
                        }
                        return {
                            isScrolling: true,
                            horizontalScrollDirection: prevState.scrollLeft < scrollLeft ? 'forward' : 'backward',
                            scrollLeft: calculatedScrollLeft,
                            scrollTop,
                            verticalScrollDirection: prevState.scrollTop < scrollTop ? 'forward' : 'backward',
                            scrollUpdateWasRequested: false,
                        };
                    }, this._resetIsScrollingDebounced);
                };
                this._outerRefSetter = ref => {
                    const { outerRef } = this.props;
                    this._outerRef = (ref);
                    if (typeof outerRef === 'function') {
                        outerRef(ref);
                    }
                    else if (outerRef != null &&
                        typeof outerRef === 'object' &&
                        outerRef.hasOwnProperty('current')) {
                        outerRef.current = ref;
                    }
                };
                this._resetIsScrollingDebounced = () => {
                    if (this._resetIsScrollingTimeoutId !== null) {
                        cancelTimeout(this._resetIsScrollingTimeoutId);
                    }
                    this._resetIsScrollingTimeoutId = requestTimeout(this._resetIsScrolling, IS_SCROLLING_DEBOUNCE_INTERVAL);
                };
                this._resetIsScrolling = () => {
                    this._resetIsScrollingTimeoutId = null;
                    this.setState({ isScrolling: false }, () => {
                        this._getItemStyleCache(-1);
                    });
                };
                this.props = props;
            }
            static getDerivedStateFromProps(nextProps, prevState) {
                validateSharedProps(nextProps, prevState);
                validateProps(nextProps);
                return null;
            }
            scrollTo({ scrollLeft, scrollTop }) {
                this.setState(prevState => {
                    if (scrollLeft === undefined) {
                        scrollLeft = prevState.scrollLeft;
                    }
                    if (scrollTop === undefined) {
                        scrollTop = prevState.scrollTop;
                    }
                    return {
                        horizontalScrollDirection: prevState.scrollLeft < scrollLeft ? 'forward' : 'backward',
                        scrollLeft: scrollLeft,
                        scrollTop: scrollTop,
                        scrollUpdateWasRequested: true,
                        verticalScrollDirection: prevState.scrollTop < scrollTop ? 'forward' : 'backward',
                    };
                }, this._resetIsScrollingDebounced);
            }
            scrollToItem({ align = 'auto', columnIndex, rowIndex }) {
                const { height, width } = this.props;
                const { scrollLeft, scrollTop } = this.state;
                const scrollbarSize = getScrollbarSize();
                const estimatedTotalHeight = getEstimatedTotalHeight(this.props, this._instanceProps);
                const estimatedTotalWidth = getEstimatedTotalWidth(this.props, this._instanceProps);
                const horizontalScrollbarSize = estimatedTotalWidth > width ? scrollbarSize : 0;
                const verticalScrollbarSize = estimatedTotalHeight > height ? scrollbarSize : 0;
                this.scrollTo({
                    scrollLeft: getOffsetForColumnAndAlignment(this.props, columnIndex, align, scrollLeft, this._instanceProps, verticalScrollbarSize),
                    scrollTop: getOffsetForRowAndAlignment(this.props, rowIndex, align, scrollTop, this._instanceProps, horizontalScrollbarSize),
                });
            }
            componentDidMount() {
                const { initialScrollLeft, initialScrollTop } = this.props;
                if (typeof initialScrollLeft === 'number' && this._outerRef != null) {
                    (this._outerRef).scrollLeft = initialScrollLeft;
                }
                if (typeof initialScrollTop === 'number' && this._outerRef != null) {
                    (this._outerRef).scrollTop = initialScrollTop;
                }
                this._callPropsCallbacks();
            }
            componentDidUpdate() {
                const { scrollLeft, scrollTop, scrollUpdateWasRequested } = this.state;
                if (scrollUpdateWasRequested && this._outerRef !== null) {
                    (this._outerRef).scrollLeft = scrollLeft;
                    (this._outerRef).scrollTop = scrollTop;
                }
                this._callPropsCallbacks();
            }
            componentWillUnmount() {
                if (this._resetIsScrollingTimeoutId !== null) {
                    cancelTimeout(this._resetIsScrollingTimeoutId);
                }
            }
            render() {
                const { children, className, columnCount, direction, height, innerRef, innerElementType, innerTagName, itemData, itemKey = defaultItemKey, outerElementType, outerTagName, rowCount, style, useIsScrolling, width, } = this.props;
                const { isScrolling } = this.state;
                const [columnStartIndex, columnStopIndex,] = this._getHorizontalRangeToRender();
                const [rowStartIndex, rowStopIndex] = this._getVerticalRangeToRender();
                const items = [];
                if (columnCount > 0 && rowCount) {
                    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
                            items.push(createElement(children, {
                                columnIndex,
                                data: itemData,
                                isScrolling: useIsScrolling ? isScrolling : undefined,
                                key: itemKey({ columnIndex, data: itemData, rowIndex }),
                                rowIndex,
                                style: this._getItemStyle(rowIndex, columnIndex),
                            }));
                        }
                    }
                }
                const estimatedTotalHeight = getEstimatedTotalHeight(this.props, this._instanceProps);
                const estimatedTotalWidth = getEstimatedTotalWidth(this.props, this._instanceProps);
                return createElement(outerElementType || outerTagName || 'div', {
                    className,
                    onScroll: this._onScroll,
                    ref: this._outerRefSetter,
                    style: {
                        position: 'relative',
                        height,
                        width,
                        overflow: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        willChange: 'transform',
                        direction,
                        ...style,
                    },
                }, createElement(innerElementType || innerTagName || 'div', {
                    children: items,
                    ref: innerRef,
                    style: {
                        height: estimatedTotalHeight,
                        pointerEvents: isScrolling ? 'none' : '',
                        width: estimatedTotalWidth,
                    },
                }));
            }
            _callPropsCallbacks() {
                const { columnCount, onItemsRendered, onScroll, rowCount } = this.props;
                if (typeof onItemsRendered === 'function') {
                    if (columnCount > 0 && rowCount > 0) {
                        const [overscanColumnStartIndex, overscanColumnStopIndex, visibleColumnStartIndex, visibleColumnStopIndex,] = this._getHorizontalRangeToRender();
                        const [overscanRowStartIndex, overscanRowStopIndex, visibleRowStartIndex, visibleRowStopIndex,] = this._getVerticalRangeToRender();
                        this._callOnItemsRendered(overscanColumnStartIndex, overscanColumnStopIndex, overscanRowStartIndex, overscanRowStopIndex, visibleColumnStartIndex, visibleColumnStopIndex, visibleRowStartIndex, visibleRowStopIndex);
                    }
                }
                if (typeof onScroll === 'function') {
                    const { horizontalScrollDirection, scrollLeft, scrollTop, scrollUpdateWasRequested, verticalScrollDirection, } = this.state;
                    this._callOnScroll(scrollLeft, scrollTop, horizontalScrollDirection, verticalScrollDirection, scrollUpdateWasRequested);
                }
            }
            _getHorizontalRangeToRender() {
                const { columnCount, overscanColumnsCount, overscanCount, rowCount, } = this.props;
                const { horizontalScrollDirection, isScrolling, scrollLeft } = this.state;
                const overscanCountResolved = overscanColumnsCount || overscanCount || 1;
                if (columnCount === 0 || rowCount === 0) {
                    return [0, 0, 0, 0];
                }
                const startIndex = getColumnStartIndexForOffset(this.props, scrollLeft, this._instanceProps);
                const stopIndex = getColumnStopIndexForStartIndex(this.props, startIndex, scrollLeft, this._instanceProps);
                const overscanBackward = !isScrolling || horizontalScrollDirection === 'backward'
                    ? Math.max(1, overscanCountResolved)
                    : 1;
                const overscanForward = !isScrolling || horizontalScrollDirection === 'forward'
                    ? Math.max(1, overscanCountResolved)
                    : 1;
                return [
                    Math.max(0, startIndex - overscanBackward),
                    Math.max(0, Math.min(columnCount - 1, stopIndex + overscanForward)),
                    startIndex,
                    stopIndex,
                ];
            }
            _getVerticalRangeToRender() {
                const { columnCount, overscanCount, overscanRowsCount, rowCount, } = this.props;
                const { isScrolling, verticalScrollDirection, scrollTop } = this.state;
                const overscanCountResolved = overscanRowsCount || overscanCount || 1;
                if (columnCount === 0 || rowCount === 0) {
                    return [0, 0, 0, 0];
                }
                const startIndex = getRowStartIndexForOffset(this.props, scrollTop, this._instanceProps);
                const stopIndex = getRowStopIndexForStartIndex(this.props, startIndex, scrollTop, this._instanceProps);
                const overscanBackward = !isScrolling || verticalScrollDirection === 'backward'
                    ? Math.max(1, overscanCountResolved)
                    : 1;
                const overscanForward = !isScrolling || verticalScrollDirection === 'forward'
                    ? Math.max(1, overscanCountResolved)
                    : 1;
                return [
                    Math.max(0, startIndex - overscanBackward),
                    Math.max(0, Math.min(rowCount - 1, stopIndex + overscanForward)),
                    startIndex,
                    stopIndex,
                ];
            }
        }, _a.defaultProps = {
            direction: 'ltr',
            itemData: undefined,
            useIsScrolling: false,
        }, _a;
}



function createListComponent({ getItemOffset, getEstimatedTotalSize, getItemSize, getOffsetForIndexAndAlignment, getStartIndexForOffset, getStopIndexForStartIndex, initInstanceProps, shouldResetStyleCacheOnItemSizeChange, validateProps }) {
    var _a;
    return _a = class List extends PureComponent {
            constructor(props) {
                super(props);
                this._instanceProps = initInstanceProps(this.props, this);
                this._resetIsScrollingTimeoutId = null;
                this.state = {
                    instance: this,
                    isScrolling: false,
                    scrollDirection: 'forward',
                    scrollOffset: typeof this.props.initialScrollOffset === 'number'
                        ? this.props.initialScrollOffset
                        : 0,
                    scrollUpdateWasRequested: false,
                };
                this._callOnItemsRendered = memoizeOne((overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex) => this.props.onItemsRendered({
                    overscanStartIndex,
                    overscanStopIndex,
                    visibleStartIndex,
                    visibleStopIndex,
                }));
                this._callOnScroll = memoizeOne((scrollDirection, scrollOffset, scrollUpdateWasRequested) => this.props.onScroll({
                    scrollDirection,
                    scrollOffset,
                    scrollUpdateWasRequested,
                }));
                this._getItemStyle = index => {
                    const { direction, itemSize, layout } = this.props;
                    const itemStyleCache = this._getItemStyleCache(shouldResetStyleCacheOnItemSizeChange && itemSize, shouldResetStyleCacheOnItemSizeChange && layout, shouldResetStyleCacheOnItemSizeChange && direction);
                    let style;
                    if (itemStyleCache.hasOwnProperty(index)) {
                        style = itemStyleCache[index];
                    }
                    else {
                        const offset = getItemOffset(this.props, index, this._instanceProps);
                        const size = getItemSize(this.props, index, this._instanceProps);
                        const isHorizontal = direction === 'horizontal' || layout === 'horizontal';
                        itemStyleCache[index] = style = {
                            position: 'absolute',
                            [direction === 'rtl' ? 'right' : 'left']: isHorizontal ? offset : 0,
                            top: !isHorizontal ? offset : 0,
                            height: !isHorizontal ? size : '100%',
                            width: isHorizontal ? size : '100%',
                        };
                    }
                    return style;
                };
                this._getItemStyleCache = memoizeOne((_, __, ___) => ({}));
                this._onScrollHorizontal = event => {
                    const { clientWidth, scrollLeft, scrollWidth } = event.currentTarget;
                    this.setState(prevState => {
                        if (prevState.scrollOffset === scrollLeft) {
                            return null;
                        }
                        const { direction } = this.props;
                        let scrollOffset = scrollLeft;
                        if (direction === 'rtl') {
                            if (scrollLeft <= 0) {
                                scrollOffset = -scrollOffset;
                            }
                            else {
                                scrollOffset = scrollWidth - clientWidth - scrollLeft;
                            }
                        }
                        return {
                            isScrolling: true,
                            scrollDirection: prevState.scrollOffset < scrollLeft ? 'forward' : 'backward',
                            scrollOffset,
                            scrollUpdateWasRequested: false,
                        };
                    }, this._resetIsScrollingDebounced);
                };
                this._onScrollVertical = event => {
                    const { scrollTop } = event.currentTarget;
                    this.setState(prevState => {
                        if (prevState.scrollOffset === scrollTop) {
                            return null;
                        }
                        return {
                            isScrolling: true,
                            scrollDirection: prevState.scrollOffset < scrollTop ? 'forward' : 'backward',
                            scrollOffset: scrollTop,
                            scrollUpdateWasRequested: false,
                        };
                    }, this._resetIsScrollingDebounced);
                };
                this._outerRefSetter = ref => {
                    const { outerRef } = this.props;
                    this._outerRef = (ref);
                    if (typeof outerRef === 'function') {
                        outerRef(ref);
                    }
                    else if (outerRef != null &&
                        typeof outerRef === 'object' &&
                        outerRef.hasOwnProperty('current')) {
                        outerRef.current = ref;
                    }
                };
                this._resetIsScrollingDebounced = () => {
                    if (this._resetIsScrollingTimeoutId !== null) {
                        cancelTimeout(this._resetIsScrollingTimeoutId);
                    }
                    this._resetIsScrollingTimeoutId = requestTimeout(this._resetIsScrolling, IS_SCROLLING_DEBOUNCE_INTERVAL);
                };
                this._resetIsScrolling = () => {
                    this._resetIsScrollingTimeoutId = null;
                    this.setState({ isScrolling: false }, () => {
                        this._getItemStyleCache(-1, null);
                    });
                };
                this.props = props;
            }
            static getDerivedStateFromProps(nextProps, prevState) {
                validateSharedProps(nextProps, prevState);
                validateProps(nextProps);
                return null;
            }
            scrollTo(scrollOffset) {
                this.setState(prevState => ({
                    scrollDirection: prevState.scrollOffset < scrollOffset ? 'forward' : 'backward',
                    scrollOffset: scrollOffset,
                    scrollUpdateWasRequested: true
                }), this._resetIsScrollingDebounced);
            }
            scrollToItem(index, align = 'auto') {
                const { scrollOffset } = this.state;
                this.scrollTo(getOffsetForIndexAndAlignment(this.props, index, align, scrollOffset, this._instanceProps));
            }
            componentDidMount() {
                const { direction, initialScrollOffset, layout } = this.props;
                if (typeof initialScrollOffset === 'number' && this._outerRef !== null) {
                    if (direction === 'horizontal' || layout === 'horizontal') {
                        (this._outerRef).scrollLeft = initialScrollOffset;
                    }
                    else {
                        (this._outerRef).scrollTop = initialScrollOffset;
                    }
                }
                this._callPropsCallbacks();
            }
            componentDidUpdate() {
                const { direction, layout } = this.props;
                const { scrollOffset, scrollUpdateWasRequested } = this.state;
                if (scrollUpdateWasRequested && this._outerRef !== null) {
                    if (direction === 'horizontal' || layout === 'horizontal') {
                        (this._outerRef).scrollLeft = scrollOffset;
                    }
                    else {
                        (this._outerRef).scrollTop = scrollOffset;
                    }
                }
                this._callPropsCallbacks();
            }
            componentWillUnmount() {
                if (this._resetIsScrollingTimeoutId !== null) {
                    cancelTimeout(this._resetIsScrollingTimeoutId);
                }
            }
            render() {
                const { children, className, direction, height, innerRef, innerElementType, innerTagName, itemCount, itemData, itemKey = defaultItemKey, layout, outerElementType, outerTagName, style, useIsScrolling, width, } = this.props;
                const { isScrolling } = this.state;
                const isHorizontal = direction === 'horizontal' || layout === 'horizontal';
                const onScroll = isHorizontal
                    ? this._onScrollHorizontal
                    : this._onScrollVertical;
                const [startIndex, stopIndex] = this._getRangeToRender();
                const items = [];
                if (itemCount > 0) {
                    for (let index = startIndex; index <= stopIndex; index++) {
                        items.push(createElement(children, {
                            data: itemData,
                            key: itemKey(index, itemData),
                            index,
                            isScrolling: useIsScrolling ? isScrolling : undefined,
                            style: this._getItemStyle(index),
                        }));
                    }
                }
                const estimatedTotalSize = getEstimatedTotalSize(this.props, this._instanceProps);
                return createElement(outerElementType || outerTagName || 'div', {
                    className,
                    onScroll,
                    ref: this._outerRefSetter,
                    style: {
                        position: 'relative',
                        height,
                        width,
                        overflow: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        willChange: 'transform',
                        direction,
                        ...style,
                    },
                }, createElement(innerElementType || innerTagName || 'div', {
                    children: items,
                    ref: innerRef,
                    style: {
                        height: isHorizontal ? '100%' : estimatedTotalSize,
                        pointerEvents: isScrolling ? 'none' : '',
                        width: isHorizontal ? estimatedTotalSize : '100%',
                    },
                }));
            }
            _callPropsCallbacks() {
                if (typeof this.props.onItemsRendered === 'function') {
                    const { itemCount } = this.props;
                    if (itemCount > 0) {
                        const [overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex,] = this._getRangeToRender();
                        this._callOnItemsRendered(overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex);
                    }
                }
                if (typeof this.props.onScroll === 'function') {
                    const { scrollDirection, scrollOffset, scrollUpdateWasRequested, } = this.state;
                    this._callOnScroll(scrollDirection, scrollOffset, scrollUpdateWasRequested);
                }
            }
            _getRangeToRender() {
                const { itemCount, overscanCount } = this.props;
                const { isScrolling, scrollDirection, scrollOffset } = this.state;
                if (itemCount === 0) {
                    return [0, 0, 0, 0];
                }
                const startIndex = getStartIndexForOffset(this.props, scrollOffset, this._instanceProps);
                const stopIndex = getStopIndexForStartIndex(this.props, startIndex, scrollOffset, this._instanceProps);
                const overscanBackward = !isScrolling || scrollDirection === 'backward'
                    ? Math.max(1, overscanCount)
                    : 1;
                const overscanForward = !isScrolling || scrollDirection === 'forward'
                    ? Math.max(1, overscanCount)
                    : 1;
                return [
                    Math.max(0, startIndex - overscanBackward),
                    Math.max(0, Math.min(itemCount - 1, stopIndex + overscanForward)),
                    startIndex,
                    stopIndex,
                ];
            }
        }, _a.defaultProps = {
            direction: 'ltr',
            itemData: undefined,
            layout: 'vertical',
            overscanCount: 2,
            useIsScrolling: false,
        }, _a;
}
const validateSharedProps = ({ children, direction, height, layout, innerTagName, outerTagName, width }, { instance }) => {
    {
        if (innerTagName != null || outerTagName != null) {
            if (devWarningsTagName && !devWarningsTagName.has(instance)) {
                devWarningsTagName.add(instance);
                console.warn('The innerTagName and outerTagName props have been deprecated. ' +
                    'Please use the innerElementType and outerElementType props instead.');
            }
        }
        const isHorizontal = direction === 'horizontal' || layout === 'horizontal';
        switch (direction) {
            case 'horizontal':
            case 'vertical':
                if (devWarningsDirection && !devWarningsDirection.has(instance)) {
                    devWarningsDirection.add(instance);
                    console.warn('The direction prop should be either "ltr" (default) or "rtl". ' +
                        'Please use the layout prop to specify "vertical" (default) or "horizontal" orientation.');
                }
                break;
            case 'ltr':
            case 'rtl':
                break;
            default:
                throw Error('An invalid "direction" prop has been specified. ' +
                    'Value should be either "ltr" or "rtl". ' +
                    `"${direction}" was specified.`);
        }
        switch (layout) {
            case 'horizontal':
            case 'vertical':
                break;
            default:
                throw Error('An invalid "layout" prop has been specified. ' +
                    'Value should be either "horizontal" or "vertical". ' +
                    `"${layout}" was specified.`);
        }
        if (children == null) {
            throw Error('An invalid "children" prop has been specified. ' +
                'Value should be a React component. ' +
                `"${children === null ? 'null' : typeof children}" was specified.`);
        }
        if (isHorizontal && typeof width !== 'number') {
            throw Error('An invalid "width" prop has been specified. ' +
                'Horizontal lists must specify a number for width. ' +
                `"${width === null ? 'null' : typeof width}" was specified.`);
        }
        else if (!isHorizontal && typeof height !== 'number') {
            throw Error('An invalid "height" prop has been specified. ' +
                'Vertical lists must specify a number for height. ' +
                `"${height === null ? 'null' : typeof height}" was specified.`);
        }
    }
};

let size = -1;
function getScrollbarSize(recalculate = false) {
    if (size === -1 || recalculate) {
        const div = document.createElement('div');
        const style = div.style;
        style.width = '50px';
        style.height = '50px';
        style.overflow = 'scroll';
        (document.body).appendChild(div);
        size = div.offsetWidth - div.clientWidth;
        (document.body).removeChild(div);
    }
    return size;
}

const FixedSizeGrid = createGridComponent({
    getColumnOffset: ({ columnWidth }, index) => index * (columnWidth),
    getColumnWidth: ({ columnWidth }, index) => columnWidth,
    getRowOffset: ({ rowHeight }, index) => index * (rowHeight),
    getRowHeight: ({ rowHeight }, index) => rowHeight,
    getEstimatedTotalHeight: ({ rowCount, rowHeight }) => (rowHeight) * rowCount,
    getEstimatedTotalWidth: ({ columnCount, columnWidth }) => (columnWidth) * columnCount,
    getOffsetForColumnAndAlignment: ({ columnCount, columnWidth, width }, columnIndex, align, scrollLeft, instanceProps, scrollbarSize) => {
        const maxOffset = Math.max(0, Math.min(columnCount * (columnWidth) - width, columnIndex * (columnWidth)));
        const minOffset = Math.max(0, columnIndex * (columnWidth) -
            width +
            scrollbarSize +
            (columnWidth));
        switch (align) {
            case 'start':
                return maxOffset;
            case 'end':
                return minOffset;
            case 'center':
                return Math.round(minOffset + (maxOffset - minOffset) / 2);
            case 'auto':
            default:
                if (scrollLeft >= minOffset && scrollLeft <= maxOffset) {
                    return scrollLeft;
                }
                else if (scrollLeft - minOffset < maxOffset - scrollLeft) {
                    return minOffset;
                }
                else {
                    return maxOffset;
                }
        }
    },
    getOffsetForRowAndAlignment: ({ rowHeight, height, rowCount }, rowIndex, align, scrollTop, instanceProps, scrollbarSize) => {
        const maxOffset = Math.max(0, Math.min(rowCount * (rowHeight) - height, rowIndex * (rowHeight)));
        const minOffset = Math.max(0, rowIndex * (rowHeight) -
            height +
            scrollbarSize +
            (rowHeight));
        switch (align) {
            case 'start':
                return maxOffset;
            case 'end':
                return minOffset;
            case 'center':
                return Math.round(minOffset + (maxOffset - minOffset) / 2);
            case 'auto':
            default:
                if (scrollTop >= minOffset && scrollTop <= maxOffset) {
                    return scrollTop;
                }
                else if (scrollTop - minOffset < maxOffset - scrollTop) {
                    return minOffset;
                }
                else {
                    return maxOffset;
                }
        }
    },
    getColumnStartIndexForOffset: ({ columnWidth, columnCount }, scrollLeft) => Math.max(0, Math.min(columnCount - 1, Math.floor(scrollLeft / (columnWidth)))),
    getColumnStopIndexForStartIndex: ({ columnWidth, columnCount, width }, startIndex, scrollLeft) => {
        const left = startIndex * (columnWidth);
        return Math.max(0, Math.min(columnCount - 1, startIndex +
            Math.floor((width + (scrollLeft - left)) / (columnWidth))));
    },
    getRowStartIndexForOffset: ({ rowHeight, rowCount }, scrollTop) => Math.max(0, Math.min(rowCount - 1, Math.floor(scrollTop / (rowHeight)))),
    getRowStopIndexForStartIndex: ({ rowHeight, rowCount, height }, startIndex, scrollTop) => {
        const left = startIndex * (rowHeight);
        return Math.max(0, Math.min(rowCount - 1, startIndex +
            Math.floor((height + (scrollTop - left)) / (rowHeight))));
    },
    initInstanceProps(props) {
    },
    shouldResetStyleCacheOnItemSizeChange: true,
    validateProps: ({ columnWidth, rowHeight }) => {
        {
            if (typeof columnWidth !== 'number') {
                throw Error('An invalid "columnWidth" prop has been specified. ' +
                    'Value should be a number. ' +
                    `"${columnWidth === null ? 'null' : typeof columnWidth}" was specified.`);
            }
            if (typeof rowHeight !== 'number') {
                throw Error('An invalid "rowHeight" prop has been specified. ' +
                    'Value should be a number. ' +
                    `"${rowHeight === null ? 'null' : typeof rowHeight}" was specified.`);
            }
        }
    },
});


const FixedSizeList = createListComponent({
    getItemOffset: ({ itemSize, size }, index) => index * (itemSize),
    getItemSize: ({ itemSize, size }, index) => itemSize,
    getEstimatedTotalSize: ({ itemCount, itemSize }) => (itemSize) * itemCount,
    getOffsetForIndexAndAlignment: ({ direction, height, itemCount, itemSize, layout, width }, index, align, scrollOffset) => {
        const isHorizontal = direction === 'horizontal' || layout === 'horizontal';
        const size = (isHorizontal ? width : height);
        const maxOffset = Math.max(0, Math.min(itemCount * (itemSize) - size, index * (itemSize)));
        const minOffset = Math.max(0, index * (itemSize) - size + (itemSize));
        switch (align) {
            case 'start':
                return maxOffset;
            case 'end':
                return minOffset;
            case 'center':
                return Math.round(minOffset + (maxOffset - minOffset) / 2);
            case 'auto':
            default:
                if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
                    return scrollOffset;
                }
                else if (scrollOffset - minOffset < maxOffset - scrollOffset) {
                    return minOffset;
                }
                else {
                    return maxOffset;
                }
        }
    },
    getStartIndexForOffset: ({ itemCount, itemSize }, offset) => Math.max(0, Math.min(itemCount - 1, Math.floor(offset / (itemSize)))),
    getStopIndexForStartIndex: ({ direction, height, itemCount, itemSize, layout, width }, startIndex, scrollOffset) => {
        const isHorizontal = direction === 'horizontal' || layout === 'horizontal';
        const offset = startIndex * (itemSize);
        const size = (isHorizontal ? width : height);
        return Math.max(0, Math.min(itemCount - 1, startIndex +
            Math.floor((size + (scrollOffset - offset)) / (itemSize))));
    },
    initInstanceProps(props) {
    },
    shouldResetStyleCacheOnItemSizeChange: true,
    validateProps: ({ itemSize }) => {
        {
            if (typeof itemSize !== 'number') {
                throw Error('An invalid "itemSize" prop has been specified. ' +
                    'Value should be a number. ' +
                    `"${itemSize === null ? 'null' : typeof itemSize}" was specified.`);
            }
        }
    },
});


function shallowDiffers(prev, next) {
    for (let attribute in prev) {
        if (!(attribute in next)) {
            return true;
        }
    }
    for (let attribute in next) {
        if (prev[attribute] !== next[attribute]) {
            return true;
        }
    }
    return false;
}

function shouldComponentUpdate(nextProps, nextState) {
    return !areEqual(this.props, nextProps) || shallowDiffers(this.state, nextState);
}

const hasNativePerformanceNow = typeof performance === 'object' && typeof performance.now === 'function';
const now = hasNativePerformanceNow
    ? () => performance.now()
    : () => Date.now();
function cancelTimeout(timeoutID) {
    cancelAnimationFrame(timeoutID.id);
}
function requestTimeout(callback, delay) {
    const start = now();
    function tick() {
        if (now() - start >= delay) {
            callback.call(null);
        }
        else {
            timeoutID.id = requestAnimationFrame(tick);
        }
    }
    const timeoutID = {
        id: requestAnimationFrame(tick),
    };
    return timeoutID;
}

const DEFAULT_ESTIMATED_ITEM_SIZE = 50;
const getEstimatedTotalHeight = ({ rowCount }, { rowMetadataMap, estimatedRowHeight, lastMeasuredRowIndex }) => {
    let totalSizeOfMeasuredRows = 0;
    if (lastMeasuredRowIndex >= rowCount) {
        lastMeasuredRowIndex = rowCount - 1;
    }
    if (lastMeasuredRowIndex >= 0) {
        const itemMetadata = rowMetadataMap[lastMeasuredRowIndex];
        totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
    }
    const numUnmeasuredItems = rowCount - lastMeasuredRowIndex - 1;
    const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedRowHeight;
    return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};
const getEstimatedTotalWidth = ({ columnCount }, { columnMetadataMap, estimatedColumnWidth, lastMeasuredColumnIndex }) => {
    let totalSizeOfMeasuredRows = 0;
    if (lastMeasuredColumnIndex >= columnCount) {
        lastMeasuredColumnIndex = columnCount - 1;
    }
    if (lastMeasuredColumnIndex >= 0) {
        const itemMetadata = columnMetadataMap[lastMeasuredColumnIndex];
        totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
    }
    const numUnmeasuredItems = columnCount - lastMeasuredColumnIndex - 1;
    const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedColumnWidth;
    return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};
const getItemMetadata = (itemType, props, index, instanceProps) => {
    let itemMetadataMap, itemSize, lastMeasuredIndex;
    if (itemType === 'column') {
        itemMetadataMap = instanceProps.columnMetadataMap;
        itemSize = (props.columnWidth);
        lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
    }
    else {
        itemMetadataMap = instanceProps.rowMetadataMap;
        itemSize = (props.rowHeight);
        lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
    }
    if (index > lastMeasuredIndex) {
        let offset = 0;
        if (lastMeasuredIndex >= 0) {
            const itemMetadata = itemMetadataMap[lastMeasuredIndex];
            offset = itemMetadata.offset + itemMetadata.size;
        }
        for (let i = lastMeasuredIndex + 1; i <= index; i++) {
            let size = itemSize(i);
            itemMetadataMap[i] = {
                offset,
                size,
            };
            offset += size;
        }
        if (itemType === 'column') {
            instanceProps.lastMeasuredColumnIndex = index;
        }
        else {
            instanceProps.lastMeasuredRowIndex = index;
        }
    }
    return itemMetadataMap[index];
};
const findNearestItem = (itemType, props, instanceProps, offset) => {
    let itemMetadataMap, lastMeasuredIndex;
    if (itemType === 'column') {
        itemMetadataMap = instanceProps.columnMetadataMap;
        lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
    }
    else {
        itemMetadataMap = instanceProps.rowMetadataMap;
        lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
    }
    const lastMeasuredItemOffset = lastMeasuredIndex > 0 ? itemMetadataMap[lastMeasuredIndex].offset : 0;
    if (lastMeasuredItemOffset >= offset) {
        return findNearestItemBinarySearch(itemType, props, instanceProps, lastMeasuredIndex, 0, offset);
    }
    else {
        return findNearestItemExponentialSearch(itemType, props, instanceProps, Math.max(0, lastMeasuredIndex), offset);
    }
};
const findNearestItemBinarySearch = (itemType, props, instanceProps, high, low, offset) => {
    while (low <= high) {
        const middle = low + Math.floor((high - low) / 2);
        const currentOffset = getItemMetadata(itemType, props, middle, instanceProps).offset;
        if (currentOffset === offset) {
            return middle;
        }
        else if (currentOffset < offset) {
            low = middle + 1;
        }
        else if (currentOffset > offset) {
            high = middle - 1;
        }
    }
    if (low > 0) {
        return low - 1;
    }
    else {
        return 0;
    }
};
const findNearestItemExponentialSearch = (itemType, props, instanceProps, index, offset) => {
    const itemCount = itemType === 'column' ? props.columnCount : props.rowCount;
    let interval = 1;
    while (index < itemCount &&
        getItemMetadata(itemType, props, index, instanceProps).offset < offset) {
        index += interval;
        interval *= 2;
    }
    return findNearestItemBinarySearch(itemType, props, instanceProps, Math.min(index, itemCount - 1), Math.floor(index / 2), offset);
};
const getOffsetForIndexAndAlignment = (itemType, props, index, align, scrollOffset, instanceProps, scrollbarSize) => {
    const size = itemType === 'column' ? props.width : props.height;
    const itemMetadata = getItemMetadata(itemType, props, index, instanceProps);
    const estimatedTotalSize = itemType === 'column'
        ? getEstimatedTotalWidth(props, instanceProps)
        : getEstimatedTotalHeight(props, instanceProps);
    const maxOffset = Math.max(0, Math.min(estimatedTotalSize - size, itemMetadata.offset));
    const minOffset = Math.max(0, itemMetadata.offset - size + scrollbarSize + itemMetadata.size);
    switch (align) {
        case 'start':
            return maxOffset;
        case 'end':
            return minOffset;
        case 'center':
            return Math.round(minOffset + (maxOffset - minOffset) / 2);
        case 'auto':
        default:
            if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
                return scrollOffset;
            }
            else if (scrollOffset - minOffset < maxOffset - scrollOffset) {
                return minOffset;
            }
            else {
                return maxOffset;
            }
    }
};

const VariableSizeGrid = createGridComponent({
    getColumnOffset: (props, index, instanceProps) => getItemMetadata('column', props, index, instanceProps).offset,
    getColumnStartIndexForOffset: (props, scrollLeft, instanceProps) => findNearestItem('column', props, instanceProps, scrollLeft),
    getColumnStopIndexForStartIndex: (props, startIndex, scrollLeft, instanceProps) => {
        const { columnCount, width } = props;
        const itemMetadata = getItemMetadata('column', props, startIndex, instanceProps);
        const maxOffset = scrollLeft + width;
        let offset = itemMetadata.offset + itemMetadata.size;
        let stopIndex = startIndex;
        while (stopIndex < columnCount - 1 && offset < maxOffset) {
            stopIndex++;
            offset += getItemMetadata('column', props, stopIndex, instanceProps).size;
        }
        return stopIndex;
    },
    getColumnWidth: (props, index, instanceProps) => instanceProps.columnMetadataMap[index].size,
    getEstimatedTotalHeight,
    getEstimatedTotalWidth,
    getOffsetForColumnAndAlignment: (props, index, align, scrollOffset, instanceProps, scrollbarSize) => getOffsetForIndexAndAlignment('column', props, index, align, scrollOffset, instanceProps, scrollbarSize),
    getOffsetForRowAndAlignment: (props, index, align, scrollOffset, instanceProps, scrollbarSize) => getOffsetForIndexAndAlignment('row', props, index, align, scrollOffset, instanceProps, scrollbarSize),
    getRowOffset: (props, index, instanceProps) => getItemMetadata('row', props, index, instanceProps).offset,
    getRowHeight: (props, index, instanceProps) => instanceProps.rowMetadataMap[index].size,
    getRowStartIndexForOffset: (props, scrollTop, instanceProps) => findNearestItem('row', props, instanceProps, scrollTop),
    getRowStopIndexForStartIndex: (props, startIndex, scrollTop, instanceProps) => {
        const { rowCount, height } = props;
        const itemMetadata = getItemMetadata('row', props, startIndex, instanceProps);
        const maxOffset = scrollTop + height;
        let offset = itemMetadata.offset + itemMetadata.size;
        let stopIndex = startIndex;
        while (stopIndex < rowCount - 1 && offset < maxOffset) {
            stopIndex++;
            offset += getItemMetadata('row', props, stopIndex, instanceProps).size;
        }
        return stopIndex;
    },
    initInstanceProps(props, instance) {
        const { estimatedColumnWidth, estimatedRowHeight, } = (props);
        const instanceProps = {
            columnMetadataMap: {},
            estimatedColumnWidth: estimatedColumnWidth || DEFAULT_ESTIMATED_ITEM_SIZE,
            estimatedRowHeight: estimatedRowHeight || DEFAULT_ESTIMATED_ITEM_SIZE,
            lastMeasuredColumnIndex: -1,
            lastMeasuredRowIndex: -1,
            rowMetadataMap: {},
        };
        instance.resetAfterColumnIndex = (columnIndex, shouldForceUpdate = true) => {
            instance.resetAfterIndices({ columnIndex, shouldForceUpdate });
        };
        instance.resetAfterRowIndex = (rowIndex, shouldForceUpdate = true) => {
            instance.resetAfterIndices({ rowIndex, shouldForceUpdate });
        };
        instance.resetAfterIndices = ({ columnIndex, rowIndex, shouldForceUpdate = true }) => {
            if (typeof columnIndex === 'number') {
                instanceProps.lastMeasuredColumnIndex = Math.min(instanceProps.lastMeasuredColumnIndex, columnIndex - 1);
            }
            if (typeof rowIndex === 'number') {
                instanceProps.lastMeasuredRowIndex = Math.min(instanceProps.lastMeasuredRowIndex, rowIndex - 1);
            }
            instance._getItemStyleCache(-1);
            if (shouldForceUpdate) {
                instance.forceUpdate();
            }
        };
        return instanceProps;
    },
    shouldResetStyleCacheOnItemSizeChange: false,
    validateProps: ({ columnWidth, rowHeight }) => {
        {
            if (typeof columnWidth !== 'function') {
                throw Error('An invalid "columnWidth" prop has been specified. ' +
                    'Value should be a function. ' +
                    `"${columnWidth === null ? 'null' : typeof columnWidth}" was specified.`);
            }
            else if (typeof rowHeight !== 'function') {
                throw Error('An invalid "rowHeight" prop has been specified. ' +
                    'Value should be a function. ' +
                    `"${rowHeight === null ? 'null' : typeof rowHeight}" was specified.`);
            }
        }
    },
});





const getEstimatedTotalSize = ({ itemCount }, { itemMetadataMap, estimatedItemSize, lastMeasuredIndex }) => {
    let totalSizeOfMeasuredItems = 0;
    if (lastMeasuredIndex >= itemCount) {
        lastMeasuredIndex = itemCount - 1;
    }
    if (lastMeasuredIndex >= 0) {
        const itemMetadata = itemMetadataMap[lastMeasuredIndex];
        totalSizeOfMeasuredItems = itemMetadata.offset + itemMetadata.size;
    }
    const numUnmeasuredItems = itemCount - lastMeasuredIndex - 1;
    const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedItemSize;
    return totalSizeOfMeasuredItems + totalSizeOfUnmeasuredItems;
};

const VariableSizeList = createListComponent({
    getItemOffset: (props, index, instanceProps) => getItemMetadata(props, index, instanceProps).offset,
    getItemSize: (props, index, instanceProps) => instanceProps.itemMetadataMap[index].size,
    getEstimatedTotalSize,
    getOffsetForIndexAndAlignment: (props, index, align, scrollOffset, instanceProps) => {
        const { direction, height, layout, width } = props;
        const isHorizontal = direction === 'horizontal' || layout === 'horizontal';
        const size = (isHorizontal ? width : height);
        const itemMetadata = getItemMetadata(props, index, instanceProps);
        const estimatedTotalSize = getEstimatedTotalSize(props, instanceProps);
        const maxOffset = Math.max(0, Math.min(estimatedTotalSize - size, itemMetadata.offset));
        const minOffset = Math.max(0, itemMetadata.offset - size + itemMetadata.size);
        switch (align) {
            case 'start':
                return maxOffset;
            case 'end':
                return minOffset;
            case 'center':
                return Math.round(minOffset + (maxOffset - minOffset) / 2);
            case 'auto':
            default:
                if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
                    return scrollOffset;
                }
                else if (scrollOffset - minOffset < maxOffset - scrollOffset) {
                    return minOffset;
                }
                else {
                    return maxOffset;
                }
        }
    },
    getStartIndexForOffset: (props, offset, instanceProps) => findNearestItem(props, instanceProps, offset),
    getStopIndexForStartIndex: (props, startIndex, scrollOffset, instanceProps) => {
        const { direction, height, itemCount, layout, width } = props;
        const isHorizontal = direction === 'horizontal' || layout === 'horizontal';
        const size = (isHorizontal ? width : height);
        const itemMetadata = getItemMetadata(props, startIndex, instanceProps);
        const maxOffset = scrollOffset + size;
        let offset = itemMetadata.offset + itemMetadata.size;
        let stopIndex = startIndex;
        while (stopIndex < itemCount - 1 && offset < maxOffset) {
            stopIndex++;
            offset += getItemMetadata(props, stopIndex, instanceProps).size;
        }
        return stopIndex;
    },
    initInstanceProps(props, instance) {
        const { estimatedItemSize } = (props);
        const instanceProps = {
            itemMetadataMap: {},
            estimatedItemSize: estimatedItemSize || DEFAULT_ESTIMATED_ITEM_SIZE,
            lastMeasuredIndex: -1,
        };
        instance.resetAfterIndex = (index, shouldForceUpdate = true) => {
            instanceProps.lastMeasuredIndex = Math.min(instanceProps.lastMeasuredIndex, index - 1);
            instance._getItemStyleCache(-1);
            if (shouldForceUpdate) {
                instance.forceUpdate();
            }
        };
        return instanceProps;
    },
    shouldResetStyleCacheOnItemSizeChange: false,
    validateProps: ({ itemSize }) => {
        {
            if (typeof itemSize !== 'function') {
                throw Error('An invalid "itemSize" prop has been specified. ' +
                    'Value should be a function. ' +
                    `"${itemSize === null ? 'null' : typeof itemSize}" was specified.`);
            }
        }
    },
});

export { areEqual, createGridComponent, createListComponent, getScrollbarSize, FixedSizeGrid, FixedSizeList, shallowDiffers, shouldComponentUpdate, cancelTimeout, requestTimeout, VariableSizeGrid, VariableSizeList };

