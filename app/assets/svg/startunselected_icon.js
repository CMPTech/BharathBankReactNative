import React from 'react'
import Svg, { Path, Mask, G } from 'react-native-svg'

function StarUnselectedIcon({ width, height, color1, color2 }) {
  return (
    <Svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.165 8.213c.399.1.698.3.798.7.1.299 0 .698-.3.898l-4.584 4.492 1.096 6.39c.1.4-.1.799-.398.998-.2.1-.399.2-.598.2h-.498L12 18.896l-5.68 2.995c-.4.2-.798.1-1.097-.1-.299-.2-.498-.599-.399-.998l1.097-6.39-4.585-4.492c-.299-.2-.398-.6-.299-.999.2-.4.499-.699.897-.699l6.279-.998 2.89-5.69c.299-.7 1.495-.7 1.794 0l2.89 5.79 6.378.898Zm-6.179 5.99c0-.299.1-.598.3-.898l3.587-3.494-4.883-.7c-.399 0-.698-.199-.797-.498L12 4.22 9.807 8.713c-.199.2-.498.499-.797.499l-4.883.699 3.588 3.394c.199.3.299.6.299.899l-.897 4.892 4.385-2.297c.299-.2.598-.2.897 0l4.385 2.297-.798-4.892Z"
        fill="#000"
      />
      <Mask
        id="a"
        style={{
          maskType: "alpha",
        }}
        maskUnits="userSpaceOnUse"
        x={1}
        y={1}
        width={22}
        height={21}
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.165 8.213c.399.1.698.3.798.7.1.299 0 .698-.3.898l-4.584 4.492 1.096 6.39c.1.4-.1.799-.398.998-.2.1-.399.2-.598.2h-.498L12 18.896l-5.68 2.995c-.4.2-.798.1-1.097-.1-.299-.2-.498-.599-.399-.998l1.097-6.39-4.585-4.492c-.299-.2-.398-.6-.299-.999.2-.4.499-.699.897-.699l6.279-.998 2.89-5.69c.299-.7 1.495-.7 1.794 0l2.89 5.79 6.378.898Zm-6.179 5.99c0-.299.1-.598.3-.898l3.587-3.494-4.883-.7c-.399 0-.698-.199-.797-.498L12 4.22 9.807 8.713c-.199.2-.498.499-.797.499l-4.883.699 3.588 3.394c.199.3.299.6.299.899l-.897 4.892 4.385-2.297c.299-.2.598-.2.897 0l4.385 2.297-.798-4.892Z"
          fill="#fff"
        />
      </Mask>
      <G mask="url(#a)">
        <Path
          fill={color1 ? color1 : "#347AF0"}
          d="M0 0h24v24H0z" />
      </G>
    </Svg>
  )
}

export default React.memo(StarUnselectedIcon)
