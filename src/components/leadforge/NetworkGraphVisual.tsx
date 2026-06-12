import { useMemo } from "react";

export function NetworkGraphVisual({ className }: { className?: string }) {
  // Generate random static nodes and edges once on mount
  const { nodes, edges } = useMemo(() => {
    const generatedNodes: any[] = [];
    
    // We want exactly 14 nodes distributed across the peripheries to cover the canvas
    const sectors = [
      { minX: 5, maxX: 30, minY: 5, maxY: 30 },   // Top Left
      { minX: 70, maxX: 95, minY: 5, maxY: 30 },  // Top Right
      { minX: 5, maxX: 30, minY: 70, maxY: 95 },  // Bottom Left
      { minX: 70, maxX: 95, minY: 70, maxY: 95 }, // Bottom Right
      { minX: 30, maxX: 70, minY: 5, maxY: 20 },  // Top Center Band
      { minX: 30, maxX: 70, minY: 80, maxY: 95 }  // Bottom Center Band
    ];

    // Generate 2 nodes per quadrant, and 1 per top/bottom band = 10 nodes. Let's add 4 more scattered.
    const counts = [2, 2, 2, 2, 2, 2]; // 12 nodes total
    
    let nodeId = 0;
    sectors.forEach((sec, sIdx) => {
      const count = counts[sIdx];
      for (let c = 0; c < count; c++) {
        const x = sec.minX + Math.random() * (sec.maxX - sec.minX);
        const y = sec.minY + Math.random() * (sec.maxY - sec.minY);
        
        // Pick exactly 2 highlight nodes (e.g. first node of top-left and first of bottom-right)
        const isHighScore = (sIdx === 0 && c === 0) || (sIdx === 3 && c === 0);
        const r = isHighScore ? 2.4 : 1.2; // Regular node ~1.2 units (approx 3-4px), Highlight ~2.4 units (approx 6-8px)
        const baseOpacity = isHighScore ? 1.0 : 0.28; // Regular 28%, Highlight 100%
        
        const dx = (Math.random() - 0.5) * 4; 
        const dy = (Math.random() - 0.5) * 4; 
        const duration = 15 + Math.random() * 5;
        
        generatedNodes.push({ id: `n-${nodeId++}`, x, y, r, baseOpacity, dx, dy, duration, isHighScore });
      }
    });

    // 2. Generate edges (connect to 1-2 nearest neighbors for short local lines)
    const generatedEdges: any[] = [];
    const edgeSet = new Set();
    
    generatedNodes.forEach((node, i) => {
      const distances = generatedNodes
        .map((other, j) => {
          if (i === j) return { index: j, distance: Infinity };
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          return { index: j, distance: Math.sqrt(dx * dx + dy * dy) };
        })
        .sort((a, b) => a.distance - b.distance);
        
      const connections = Math.random() > 0.5 ? 2 : 1;
      for (let k = 0; k < connections; k++) {
        const targetIdx = distances[k].index;
        const targetNode = generatedNodes[targetIdx];
        
        // Avoid connecting across the empty center (limit max edge distance to 35)
        if (distances[k].distance > 35) continue;
        
        const edgeId = i < targetIdx ? `e-${i}-${targetIdx}` : `e-${targetIdx}-${i}`;
        if (!edgeSet.has(edgeId)) {
          edgeSet.add(edgeId);
          generatedEdges.push({
            id: edgeId,
            source: node,
            target: targetNode,
            pulseDelay: Math.random() * -10, 
            pulseDuration: 4 + Math.random() * 4,
          });
        }
      }
    });

    return { nodes: generatedNodes, edges: generatedEdges };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center ${className || ""}`}>
      <style>
        {`
          @keyframes edgePulse {
            0% { stroke-opacity: 0.07; }
            50% { stroke-opacity: 0.12; }
            100% { stroke-opacity: 0.07; }
          }
          .animate-edge-pulse {
            animation: edgePulse linear infinite;
          }
        `}
      </style>

      <svg 
        className="w-full h-full opacity-100"
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Render edges */}
        {edges.map((edge) => (
          <line
            key={edge.id}
            stroke="#22d3ee"
            strokeWidth="0.2"
            className="animate-edge-pulse"
            style={{
              animationDelay: `${edge.pulseDelay}s`,
              animationDuration: `${edge.pulseDuration}s`
            }}
          >
            <animate attributeName="x1" values={`${edge.source.x};${edge.source.x + edge.source.dx};${edge.source.x}`} dur={`${edge.source.duration}s`} repeatCount="indefinite" />
            <animate attributeName="y1" values={`${edge.source.y};${edge.source.y + edge.source.dy};${edge.source.y}`} dur={`${edge.source.duration}s`} repeatCount="indefinite" />
            <animate attributeName="x2" values={`${edge.target.x};${edge.target.x + edge.target.dx};${edge.target.x}`} dur={`${edge.target.duration}s`} repeatCount="indefinite" />
            <animate attributeName="y2" values={`${edge.target.y};${edge.target.y + edge.target.dy};${edge.target.y}`} dur={`${edge.target.duration}s`} repeatCount="indefinite" />
          </line>
        ))}

        {/* Render nodes */}
        {nodes.map((node) => (
          <circle
            key={node.id}
            r={node.r}
            fill="#22d3ee"
            fillOpacity={node.baseOpacity}
            filter={node.isHighScore ? "url(#node-glow)" : undefined}
          >
            {/* Drift animation */}
            <animate attributeName="cx" values={`${node.x};${node.x + node.dx};${node.x}`} dur={`${node.duration}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values={`${node.y};${node.y + node.dy};${node.y}`} dur={`${node.duration}s`} repeatCount="indefinite" />
            
            {/* Pulse highlight nodes specifically */}
            {node.isHighScore && (
              <animate 
                attributeName="r" 
                values={`${node.r};${node.r * 1.25};${node.r}`} 
                dur="3s" 
                repeatCount="indefinite" 
              />
            )}
          </circle>
        ))}
      </svg>
    </div>
  );
}
