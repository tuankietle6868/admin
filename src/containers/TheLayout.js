import React, { useEffect } from 'react'
import { useCookie } from '@use-hook/use-cookie';
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'


const TheLayout = () => {

  const [ClientId]    = useCookie('Client');
  const [AccessToken] = useCookie('X-Auth-Token');
  useEffect(() => {
    if (!ClientId && !AccessToken) {
      window.location.href = '#/login';
    }
  }, []);

  return (
    <div className="c-app c-default-layout">
      <TheSidebar/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body">
          <TheContent/>
        </div>
        <TheFooter/>
      </div>
    </div>
  )
}

export default TheLayout
