import * as React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import * as ItemCss from '../../assets/item.css';
import * as css from './style.css';

interface ShowNewProps {
	onClick: (event) => void,
	counter: number,
	isLoading: boolean
}

export const ShowNew = (props: ShowNewProps) => {
	const { counter, isLoading, onClick } = props;
	const buttonCls = `${css.button} ${counter > 0 ? css.buttonVisible : ''}`;

	return (
		<div className={`${ItemCss.item} ${css.root}`}>
			<div className={css.line} />
			<button className={buttonCls} onClick={onClick}>
				{ isLoading ?
					<Spinner size={SpinnerSize.small} />
					: `Load new ${counter} ${counter > 1 ? 'activities' : 'activity'}`
				}
			</button>
		</div>
	)
}