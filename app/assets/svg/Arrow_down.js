import React from 'react'
import Svg, { G, Path, Rect, Defs, ClipPath } from 'react-native-svg'

function ArrowDown({ width, height, color1, color }) {
    return (
        <Svg
            width={20}
            height={20}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"

        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.764 8.834a.8.8 0 0 1 0 1.131l-3.2 3.2a.8.8 0 0 1-1.131 0l-3.2-3.2a.8.8 0 1 1 1.13-1.131l1.835 1.834V1.4a.8.8 0 0 1 1.6 0v9.268l1.835-1.834a.8.8 0 0 1 1.13 0Z"
                fill={color ? color : "#000"}
            />
        </Svg>
    )
}

export default React.memo(ArrowDown)
