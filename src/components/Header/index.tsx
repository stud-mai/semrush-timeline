import * as React from 'react';
import { Link } from 'react-router-dom';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';

import * as s from './style.css';

/*
  TODO: Please, do not forget that path can be:
  - Home
  - Home / Project name
  - Home / Project name / File name
  or
  - Home / User name
*/

enum Resource {
	'timeline',
	'project',
	'file',
	'user'
}

interface ResourceInfo {
	id: number,
	resource: Resource,
	name: string
}

interface HeaderProps {
	resourceInfo: ResourceInfo[],
	fetching: boolean
}

export class Header extends React.PureComponent<HeaderProps> {
	render() {
		const { resourceInfo, fetching } = this.props;
		const resource = resourceInfo[resourceInfo.length - 1] ;
		const resourceName = resource && resource.name || 'Timeline';
		return (
			<header>
				<SearchBox placeholder="Search" />
				{ !fetching &&
					<React.Fragment>
						<div className={s.breadcrumbs}>
							<Link className={s.link} to="/">Home</Link>
							{resourceInfo.map(({ name, id, resource }) => (
								<React.Fragment key={`${resource}-${id}`}>
									<span className={s.separator}>/</span>
									<Link className={s.link} to={`/${resource}/${id}`}>{name}</Link>
								</React.Fragment>
							))}
						</div>
						<h1 className={s.resourcename}>{resourceName}</h1>
					</React.Fragment>
				}
			</header>
		);
	}
}
