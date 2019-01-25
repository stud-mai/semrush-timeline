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

const timelineReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case actionTypes.GET_RESOURCE_INFO:
            return {
                ...initialState,
                fetchingResourceInfo: true
            }

        case actionTypes.SET_RESOURCE_INFO:
            return {
                ...state,
                fetchingResourceInfo: false
            }

        case actionTypes.SET_ENTITIES:
            const { entities } = payload;
            return {
                ...state,
                resourceInfo: entities.map(({ id, name, title, resource }) => ({ id, resource, name: name || title }))
            }

        case actionTypes.RESET_ENTITIES:
            return {
                ...state,
                resourceInfo: []
            }

        case actionTypes.GET_ACTIVITIES:
            return {
                ...state,
                fetchingActivities: true
            }

        case actionTypes.SET_ACTIVITIES: {
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

        case actionTypes.ADD_NEW_ACTIVITY:
            const { activity } = payload;
            return {
                ...state,
                newActivities: [...state.newActivities, activity]
            }

        case actionTypes.LOAD_NEW_ACTIVITIES:
            return {
                ...state,
                fetchingNewActivities: true
            }

        case actionTypes.SET_NEW_ACTIVITIES: {
            const { activities } = state;
            const { newActivities, usersInfo, filesInfo } = payload;
            const newLatestActivities = newActivities.map(composeActivities(usersInfo, filesInfo, true)).reverse()

            return {
                ...state,
                activities: [...newLatestActivities, ...activities],
                newActivities: [],
                fetchingNewActivities: false
            }
        }

        default:
            return state;
    }
}

export default timelineReducer;