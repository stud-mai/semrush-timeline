import * as React from 'react';
import { setTimeout, clearTimeout } from 'timers';
import debounce from './debounce';

const DELAY: number = 300;
const DOT_VISIBILITY_TIME: number = 5000;
const isInViewArea = (elem: HTMLElement): boolean => {
    const { top, bottom } = elem.getBoundingClientRect();
    if (top > 0 && bottom < window.innerHeight) {
        return true;
    }
    return false;
}
const getDisplayName = (WrappedComponent: React.ComponentType): string => WrappedComponent.displayName || WrappedComponent.name || 'Component';

interface InjectedProps {
    highlight: boolean
}

interface CommentState {
    highlight?: boolean
}

export default function withHightlightDot(WrappedComponent: React.ComponentType<InjectedProps>) {
    class WithHighlightDot extends React.Component<{id: number}, CommentState> {
        constructor(props) {
            super(props);

            this.isTimerOn = false;
            this.timer = null;
            this.state = { highlight: props.highlight };
            this.debouncedStartTimer = debounce(this.startTimer, DELAY);
        }

        isTimerOn: boolean;
        timer: NodeJS.Timer;
        wrapper: HTMLElement;
        debouncedStartTimer: (e) => void;

        componentDidMount() {
            this.startTimer();
            window.addEventListener('scroll', this.debouncedStartTimer);
            window.addEventListener('resize', this.debouncedStartTimer);
        }

        componentWillUnmount() {
            clearTimeout(this.timer);
            window.removeEventListener('scroll', this.debouncedStartTimer);
            window.removeEventListener('resize', this.debouncedStartTimer);
        }

        startTimer = () => {
            if (!this.isTimerOn && isInViewArea(this.wrapper)) {
                this.isTimerOn = true;
                this.timer = setTimeout(this.removeHightlight, DOT_VISIBILITY_TIME);
            }
        }

        removeHightlight = () => {
            if (this.state.highlight) {
                if (isInViewArea(this.wrapper)) {
                    this.setState({ highlight: false });
                    window.removeEventListener('scroll', this.startTimer);
                    window.removeEventListener('resize', this.startTimer);
                } else {
                    this.timer = setTimeout(this.removeHightlight, DOT_VISIBILITY_TIME);
                }
            }
        }

        getDOMNode = (node: HTMLElement) => {
            this.wrapper = node;
        }

        render() {
            return (
                <div ref={this.getDOMNode}>
                    <WrappedComponent {...this.props} highlight={this.state.highlight} />
                </div>
            )
        }
    }

    (WithHighlightDot as any).displayName = `WithHighlightDot(${getDisplayName(WrappedComponent)})`;
    return WithHighlightDot;
}