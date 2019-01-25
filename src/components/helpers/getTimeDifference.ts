import dateFns from 'date-fns';

export const getTimeDiff = (timestamp: Date): Array<number | string> => {
    const now: Date = new Date;
    const secondsDiff = dateFns.differenceInSeconds(now, timestamp);
    if (secondsDiff < 60) {
        return [secondsDiff, 'second'];
    }
    const minutesDiff = dateFns.differenceInMinutes(now, timestamp);
    if (minutesDiff < 60) {
        return [minutesDiff, 'minute'];
    }
    const hoursDiff = dateFns.differenceInHours(now, timestamp);
    if (hoursDiff < 24) {
        return [hoursDiff, 'hour'];
    }
    const daysDiff = dateFns.differenceInDays(now, timestamp);

    return [daysDiff, 'day'];
}

export const getTimeDiffText = (timestamp: Date): string => {
    const [timeDiff, units] = getTimeDiff(new Date(timestamp));
    return `${timeDiff} ${units}${timeDiff > 1 ? 's' : ''} ago`;
}