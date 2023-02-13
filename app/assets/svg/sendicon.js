import React from 'react'
import Svg, { Path, G, Use } from 'react-native-svg'
export default function SendIcon() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="11"
      height="10"
      viewBox="0 0 11 10"
    >
     <G fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <G transform="translate(-319 -467)">
          {/* <Path fill="#FFF" d="M0 0H375V894H0z"></Path>
          <Path fill="#F9FAFF" d="M0 0H375V1787H0z"></Path> */}
          <G transform="translate(30 393)">
            <G transform="translate(0 60)">
              <G>
                <Use
                  fill='red'
                  filter="url(#filter-3)"
                  xlinkHref="#path-2"
                ></Use>
                <Use fill="url(#linearGradient-1)" xlinkHref="#path-2"></Use>
                <Use
                  fill='red'
                  filter="url(#filter-4)"
                  xlinkHref="#path-2"
                ></Use>
              </G>
              <G transform="translate(201 12)">
                <G filter="url(#filter-5)" transform="translate(88 2)">
                  <G transform="scale(1 -1) rotate(45 14.696 1.656)">
                    <Path
                      fill='red'
                      fillRule="nonzero"
                      d="M7.577 2.913L4.797.31a.433.433 0 00-.299-.115.433.433 0 00-.298.115l-.252.236a.38.38 0 000 .562L5.57 2.63H.416C.184 2.63 0 2.8 0 3.018v.334c0 .218.184.405.416.405h5.172L3.948 5.29a.374.374 0 000 .554l.252.236c.08.074.185.115.298.115a.433.433 0 00.298-.116l2.781-2.604a.38.38 0 000-.56z"
                    ></Path>
                  </G>
                </G>
              </G>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  )
}