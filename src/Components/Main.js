import React from 'react';
import Caesar from './Caesar';
import Mono from './Mono' 
import { useState } from 'react';

export default function Main() {
  const [active,setActive] = useState(false)
  function handleChange(){
    setActive(prevActive => !prevActive)
  }
  return (
    <div className='Main'>
        <div className="Main--Header" onClick={handleChange}>
            <h1>{!active ? "MonoAlphabétique" : "Caesar"}</h1>
        </div>
      {!active  && <Caesar />}
      {active && <Mono />}
    </div>
  );
}


