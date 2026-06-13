// =============================================================================
// CanvasEditor Component — Dijital Eğitim Platformu İçerik Editörü
// =============================================================================

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Transformer, Group, Text } from 'react-konva';
import Konva from 'konva';

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'QUESTION' | 'VIDEO' | 'NOTE';
  label?: string;
}

interface CanvasEditorProps {
  hotspots: Hotspot[];
  onHotspotsChange: (hotspots: Hotspot[]) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  imageUrl?: string; // Arkada gösterilecek PDF sayfası
}

// Seçili objeyi boyutlandırmak için kullanılan Transformer bileşeni
const RectangleTransformer = ({
  shapeRef,
  isSelected,
  onTransformEnd,
}: {
  shapeRef: React.RefObject<Konva.Rect | null>;
  isSelected: boolean;
  onTransformEnd: (e: any) => void;
}) => {
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      // transformeri şekle bağla
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, shapeRef]);

  if (!isSelected) {
    return null;
  }

  return (
    <Transformer
      ref={trRef}
      boundBoxFunc={(oldBox, newBox) => {
        // Çok küçülmesini engelle
        if (Math.abs(newBox.width) < 20 || Math.abs(newBox.height) < 20) {
          return oldBox;
        }
        return newBox;
      }}
      onTransformEnd={onTransformEnd}
      borderStroke="#6366f1"
      anchorStroke="#6366f1"
      anchorFill="#fff"
      anchorSize={8}
    />
  );
};

const HotspotRect = ({
  hotspot,
  isSelected,
  onSelect,
  onChange,
}: {
  hotspot: Hotspot;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Hotspot) => void;
}) => {
  const shapeRef = useRef<Konva.Rect>(null);

  // Renk belirleme
  const getFillColor = () => {
    if (isSelected) return 'rgba(99, 102, 241, 0.4)'; // Indigo
    switch (hotspot.type) {
      case 'QUESTION': return 'rgba(244, 63, 94, 0.3)'; // Rose
      case 'VIDEO': return 'rgba(16, 185, 129, 0.3)'; // Emerald
      default: return 'rgba(59, 130, 246, 0.3)'; // Blue
    }
  };

  const getStrokeColor = () => {
    if (isSelected) return '#6366f1';
    switch (hotspot.type) {
      case 'QUESTION': return '#f43f5e';
      case 'VIDEO': return '#10b981';
      default: return '#3b82f6';
    }
  };

  return (
    <Group>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        x={hotspot.x}
        y={hotspot.y}
        width={hotspot.width}
        height={hotspot.height}
        fill={getFillColor()}
        stroke={getStrokeColor()}
        strokeWidth={isSelected ? 2 : 1}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...hotspot,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...hotspot,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            });
          }
        }}
      />
      
      {/* Etiket (Label) - Sadece çizim büyükse göster */}
      {hotspot.label && hotspot.width > 50 && hotspot.height > 20 && (
        <Text
          x={hotspot.x + 4}
          y={hotspot.y + 4}
          text={hotspot.label}
          fontSize={12}
          fill="#1e293b"
          fontFamily="Inter, sans-serif"
          fontStyle="bold"
          listening={false}
        />
      )}

      <RectangleTransformer
        shapeRef={shapeRef}
        isSelected={isSelected}
        onTransformEnd={() => {}}
      />
    </Group>
  );
};

export function CanvasEditor({
  hotspots,
  onHotspotsChange,
  selectedId,
  onSelect,
}: CanvasEditorProps) {
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Çizim işlemi için state'ler
  const [isDrawing, setIsDrawing] = useState(false);
  const [newHotspot, setNewHotspot] = useState<Hotspot | null>(null);

  // Responsive Canvas Boyutlandırma
  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight || 600,
        });
      }
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const checkDeselect = (e: any) => {
    // Stage (arkaplan) tıklandığında seçimi kaldır
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      onSelect(null);
    }
  };

  const handleMouseDown = (e: any) => {
    checkDeselect(e);
    const clickedOnEmpty = e.target === e.target.getStage();
    
    // Eğer boşluğa tıklandıysa yeni çizim başlat
    if (clickedOnEmpty) {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setNewHotspot({
        id: `temp-${Date.now()}`,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        type: 'NOTE',
      });
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !newHotspot) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    // Boyutları hesapla (ters yöne çekmeyi de destekle)
    const newWidth = point.x - newHotspot.x;
    const newHeight = point.y - newHotspot.y;

    setNewHotspot({
      ...newHotspot,
      width: newWidth,
      height: newHeight,
    });
  };

  const handleMouseUp = () => {
    if (isDrawing && newHotspot) {
      setIsDrawing(false);
      
      // Çok küçük (yanlışlıkla tıklanmış) çizimleri engelle
      if (Math.abs(newHotspot.width) > 10 && Math.abs(newHotspot.height) > 10) {
        // Negatif width/height varsa düzelt
        const normalizedHotspot = {
          ...newHotspot,
          id: `hs-${Date.now()}`,
          x: newHotspot.width < 0 ? newHotspot.x + newHotspot.width : newHotspot.x,
          y: newHotspot.height < 0 ? newHotspot.y + newHotspot.height : newHotspot.y,
          width: Math.abs(newHotspot.width),
          height: Math.abs(newHotspot.height),
        };
        
        onHotspotsChange([...hotspots, normalizedHotspot]);
        onSelect(normalizedHotspot.id); // Çizileni seç
      }
      setNewHotspot(null);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden relative shadow-inner flex items-center justify-center cursor-crosshair"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      
      {/* TODO: Image Layer (PDF Sayfası render edildiğinde buraya <Image /> eklenecek) */}
      <div className="absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 pointer-events-none">
        Fareye basılı tutarak çizim yapabilirsiniz.
      </div>

      <Stage
        width={containerSize.width}
        height={containerSize.height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          {hotspots.map((hotspot) => (
            <HotspotRect
              key={hotspot.id}
              hotspot={hotspot}
              isSelected={hotspot.id === selectedId}
              onSelect={() => onSelect(hotspot.id)}
              onChange={(newAttrs) => {
                const newHotspots = hotspots.map((h) =>
                  h.id === hotspot.id ? newAttrs : h
                );
                onHotspotsChange(newHotspots);
              }}
            />
          ))}

          {/* Çizilmekte olan (aktif) dikdörtgen */}
          {newHotspot && (
            <Rect
              x={newHotspot.width < 0 ? newHotspot.x + newHotspot.width : newHotspot.x}
              y={newHotspot.height < 0 ? newHotspot.y + newHotspot.height : newHotspot.y}
              width={Math.abs(newHotspot.width)}
              height={Math.abs(newHotspot.height)}
              fill="rgba(99, 102, 241, 0.2)"
              stroke="#6366f1"
              strokeWidth={1}
              dash={[4, 4]}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
