export const ResizeHandles = ({ onStartResize }) => {
  const handles = [
    // Corners
    { dir: 'nw', pos: '-top-1.5 -left-1.5', cursor: 'cursor-nwse-resize' },
    { dir: 'ne', pos: '-top-1.5 -right-1.5', cursor: 'cursor-nesw-resize' },
    { dir: 'se', pos: '-bottom-1.5 -right-1.5', cursor: 'cursor-nwse-resize' },
    { dir: 'sw', pos: '-bottom-1.5 -left-1.5', cursor: 'cursor-nesw-resize' },
    // Edges
    { dir: 'n', pos: '-top-1 left-1/2 -translate-x-1/2', cursor: 'cursor-ns-resize', isEdge: true, isHoriz: true },
    { dir: 's', pos: '-bottom-1 left-1/2 -translate-x-1/2', cursor: 'cursor-ns-resize', isEdge: true, isHoriz: true },
    { dir: 'w', pos: 'top-1/2 -left-1 -translate-y-1/2', cursor: 'cursor-ew-resize', isEdge: true, isHoriz: false },
    { dir: 'e', pos: 'top-1/2 -right-1 -translate-y-1/2', cursor: 'cursor-ew-resize', isEdge: true, isHoriz: false },
  ];

  return (
    <>
      {handles.map((h) => {
        if (h.isEdge) {
          return (
            <div
              key={h.dir}
              onPointerDown={(e) => onStartResize(h.dir, e)}
              className={`absolute ${h.pos} ${h.cursor} z-20 ${
                h.isHoriz
                  ? 'w-6 h-1.5 bg-blue-500 rounded-full hover:scale-125'
                  : 'w-1.5 h-6 bg-blue-500 rounded-full hover:scale-125'
              } opacity-80 hover:opacity-100 transition-transform shadow-xs`}
            />
          );
        }

        return (
          <div
            key={h.dir}
            onPointerDown={(e) => onStartResize(h.dir, e)}
            className={`absolute ${h.pos} ${h.cursor} w-3 h-3 bg-white border-2 border-blue-600 rounded-sm z-20 hover:scale-125 transition-transform shadow-xs`}
          />
        );
      })}
    </>
  );
};
