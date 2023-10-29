import React from 'react';
import Vignere from './Vignere';
import Transpo from './Transpo' 
import { useState } from 'react';

export default function Main() {
  const [active,setActive] = useState(false)
  function handleChange(){
    setActive(prevActive => !prevActive)
  }
  return (
    <div className='Main'>
        <div className="Main--Header" onClick={handleChange}>
            <h1>{!active ? "Transposition" : "Vignere"}</h1>
        </div>
      {!active  && <Vignere />}
      {active && <Transpo />}
    </div>
  );
}


