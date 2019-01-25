import { eventChannel } from 'redux-saga';
import { all, call, put, take, select, takeLatest, takeEvery } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';
import * as actions from '../actions';
import * as API from '../API';

function* getActivitiesInfo(activities) {
    const { userInfoCalls, fileInfoCalls } = activities.reduce(({ userInfoCalls, fileInfoCalls }, { userId, fileId }) => {
        return {
            userInfoCalls: userId !== undefined ? userInfoCalls.add(call(API.user(userId).entity)) : userInfoCalls,
            fileInfoCalls: fileId !== undefined ? fileInfoCalls.add(call(API.file(fileId).entity)) : fileInfoCalls
        }
    }, {
            userInfoCalls: new Set(),
            fileInfoCalls: new Set()
        });

    const usersInfo = yield all([...userInfoCalls]);
    const filesInfo = yield all([...fileInfoCalls]);

    return { usersInfo, filesInfo }
}

function* getActivities({ payload }) {
    const { resource, id, date } = payload;
    const requestedResource = resource ? API[resource](+id) : API.timeline;
    const activities = yield call(requestedResource.getActivities, date);
    const usersAndFilesInfo = yield call(getActivitiesInfo, activities);

    yield put(actions.setActivities({ activities, ...usersAndFilesInfo }));
}

function* getEntities({ payload }) {
    const { resource, id } = payload;

    if (resource && id) {
        const resourceInfo = yield call(API[resource](+id).entity);
        const entities = [{ ...resourceInfo, resource }];

        if (resourceInfo.projectId !== undefined) {
            const projectInfo = yield call(API.project(resourceInfo.projectId).entity);
            entities.unshift({ ...projectInfo, resource: 'project' });
        }
        yield put(actions.setEntities(entities));
    } else {
        yield put(actions.resetEntities());
    }
}

function* getResourceInfo({ payload }) {
    yield all([
        call(getEntities, { payload }),
        call(getActivities, { payload }),
    ]);
    yield put(actions.setResourceInfo());
    yield call(listenForNewActivities, payload);
}

function* loadNewActivities() {
    const newActivities = yield select(state => state.newActivities);
    const usersAndFilesInfo = yield call(getActivitiesInfo, newActivities);

    yield put(actions.setNewActivities({ newActivities, ...usersAndFilesInfo }));
}

function* listenForNewActivities(payload) {
    const channel = yield call(subscriptionChannel, payload);

    yield takeEvery(channel, function* (activity) {
        yield put(actions.addNewActivity(activity));
    });

    yield take(actionTypes.STOP_RECEIVING_NEW_ACTIVITIES);
    channel.close();
}

function subscriptionChannel({ resource, id }) {
    return eventChannel(emit => {
        const requestedResource = resource ? API[resource](+id) : API.timeline;
        const subscription = requestedResource.subscribe(activity => {
            emit(activity);
        });
        return () => {
            subscription.unsubscribe();
        }
    })
}

export default function* rootSaga() {
    yield all([
        takeLatest(actionTypes.GET_ACTIVITIES, getActivities),
        takeLatest(actionTypes.GET_RESOURCE_INFO, getResourceInfo),
        takeLatest(actionTypes.LOAD_NEW_ACTIVITIES, loadNewActivities)
    ]);
}