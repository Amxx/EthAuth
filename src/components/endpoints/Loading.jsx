import React, { Component } from 'react';
import './Loading.css';

class Loading extends Component
{
	render()
	{
		return (
			<div id='Loading'>
				<svg xmlns='http://www.w3.org/2000/svg' width='100' viewBox='0 0 250 250' preserveAspectRatio='xMidYMid meet'>
					<path className='path' stroke='#00E9FA' strokeWidth='3' strokeLinejoin='round' strokeLinecap='round' strokeMiterlimit='10' strokeDasharray='200' strokeDashoffset='400' fill='none' d='M125,237.6c-15.2,0-29.9-3-43.8-8.9c-13.4-5.7-25.5-13.8-35.8-24.1c-10.3-10.3-18.5-22.4-24.1-35.8
						c-5.9-13.9-8.9-28.6-8.9-43.8s3-29.9,8.9-43.8C26.9,67.8,35,55.7,45.4,45.4C55.7,35,67.8,26.9,81.2,21.3
						c13.9-5.9,28.6-8.9,43.8-8.9s29.9,3,43.8,8.9c13.4,5.7,25.5,13.8,35.8,24.1c10.3,10.3,18.5,22.4,24.1,35.8
						c5.9,13.9,8.9,28.6,8.9,43.8s-3,29.9-8.9,43.8c-5.7,13.4-13.8,25.5-24.1,35.8c-10.3,10.3-22.4,18.5-35.8,24.1
						C154.9,234.6,140.2,237.6,125,237.6z M125,45.8c-21.2,0-41.1,8.2-56,23.2s-23.2,34.9-23.2,56c0,21.2,8.2,41.1,23.2,56
						c15,15,34.9,23.2,56,23.2c21.2,0,41.1-8.2,56-23.2c15-15,23.2-34.9,23.2-56c0-21.2-8.2-41.1-23.2-56C166.1,54,146.2,45.8,125,45.8
						z' />
				</svg>
			</div>
		);
	}
}

export default Loading;
