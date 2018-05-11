// React
import * as React from "react";

// Components
import { Edit } from "react-feather";

interface Props {
  onClick: () => void;
}

const ButtonEdit = (props: Props) => {
  return (
    <span className={`dt pa2 f6 tc pointer gray`} onClick={props.onClick}>
      <div className={`dtc v-mid h-100 w-100`}>
        <Edit size={16} />
      </div>
    </span>
  );
};

export default ButtonEdit;