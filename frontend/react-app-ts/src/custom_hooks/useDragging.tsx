import { useState, useRef, useEffect } from "react";

interface Position{
  x: number;
  y: number;
}

interface BoxPosition{
  top: number,
  right: number,
  bottom: number,
  left: number
}

type UseDraggingOutputs = [React.RefObject<HTMLLIElement>, number,number,boolean]

const useDragging = (MouseUpHook:()=>void):UseDraggingOutputs => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  const [relPos, setRelPos] = useState<Position>({ x: 0, y: 0 });
  const [origPos, setOrigPos] = useState<Position>({ x: 0, y: 0 });
  const [dummyNode, setDummyNode] = useState<HTMLElement>()
  const [dummyNodePosition, setDummyNodePosition] = useState<BoxPosition>({top:0,right:0,bottom:0,left:0})
  const [parentPos, setParentPos] = useState<BoxPosition>({top:0, right:0, bottom:0, left:0})
  const ref = useRef<HTMLLIElement>(null);

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    if (!ref.current) return;
    
    const parent = ref.current.parentElement;
    if(!parent) return;
    const parent_info = parent.getBoundingClientRect();
    if (!parent_info) return;
    // Recalculate the parent.top position if it shrinks or grows
    const position = {
      x: e.clientX - relPos.x + parentPos.left - parent_info.left,
      y: e.clientY - relPos.y + parentPos.top - parent_info.top,
    };
    setPos(position);

    // When cursor moves outside of dummynode position then remove dummynode
    // When the cursor is inside the dummynode position but the dummy node is not there
    // then add the dummy node back in
    // This creates the illusion of the other nodes moving out of the way for the moving node.
    // const parent = ref.current.parentElement;
    if (!parent) return;
    if (!dummyNode) return;
    if (
      e.clientX > dummyNodePosition.left &&
      e.clientX < dummyNodePosition.right &&
      e.clientY < dummyNodePosition.bottom &&
      e.clientY > dummyNodePosition.top &&
      ref.current.previousElementSibling != dummyNode
    ) {
      ref.current.before(dummyNode)
    } else if (
      (e.clientX < dummyNodePosition.left ||
      e.clientX > dummyNodePosition.right ||
      e.clientY > dummyNodePosition.bottom ||
      e.clientY < dummyNodePosition.top) &&
      ref.current.previousElementSibling === dummyNode
    ){
      parent.removeChild(dummyNode)
    } 

    e.stopPropagation();
    e.preventDefault();
  }

  function onMouseUp(e: MouseEvent) {
    if (!ref.current) return;
    let position = {
      x: e.clientX - relPos.x,
      y: e.clientY - relPos.y,
    };
    // If the object trails out of bounds of the object
    // then reset it back to its original position.
    const parent = ref.current.parentElement;
    const parent_info = parent?.getBoundingClientRect();
    if (!parent_info) return;
    // This is for snapping back outside of parent
    if (e.clientX < parent_info.left || e.clientX > parent_info.right) {
      position.x = origPos.x - relPos.x;
      position.y = origPos.y - relPos.y;
    }
    if (e.clientY < parent_info.top || e.clientY > parent_info.bottom) {
      position.x = origPos.x - relPos.x;
      position.y = origPos.y - relPos.y;
    }

    // If the new position is inside a parent sibling element remove the element from parent and put it in the parent sibling
    // They should probably have the same class.
    if (!parent) return;
    const siblings = getAllSiblings(parent);
    siblings.forEach((parent_sibling) => {
      const parent_sibling_info = parent_sibling?.getBoundingClientRect();
      if (!parent_sibling_info) return;
      if (!ref.current) return;
      if (
        e.clientX > parent_sibling_info.left &&
        e.clientX < parent_sibling_info.right &&
        e.clientY < parent_sibling_info.bottom &&
        e.clientY > parent_sibling_info.top
      ) {
        parent?.removeChild(ref.current);
        parent_sibling?.appendChild(ref.current);
        position.x = e.clientX;
        position.y = e.clientY;
      }
    });

    // Remove dummy node after element is finished moving
    // Only remove if the dummy node exists
    if (!dummyNode) return;
    if (ref.current.previousElementSibling === dummyNode){
      parent?.removeChild(dummyNode)
    }
    
    if (MouseUpHook !== undefined){
      MouseUpHook()
    }

    setPos(position);
    setIsDragging(false);
    e.stopPropagation();
    e.preventDefault();
  }

  // When MouseDown is clicked set dragging equal to true, which will
  // add event listeners mouseup and mousemove
  function onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;
    if (!ref.current) return;
    setIsDragging(true);

    // ref.current.style.zIndex = "10";
    // Set the relative position of the cursor
    // When position = relative is set on the parent element factor that into the setPos
    // equation. In general this should be the relative element.
    // e.clientX is the position of the cursor (relative to whole page), element.left is position of element (relative to whole page)
    // parent_info.left is the position of the parent element (relative to whole page)
    // relative_to_item = e.clientX - element.left : This gives the position of the cursor relative to item. Or if item is at (0,0) (in item reference frame)
    // relative_to_whole_page = relative_to_item + parent_info.left : This gives the position of the cursor relative to whole page in reference fram of item
    const element = ref.current.getBoundingClientRect();
    const parent = ref.current.parentElement;
    if(!parent) return;
    const parent_info = parent.getBoundingClientRect();
    if (!parent_info) return;
    let x1 = e.clientX - element.left + parent_info.left;
    let y1 = e.clientY - element.top + parent_info.top;

    // Similar to + parent_info also + margin width assuming it is symmetrical on all sides
    const margin = parseInt(window.getComputedStyle(ref.current).margin);
    if (margin) {
      x1 += margin;
      y1 += margin;
    }
    setRelPos({
      x: x1,
      y: y1,
    });
    setOrigPos({
      x: e.clientX,
      y: e.clientY,
    });

    // Reset the position of the element to the last position used
    setPos({
      x: e.clientX - x1,
      y: e.clientY - y1,
    });
    // Set the position of the parent to relative 
    // This must be done 
    parent.style.position="relative";
    
    // Store the original parent top position incase the top component shrinks or grows
    setParentPos({
      top: parent_info.top,
      right: parent_info.right,
      bottom: parent_info.bottom,
      left: parent_info.left,
    })

    // Set the original node position - as this is where the dummy node will sit
    // This must done before we add the clone before ref.current
    const position = ref.current.getBoundingClientRect()
    setDummyNodePosition({
      top: position.top,
      right: position.right,
      bottom: position.bottom,
      left: position.left
    })

    // Add dummy node, this stops other nodes collapsing on our node
    // independent of parent styling 
    // Ensure the dummy node has the same width and height as the original node
    const clone = ref.current.cloneNode() as HTMLElement
    const refCurrentStyles = window.getComputedStyle(ref.current)
    const parentStyles = window.getComputedStyle(parent)
    clone.style.backgroundColor = parentStyles.backgroundColor
    clone.style.height = refCurrentStyles.height
    clone.style.width = refCurrentStyles.width
    ref.current.before(clone)
    setDummyNode(clone)

    e.stopPropagation();
    e.preventDefault();
  }

  // When the element mounts, attach an mousedown listener
  useEffect(() => {
    if (!ref.current) return;
    ref.current.addEventListener("mousedown", onMouseDown);

    return () => {
      if (!ref.current) return;
      ref.current.removeEventListener("mousedown", onMouseDown);
    };
  }, [ref.current]);

  // Everytime the isDragging state changes, assign or remove
  // the corresponding mousemove and mouseup handlers
  // When we begin to drag the item then add mouseup and mousemove interactions
  // If it is non longer dragging do not do that
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
    } else {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    }
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [isDragging]);

  return [ref, pos.x, pos.y, isDragging];
}

const getAllSiblings = (element: Element): Element[] => {
  const parent = element.parentElement;
  if (!parent) return [];
  const children = [...parent.children];
  return children.filter((child) => child !== element);
};

export { useDragging };
