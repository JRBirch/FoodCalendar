import { useRef } from "react";

import { useDragging } from "../../custom_hooks/useDragging";


const Draggable = ({children}:{children: JSX.Element}) => {
  const [liref, x, y, isDragging] = useDragging();
  let count = useRef(0);
  count.current += 1;
  return (
    <li
      ref={liref}
      style={{
        // Turn on relative position when dragging
        position: isDragging ? "absolute" : undefined,
        left: isDragging ? x : undefined,
        top: isDragging ? y : undefined,
        backgroundColor: isDragging ? "red" : "white",
      }}
    > 
      {children}
      <p>Renders: {count.current}</p>
    </li>
  );
};
export default Draggable;