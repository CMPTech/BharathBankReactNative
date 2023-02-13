import * as React from "react"
import Svg, { Path } from "react-native-svg"

const DebitCardIcon = (props) => (
  <Svg
    width={24}
    height={18}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M23.808 4.027a1.174 1.174 0 0 0-.75-.51L6.376.059a1.162 1.162 0 0 0-.889.173 1.152 1.152 0 0 0-.51.745l-.307 1.48-.302 1.47H1.182C.529 3.926 0 4.455 0 5.108v11.676c0 .653.529 1.182 1.182 1.182H18.22c.533 0 1.004-.36 1.139-.88l.85.178a1.183 1.183 0 0 0 1.398-.918l1.475-7.11.596-2.883.298-1.442a1.169 1.169 0 0 0-.168-.884Zm-18.69-.889 3.848.788H4.954l.163-.788ZM18.22 17.39H1.182a.603.603 0 0 1-.605-.605V5.108a.6.6 0 0 1 .595-.605H18.22c.336 0 .605.269.605.605v11.676a.6.6 0 0 1-.596.605h-.01Zm1.182-11.325 3.594.74-.365 1.759-3.23-.62V6.064Zm1.638 10.167a.597.597 0 0 1-.701.471c-.005 0-.01 0-.015-.005l-.922-.187V8.53l3.113.595-1.475 7.106ZM19.402 5.478v-.37c0-.653-.529-1.182-1.182-1.182h-6.386L5.237 2.571l.308-1.48a.575.575 0 0 1 .26-.38.574.574 0 0 1 .45-.086L22.944 4.08c.327.067.533.39.466.716l-.298 1.441-3.71-.759Z"
      fill="#1A70FF"
    />
    <Path
      d="M3.032 8.582h1.389a.613.613 0 0 0 .61-.62V6.92a.621.621 0 0 0-.61-.629H3.032a.621.621 0 0 0-.61.63v1.037a.614.614 0 0 0 .61.625ZM3 6.919c0-.033.019-.052.033-.052h1.389c.014 0 .033.019.033.052v1.038c0 .03-.019.048-.033.048H3.032c-.014 0-.033-.019-.033-.048V6.92ZM1.652 13.838h.86v.577h-.86v-.577ZM3.05 13.838h.86v.577h-.86v-.577ZM4.469 13.838h.86v.577h-.86v-.577ZM5.867 13.838h.86v.577h-.86v-.577ZM7.29 13.838h.86v.577h-.86v-.577ZM15.072 5.574h.577v.86h-.577v-.86ZM16.254 5.574h.576v.86h-.576v-.86ZM12.512 5.574h.576v.86h-.576v-.86ZM13.693 5.574h.577v.86h-.577v-.86ZM1.652 15.727h6.496v.576H1.652v-.576Z"
      fill="#1A70FF"
    />
  </Svg>
)

export default DebitCardIcon