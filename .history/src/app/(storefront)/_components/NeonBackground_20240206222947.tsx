"use client"
import { useEffect } from 'react';

const HexagonBackground: React.FC = () => {
  useEffect(() => {
    const parent = document.querySelector('.hexa-list') as HTMLElement;
    const height = parent?.offsetHeight || 0;
    const width = parent?.offsetWidth || 0;
    const hex = 36;

    const fill = (): string => {
      const fillV = Math.ceil(height / hex) * 1.3;
      const fillH = Math.ceil(width / hex) * 2;
  
      let els = '';
      for (let x = 0; x < fillH; x++) {
        for (let y = 0; y < fillV / 2; y++) {
          let posY = y * (hex - 4) * 2;
          let posX = (x * hex / 2 + x) - hex;
          if (x % 2 === 0) {
            posY = posY - (hex - 4);
          }
          els += `<div class="hexa" style="top:${posY}px;left:${posX}px;"></div>`;
        }
      }
      return els;
    };

    const els = fill();
    const hexas = document.createElement('div');
    hexas.innerHTML = els;
    parent?.appendChild(hexas);
  }, []);

  return (
    <>
      <style jsx>{`


html {
    box-sizing: border-box;
  }
  
  *, *:before, *:after {
    box-sizing: inherit;
  }
  
  body {
    margin: 0;
  }
  
  .hx-wrap {
    position: relative;
    max-width: 960px;
    margin: 3em auto 0;
    border: 1px solid #ddd;
    &:before {
      content: "";
      padding-top: 56.25%;
      display: block;
    }
  }
  
  .hx-image {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    img {
      max-width: 100%;
    }
  }
  
  .hexa-list {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;;
    overflow: hidden;
    perspective: 1000px;
    transform-style: preserve-3d;
  }
  
  .hexa {
    width: 36px;
    height: 20px;
    position: absolute;
    color: #fff;
    background: currentColor;
    transform: scale(1) translate3d(0,0,0);
    
    transition: .3s color ease-in;
    
    &:hover {
      color: #f8f8f8;
    }
    
    animation-duration: .8s;
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.320, 1.275);
    ///*
    &:before, 
    &:after {
      content: "";
      position: absolute;
      border-style: solid;
      border-color: transparent transparent currentColor;
      border-width: 10px 18px;
      top: -20px;
    }
    &:after {
      top: auto;
      bottom: -20px;
      border-color: currentColor transparent transparent;
    }
    //*/
    &.active {
      animation-name: scale;
    }
  }
  
  @keyframes scale {
    0% {
      transform: scale(1) translate3d(0,0,0);
    }
    20% {
      transform: scale(0.8) translate3d(0,0,-400px);
    }
    100% {
      transform: scale(1) translate3d(0,0,0);
    }
  }
  
  .hx-text {
    text-align: center;
    font-family: sans-serif;
    padding: 1em;
  }
      `}</style>
      <div className="hx-wrap">
        <div className="hx-image"><img src="https://picsum.photos/1366/768?1" alt="" /></div>
        <div className="hexa-list"></div>
      </div>
      <div className="hx-text">Click on a hexagon to see the animation</div>
    </>
  );
};

export default HexagonBackground;
