import React, { useEffect, useState } from 'react';


export const Intro = () => {
  const [number, setNumber] = useState(0)
  const valueUp = () => {
  setNumber(number + 1)
  console.log(number)
}
  const valueDown = () => {
  setNumber(number - 1)
  console.log(number)
}
  useEffect(() => {
    console.log('Component mounted or updated');
  }, [number]);
  return(
    <>
    <h1>Number is: {number}</h1>
    <button onClick={valueUp}>Plus</button>
    <button onClick={valueDown}>Minus</button>
    </>
  );
}