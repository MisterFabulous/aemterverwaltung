import React from 'react';
import {Semesterauswahl} from './components/home';

window.React = React;
const mountNode = document.getElementById('app');

React.render(<Semesterauswahl />, mountNode);
