import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="http://207.148.69.152/" target="_blank" rel="noopener noreferrer">SÀN TMĐT BĐS</a>
        <span className="ml-1">&copy; 2020.</span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Bản quyền thuộc về</span>
        <a href="https://codosaholding.com" target="_blank" rel="noopener noreferrer">Codosa Holding</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
