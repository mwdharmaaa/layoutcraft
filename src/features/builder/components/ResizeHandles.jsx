export const ResizeHandles = ({
  onStartResize,
  resizableSides = { top: true, right: true, bottom: true, left: true },
  activeDirection = null,
}) => {
  const canTop = resizableSides.top !== false;
  const canBottom = resizableSides.bottom !== false;
  const canLeft = resizableSides.left !== false;
  const canRight = resizableSides.right !== false;

  const edges = [
    {
      dir: 'n',
      label: 'Top: Height',
      enabled: canTop,
      containerClass: 'absolute -top-3 left-4 right-4 h-6 cursor-ns-resize z-30 flex items-center justify-center group/edge-n',
      railClass: 'h-[3px] w-full',
      pillClass: 'w-12 h-2.5 flex-row',
      isHoriz: true,
      tooltipPos: 'bottom-full mb-1.5 left-1/2 -translate-x-1/2',
    },
    {
      dir: 's',
      label: 'Bottom: Height',
      enabled: canBottom,
      containerClass: 'absolute -bottom-3 left-4 right-4 h-6 cursor-ns-resize z-30 flex items-center justify-center group/edge-s',
      railClass: 'h-[3px] w-full',
      pillClass: 'w-12 h-2.5 flex-row',
      isHoriz: true,
      tooltipPos: 'top-full mt-1.5 left-1/2 -translate-x-1/2',
    },
    {
      dir: 'w',
      label: 'Left: Width',
      enabled: canLeft,
      containerClass: 'absolute -left-3 top-4 bottom-4 w-6 cursor-ew-resize z-30 flex flex-col items-center justify-center group/edge-w',
      railClass: 'w-[3px] h-full',
      pillClass: 'h-12 w-2.5 flex-col',
      isHoriz: false,
      tooltipPos: 'right-full mr-1.5 top-1/2 -translate-y-1/2',
    },
    {
      dir: 'e',
      label: 'Right: Width',
      enabled: canRight,
      containerClass: 'absolute -right-3 top-4 bottom-4 w-6 cursor-ew-resize z-30 flex flex-col items-center justify-center group/edge-e',
      railClass: 'w-[3px] h-full',
      pillClass: 'h-12 w-2.5 flex-col',
      isHoriz: false,
      tooltipPos: 'left-full ml-1.5 top-1/2 -translate-y-1/2',
    },
  ];

  const corners = [
    {
      dir: 'nw',
      enabled: canTop && canLeft,
      pos: '-top-2 -left-2',
      cursor: 'cursor-nwse-resize',
    },
    {
      dir: 'ne',
      enabled: canTop && canRight,
      pos: '-top-2 -right-2',
      cursor: 'cursor-nesw-resize',
    },
    {
      dir: 'se',
      enabled: canBottom && canRight,
      pos: '-bottom-2 -right-2',
      cursor: 'cursor-nwse-resize',
    },
    {
      dir: 'sw',
      enabled: canBottom && canLeft,
      pos: '-bottom-2 -left-2',
      cursor: 'cursor-nesw-resize',
    },
  ];

  return (
    <>
      {/* 4 Interactive Side Rails */}
      {edges.map((edge) => {
        if (!edge.enabled) {
          return null;
        }

        const isActive = activeDirection === edge.dir;

        return (
          <div
            key={edge.dir}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => onStartResize(edge.dir, e)}
            className={edge.containerClass}
            title={edge.label}
          >
            {/* Edge Guide Rail */}
            <div
              className={`absolute ${edge.railClass} rounded-full transition-all duration-150 pointer-events-none ${
                isActive
                  ? 'bg-blue-400 shadow-sm shadow-blue-400/80'
                  : 'bg-blue-500/70 group-hover/edge-n:bg-blue-400 group-hover/edge-s:bg-blue-400 group-hover/edge-w:bg-blue-400 group-hover/edge-e:bg-blue-400'
              }`}
            />

            {/* Tactile Grab Pill */}
            <div
              className={`relative z-10 ${edge.pillClass} rounded-full bg-blue-600 border border-blue-300/90 shadow-md flex items-center justify-center gap-0.5 transition-all duration-150 pointer-events-none ${
                isActive
                  ? 'scale-125 bg-blue-500 ring-2 ring-white/50'
                  : 'group-hover/edge-n:scale-115 group-hover/edge-s:scale-115 group-hover/edge-w:scale-115 group-hover/edge-e:scale-115 group-hover/edge-n:bg-blue-500 group-hover/edge-s:bg-blue-500 group-hover/edge-w:bg-blue-500 group-hover/edge-e:bg-blue-500'
              }`}
            >
              {edge.isHoriz ? (
                <>
                  <span className="w-1.5 h-0.5 bg-white/90 rounded-full" />
                  <span className="w-1.5 h-0.5 bg-white/90 rounded-full" />
                </>
              ) : (
                <>
                  <span className="h-1.5 w-0.5 bg-white/90 rounded-full" />
                  <span className="h-1.5 w-0.5 bg-white/90 rounded-full" />
                </>
              )}
            </div>

            {/* Hover Side Tag */}
            <span
              className={`absolute ${edge.tooltipPos} pointer-events-none text-[9px] font-mono font-medium tracking-tight px-1.5 py-0.5 rounded bg-zinc-900/95 border border-zinc-700 text-blue-300 shadow-md opacity-0 transition-opacity duration-150 whitespace-nowrap ${
                isActive ? 'opacity-100' : 'group-hover/edge-n:opacity-100 group-hover/edge-s:opacity-100 group-hover/edge-w:opacity-100 group-hover/edge-e:opacity-100'
              }`}
            >
              {edge.label}
            </span>
          </div>
        );
      })}

      {/* 4 Interactive Corner Anchors */}
      {corners.map((corner) => {
        if (!corner.enabled) return null;
        const isActive = activeDirection === corner.dir;

        return (
          <div
            key={corner.dir}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => onStartResize(corner.dir, e)}
            className={`absolute ${corner.pos} ${corner.cursor} w-5 h-5 z-40 flex items-center justify-center group/corner`}
          >
            <div
              className={`w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-xs shadow-md transition-all duration-150 pointer-events-none ${
                isActive
                  ? 'scale-130 bg-blue-100 ring-2 ring-blue-400'
                  : 'group-hover/corner:scale-125'
              }`}
            />
          </div>
        );
      })}
    </>
  );
};
