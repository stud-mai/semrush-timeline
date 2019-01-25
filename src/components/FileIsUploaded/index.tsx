import * as React from 'react';
import { Link } from 'react-router-dom';

import * as ItemCss from '../../assets/item.css';
import * as FileCss from './index.css';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/fontawesome-free-regular';

import { getTimeDiffText } from '../helpers/getTimeDifference';

interface FileIsUploadedProps {
	highlight: boolean,
	user: {
		avatar: string,
		name: string,
		id: number
	},
	id: number,
	projectId: number,
	filename: string,
	timestamp: Date
}

export const FileIsUploaded = (props: FileIsUploadedProps) => {
	const { user, filename, timestamp, highlight, id } = props;
	const { avatar, name, id: userId } = user;
    const timeStamp = getTimeDiffText(timestamp);

    return (
		<div className={`${ItemCss.item} ${FileCss.root}`} data-highlight={highlight}>
			<div className={FileCss.icon}>
				<FontAwesomeIcon icon={faFileExcel}/>
			</div>
			<div className={FileCss.content}>
				<div>File <Link to={`/file/${id}`}>{filename}</Link> was uploaded</div>
				<div className={FileCss.user}>
					<img src={avatar} className={FileCss.avatar} />
						<div className={FileCss.userName}><Link to={`/user/${userId}`}>{name}</Link></div>
					<div className={FileCss.timestamp}>Created {timeStamp}</div>
				</div>
			</div>
		</div>
	);
}