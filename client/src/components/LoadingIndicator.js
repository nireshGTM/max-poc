/**
 *
 * LoadingIndicator
 *
 */

 import React from 'react';

 const loaderImg = require('../../assets/img/loading.gif').default;
 
 const LoadingIndicator = props => {
   const {height, backgroundSize, position, content, background, left, right, top, zIndex} = props;
   
   return (
     <>
     {position === 'fixed' ? (
       <div style={{height: '100%', width: '100%', top: top, position: position, overflow: 'overlay', zIndex: zIndex}}>
         <div  style={{height: height, position: position, content: content, background: background, backgroundSize: backgroundSize, left:left, right: right, zIndex: zIndex}}></div>
       </div>
     ) : (
       <div style={{height: height, position: position, content: content, background: background, backgroundSize: backgroundSize, left:left, right: right, zIndex: zIndex}} ></div>
     )
     }
     </>
   );
 };
 
 LoadingIndicator.defaultProps = {
   height: '65px',
   background: 'url('+loaderImg+') no-repeat center center',
   content: "",
   backgroundSize: '65px',
   position: 'absolute',
   left:'0',
   right: '0',
   top: '50%',
   zIndex: '9999'
 };
 
 export default LoadingIndicator;
 