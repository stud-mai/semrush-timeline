import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import withHighlightDot from '../helpers/withHighlightDot';
import { FileIsUploaded } from '../FileIsUploaded';
import { Comment } from '../Comment';
import { ShowNew } from '../ShowNew';
import debounce from '../helpers/debounce';

import * as css from './style.css';

const DELAY: number = 300;

interface TimelineProps {
	getActivities: () => void,
	loadNewActivities: (e) => void,
	activities: Array<any>,
	newActivitiesCounter: number,
	hasOldActivities: boolean,
	fetchingActivities: boolean,
	fetchingNewActivities: boolean,
	fetchingResourceInfo: boolean
}

const EnhancedFileIsUploaded = withHighlightDot(FileIsUploaded);
const EnhancedComment = withHighlightDot(Comment);

export class Timeline extends React.PureComponent<TimelineProps> {
	constructor(props: TimelineProps) {
		super(props);
		this.debouncedGetActivities = debounce(this.getActivities, DELAY);
	}

	timelineComponent: HTMLElement;
	debouncedGetActivities: (e) => void;

	componentDidMount() {
		window.addEventListener('scroll', this.debouncedGetActivities);
		window.addEventListener('resize', this.debouncedGetActivities);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.debouncedGetActivities);
		window.removeEventListener('resize', this.debouncedGetActivities);
	}

	getActivities = () => {
		const { getActivities, hasOldActivities, fetchingActivities, fetchingResourceInfo } = this.props;
		const { bottom } = this.timelineComponent.getBoundingClientRect();

		if (window.innerHeight >= bottom && hasOldActivities &&
			!fetchingActivities && !fetchingResourceInfo) {
			getActivities();
		}
	}

	public render() {
		const {
			activities,
			newActivitiesCounter,
			loadNewActivities,
			fetchingActivities,
			fetchingNewActivities,
			fetchingResourceInfo
		} = this.props

		return (
			<div ref={node => { this.timelineComponent = node }}>
				<h2>Timeline</h2>
				{ fetchingResourceInfo && !activities.length ?
					<Spinner size={SpinnerSize.large} label='Loading events...' ariaLive='assertive' />
					: <React.Fragment>
						<ShowNew onClick={loadNewActivities} counter={newActivitiesCounter} isLoading={fetchingNewActivities} />
						{ activities.map(activity => {
							const { type, id, ...rest } = activity
							const key = `${type}-id-${id}`

							if (type === 'file') {
								return <EnhancedFileIsUploaded key={key} id={id} {...rest} />
							} else if (type === 'comment') {
								return <EnhancedComment key={key} id={id} {...rest} />
							}
						})}

						{ fetchingActivities &&
							<div className={css.spinnerWrapper}>
								<Spinner size={ SpinnerSize.large } label='Loading old events...' ariaLive='assertive' />
							</div>
						}
					</React.Fragment>
				}
			</div>
		)
	}
}