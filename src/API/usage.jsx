import * as API from './index';

API.user(0).entity().then(data => {
	// data is User object
});

API.timeline.getActivities().then(data => {
	// data is 10 latest activities
});

API.project(0).get(new Date()).then(data => {
	// data is 10 activities before now for project 0
});

const subscription = API.user(3).subscribe((value) => {
	// value is new activity in user 3
	// this callback will be called every few seconds until you unsubscribe from it
});

subscription.unsubscribe(); // do not forget to unsubscribe