import React from 'react';
import {Semester} from './components/home';

window.React = React;
const mountNode = document.getElementById('app');

React.render(<Semester name="SS16" />, mountNode);
