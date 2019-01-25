import * as React from 'react';
import { Link } from 'react-router-dom';
import { getTimeDiffText } from '../helpers/getTimeDifference';

import * as ItemCss from '../../assets/item.css';
import * as CommentCss from './index.css';

interface CommentProps {
	highlight: boolean,
	user: {
		avatar: string,
		name: string,
		id: number
	},
	file: {
		fileName: string,
		id: number
	},
	id: number,
	projectId: number,
	timestamp: Date,
	text: string
}

export const Comment = (props: CommentProps) => {
	const { user, file, text, timestamp, highlight,  } = props;
	const { avatar, name, id: userId } = user;
	const { fileName, id: fileId } = file;
	const timeStamp = getTimeDiffText(timestamp);

	return (
		<div className={`${ItemCss.item} ${CommentCss.root}`} data-highlight={highlight}>
			<img src={avatar} className={CommentCss.avatar} />
			<div>
				<Link to={`/user/${userId}`}>{name}</Link> commented <Link to={`/file/${fileId}`}>{fileName}</Link> {timeStamp}
			</div>
			<div className={CommentCss.text}>
				{text}
			</div>
		</div>
	);
}