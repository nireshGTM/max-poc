import { Alert } from 'antd';
import React, {useEffect} from 'react';

const Notification = ({notifications,clearNotification})=>{
    useEffect(()=>{
        if(notifications.length>0)
        setTimeout(clearNotification,3000)
    },[notifications,clearNotification])
    return (
        <>
        {(notifications.length>0)? 
        notifications.map((notification, index)=>(
            <Alert key={index} message={notification.message} type={notification.type}  showIcon closable />
        ))
        :""}
        </>
    )
}

export default Notification;