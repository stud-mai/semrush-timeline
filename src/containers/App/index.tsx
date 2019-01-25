import * as React from 'react';
import { connect } from 'react-redux';
import { match as matchProp } from 'react-router';

import { Header } from '../../components';
import { Timeline } from '../../components/Timeline'

import * as timelineActions from '../../actions';

import './style.css';

interface MatchParam {
	resource?: string,
	id?: string
}

interface AppProps {
	match: matchProp<MatchParam>,
	getResourceInfo: (resource?: string, id?: string) => void,
	getActivities: (timestamp: Date, resource?: string, id?: string) => void,
	loadNewActivities: () => void,
	stopReceivingNewActivities: () => void,
	resourceInfo: Array<any>,
	activities: Array<any>,
	newActivitiesCounter: number,
	hasOldActivities: boolean,
	fetchingActivities: boolean,
	fetchingNewActivities: boolean,
	fetchingResourceInfo: boolean
}

export class App extends React.Component<AppProps> {
	componentDidMount() {
		const { match: { params }, getResourceInfo } = this.props;
		const { resource, id } = params;

		getResourceInfo(resource, id);
	}

	componentDidUpdate(prevProps: AppProps) {
		const { match: { params: prevParams } } = prevProps;
		const { match: { params }, getResourceInfo, stopReceivingNewActivities } = this.props;
		const { resource, id } = params;

		if (prevParams.resource !== resource ||
			prevParams.id !== id) {
			stopReceivingNewActivities();
			getResourceInfo(resource, id);
		}
	}

	getResourceActivities = () => {
		const { match: { params }, getActivities, activities } = this.props;
		const { resource, id } = params;
		const { timestamp } = activities[activities.length - 1];

		getActivities(timestamp, resource, id);
	}

	render() {
		const {
			loadNewActivities,
			activities,
			newActivitiesCounter,
			resourceInfo,
			hasOldActivities,
			fetchingActivities,
			fetchingNewActivities,
			fetchingResourceInfo
		} = this.props;
		return (
			<React.Fragment>
				<Header resourceInfo={resourceInfo} fetching={fetchingResourceInfo} />
				<Timeline
					getActivities={this.getResourceActivities}
					loadNewActivities={loadNewActivities}
					activities={activities}
					newActivitiesCounter={newActivitiesCounter}
					hasOldActivities={hasOldActivities}
					fetchingActivities={fetchingActivities}
					fetchingNewActivities={fetchingNewActivities}
					fetchingResourceInfo={fetchingResourceInfo}
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = ({ newActivities, ...restState }) => ({
	...restState,
	newActivitiesCounter: newActivities.length,
})

const mapDispatchToProps = (dispatch: Function) => ({
	getResourceInfo: (resource?: string, id?: string) => dispatch(timelineActions.getResourceInfo(resource, id)),
	getActivities: (timestamp: Date, resource?: string, id?: string) =>
		dispatch(timelineActions.getActivities(timestamp, resource, id)),
	loadNewActivities: () => dispatch(timelineActions.loadNewActivities()),
	stopReceivingNewActivities: () => dispatch(timelineActions.stopReceivingNewActivities()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)

