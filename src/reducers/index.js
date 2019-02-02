import * as actionTypes from '../actions/actionTypes';

const initialState = {
    resourceInfo: [],
    activities: [],
    newActivities: [],
    hasOldActivities: true,
    fetchingActivities: false,
    fetchingNewActivities: false,
    fetchingResourceInfo: false
};

const composeActivities = (usersInfo, filesInfo, highlight = false) => activity => {
    const { userId, fileId, projectId, date, type, name, text, id } = activity;
    const user = usersInfo.find(({ id }) => id === userId)
    const commonData = {
        timestamp: date,
        user,
        highlight,
        type,
        id,
        projectId
    }

    if (type === 'file') {
        return { ...commonData, filename: name }
    } else if (type === 'comment') {
        const { name: fileName, id } = filesInfo.find(({ id }) => id === fileId)
        return { ...commonData, file: { fileName, id }, text }
    }
}

const handleGetResourceInfo = (state) => ({
    ...initialState,
    fetchingResourceInfo: true
})

const handleSetResourceInfo = (state) => ({
    ...state,
    fetchingResourceInfo: false
})

const handleSetEntities = (state, { payload: { entities } }) => ({
    ...state,
    resourceInfo: entities.map(({ id, name, title, resource }) => ({ id, resource, name: name || title }))
})

const handleResetEntities = (state) => ({
    ...state,
    resourceInfo: []
})

const handleGetActivities = (state) => ({
    ...state,
    fetchingActivities: true
})

const handleSetActivities = (state, { payload }) => {
    const { activities: currentActivities } = state;
    const { activities, usersInfo, filesInfo } = payload;
    const commonState = {
        ...state,
        fetchingActivities: false
    }

    if (activities.length) {
        const latestActivities = activities.map(composeActivities(usersInfo, filesInfo));
        return {
            ...commonState,
            activities: [...currentActivities, ...latestActivities]
        }
    }
    return {
        ...commonState,
        hasOldActivities: false
    }
}

const handleAddNewActivity = (state, { payload: { activity } }) => ({
    ...state,
    newActivities: [...state.newActivities, activity]
})

const handleLoadNewActivities = (state) => ({
    ...state,
    fetchingNewActivities: true
})

const handleSetNewActivities = (state, { payload }) => {
    const { activities } = state;
    const { newActivities, usersInfo, filesInfo } = payload;
    const newLatestActivities = newActivities.map(composeActivities(usersInfo, filesInfo, true)).reverse();

    return {
        ...state,
        activities: [...newLatestActivities, ...activities],
        newActivities: [],
        fetchingNewActivities: false
    }
}

const timelineReducer = (state = initialState, action) => {
    const handlers = {
        [actionTypes.GET_RESOURCE_INFO]: handleGetResourceInfo,
        [actionTypes.SET_RESOURCE_INFO]: handleSetResourceInfo,
        [actionTypes.SET_ENTITIES]: handleSetEntities,
        [actionTypes.RESET_ENTITIES]: handleResetEntities,
        [actionTypes.GET_ACTIVITIES]: handleGetActivities,
        [actionTypes.SET_ACTIVITIES]: handleSetActivities,
        [actionTypes.ADD_NEW_ACTIVITY]: handleAddNewActivity,
        [actionTypes.LOAD_NEW_ACTIVITIES]: handleLoadNewActivities,
        [actionTypes.SET_NEW_ACTIVITIES]: handleSetNewActivities
    }
    return handlers[action.type] ? handlers[action.type](state, action) : state;
}

export default timelineReducer;