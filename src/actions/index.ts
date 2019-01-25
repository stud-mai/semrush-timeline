import * as actionTypes from './actionTypes';

export const getResourceInfo = (resource?: string, id?: string) => ({
    type: actionTypes.GET_RESOURCE_INFO,
    payload: { resource, id }
});

export const setResourceInfo = () => ({ type: actionTypes.SET_RESOURCE_INFO });

export const getActivities = (date: Date, resource?: string, id?: string) => ({
    type: actionTypes.GET_ACTIVITIES,
    payload: { resource, id, date }
});

export const setActivities = (payload: Object) => ({
    type: actionTypes.SET_ACTIVITIES,
    payload
});

export const setEntities = (entities: Object[]) => ({
    type: actionTypes.SET_ENTITIES,
    payload: { entities }
});

export const resetEntities = () => ({ type: actionTypes.RESET_ENTITIES });

export const addNewActivity = (activity: Object) => ({
    type: actionTypes.ADD_NEW_ACTIVITY,
    payload: { activity }
});

export const loadNewActivities = () => ({ type: actionTypes.LOAD_NEW_ACTIVITIES });

export const setNewActivities = (payload: Object) => ({
    type: actionTypes.SET_NEW_ACTIVITIES,
    payload
});

export const stopReceivingNewActivities = () => ({ type: actionTypes.STOP_RECEIVING_NEW_ACTIVITIES });
