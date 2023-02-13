import React from 'react'
import Svg, { G, Path, Rect, Defs, ClipPath } from 'react-native-svg'

function ArrowUp({ width, height, color1, color }) {
    return (
        <Svg
            width={20}
            height={20}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"

        >
            <Path
                width={50}
                height={50}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M.234 5.166a.8.8 0 0 1 0-1.131l3.2-3.2a.8.8 0 0 1 1.131 0l3.2 3.2a.8.8 0 0 1-1.13 1.131L4.8 3.332V12.6a.8.8 0 1 1-1.6 0V3.332L1.365 5.166a.8.8 0 0 1-1.13 0Z"
                fill={color ? color : "#000"}
            />
        </Svg>
    )
}

export default React.memo(ArrowUp)