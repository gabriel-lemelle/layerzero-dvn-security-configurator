'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Plus, Minus, Shield, X } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DVN } from '@/lib/dvns';
import { DVNS, DVN_CATEGORY_LABELS } from '@/lib/dvns';
import type { Chain } from '@/lib/chains';
import { CHAINS } from '@/lib/chains';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function SecurityIndicator({ 
  requiredCount, 
  optionalThreshold, 
  optionalCount,
  totalDVNs 
}: { 
  requiredCount: number; 
  optionalThreshold: number;
  optionalCount: number;
  totalDVNs: number;
}) {
  const effectiveDVNs = requiredCount + optionalThreshold;
  const selectedTotal = requiredCount + optionalCount;
  
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
      <Shield className="h-5 w-5 text-emerald-500 shrink-0" />
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-lg font-semibold text-zinc-100">
          {effectiveDVNs}
        </span>
        <span className="text-zinc-500 text-sm">of</span>
        <span className="font-mono text-lg font-semibold text-zinc-100">
          {selectedTotal}
        </span>
        <span className="text-zinc-500 text-sm">of</span>
        <span className="font-mono text-lg text-zinc-400">
          {totalDVNs}
        </span>
      </div>
      <div className="ml-auto text-xs text-zinc-500">
        <span className="text-emerald-400">{requiredCount}</span> required
        {optionalThreshold > 0 && (
          <>
            {' + '}
            <span className="text-blue-400">{optionalThreshold}</span>/{optionalCount} optional
          </>
        )}
      </div>
    </div>
  );
}

// Inline DVN card for drag and drop
function DraggableDvnCard({ 
  dvn, 
  onRemove,
  isDragging = false,
}: { 
  dvn: DVN; 
  onRemove?: () => void;
  isDragging?: boolean;
}) {
  const categoryColors: Record<DVN['category'], string> = {
    'native': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'zk-light-client': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'attestation': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'multisig-consortium': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  return (
    <div
      className={cn(
        'w-full text-left rounded-lg border px-3 py-2 transition-all bg-zinc-900/50 border-zinc-800',
        isDragging && 'opacity-50 border-dashed'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-zinc-100 text-sm truncate">{dvn.name}</span>
          <span className={cn(
            'text-xs px-1.5 py-0.5 rounded border shrink-0',
            categoryColors[dvn.category]
          )}>
            {DVN_CATEGORY_LABELS[dvn.category]}
          </span>
        </div>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 shrink-0"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

// Draggable card for Available DVNs section
function DraggableAvailableCard({ dvn, addMode, onAdd }: { dvn: DVN; addMode: 'required' | 'optional'; onAdd: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `available-${dvn.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-stretch gap-2">
      <div 
        className={cn(
          'flex-1 min-w-0 cursor-grab active:cursor-grabbing touch-none',
          isDragging && 'opacity-50'
        )}
        {...attributes}
        {...listeners}
      >
        <DraggableDvnCard dvn={dvn} />
      </div>
      <button
        onClick={onAdd}
        className={cn(
          'px-2 rounded-md border transition-colors flex items-center justify-center shrink-0',
          addMode === 'required'
            ? 'bg-emerald-600/20 hover:bg-emerald-600/40 border-emerald-600/50 text-emerald-400'
            : 'bg-blue-600/20 hover:bg-blue-600/40 border-blue-600/50 text-blue-400'
        )}
        title={`Add to ${addMode === 'required' ? 'Required' : 'Optional'}`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

// Sortable card for Required/Optional sections
function SortableDvnCard({ dvn, onRemove }: { dvn: DVN; onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dvn.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="cursor-grab active:cursor-grabbing touch-none"
      {...attributes}
      {...listeners}
    >
      <DraggableDvnCard dvn={dvn} onRemove={onRemove} isDragging={isDragging} />
    </div>
  );
}

// Droppable zone component
function DroppableZone({ 
  id, 
  children, 
  className,
  isOver,
}: { 
  id: string; 
  children: React.ReactNode; 
  className?: string;
  isOver?: boolean;
}) {
  const { setNodeRef } = useDroppable({ id });
  
  return (
    <div ref={setNodeRef} className={cn(className, isOver && 'ring-2 ring-offset-2 ring-offset-zinc-950')}>
      {children}
    </div>
  );
}

interface ComposerProps {
  sourceChain: Chain;
  destChain: Chain;
  requiredDVNs: DVN[];
  optionalDVNs: DVN[];
  optionalThreshold: number;
  onSourceChainChange: (chain: Chain) => void;
  onDestChainChange: (chain: Chain) => void;
  onRequiredDVNsChange: (dvns: DVN[]) => void;
  onOptionalDVNsChange: (dvns: DVN[]) => void;
  onOptionalThresholdChange: (threshold: number) => void;
}

export function Composer({
  sourceChain,
  destChain,
  requiredDVNs,
  optionalDVNs,
  optionalThreshold,
  onSourceChainChange,
  onDestChainChange,
  onRequiredDVNsChange,
  onOptionalDVNsChange,
  onOptionalThresholdChange,
}: ComposerProps) {
  const [categoryFilter, setCategoryFilter] = useState<DVN['category'] | 'all'>('all');
  const [addMode, setAddMode] = useState<'required' | 'optional'>('required');
  const [activeDvn, setActiveDvn] = useState<DVN | null>(null);

  const [overZone, setOverZone] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedIds = useMemo(() => {
    return new Set([...requiredDVNs, ...optionalDVNs].map(d => d.id));
  }, [requiredDVNs, optionalDVNs]);

  const availableDVNs = useMemo(() => {
    return DVNS.filter(dvn => {
      if (selectedIds.has(dvn.id)) return false;
      if (categoryFilter !== 'all' && dvn.category !== categoryFilter) return false;
      return true;
    });
  }, [selectedIds, categoryFilter]);

  const addDvn = (dvn: DVN) => {
    if (addMode === 'required') {
      onRequiredDVNsChange([...requiredDVNs, dvn]);
    } else {
      onOptionalDVNsChange([...optionalDVNs, dvn]);
    }
  };

  const removeFromRequired = (dvnId: string) => {
    onRequiredDVNsChange(requiredDVNs.filter(d => d.id !== dvnId));
  };

  const removeFromOptional = (dvnId: string) => {
    onOptionalDVNsChange(optionalDVNs.filter(d => d.id !== dvnId));
  };

  const handleThresholdChange = (delta: number) => {
    const newValue = Math.max(0, Math.min(optionalDVNs.length, optionalThreshold + delta));
    onOptionalThresholdChange(newValue);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;
    
    // Check if dragging from available (prefixed with "available-")
    if (activeId.startsWith('available-')) {
      const dvnId = activeId.replace('available-', '');
      const dvn = DVNS.find(d => d.id === dvnId);
      setActiveDvn(dvn || null);
    } else {
      const dvn = [...requiredDVNs, ...optionalDVNs].find(d => d.id === activeId);
      setActiveDvn(dvn || null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      const overId = over.id as string;
      if (overId === 'required-zone' || requiredDVNs.some(d => d.id === overId)) {
        setOverZone('required');
      } else if (overId === 'optional-zone' || optionalDVNs.some(d => d.id === overId)) {
        setOverZone('optional');
      } else {
        setOverZone(null);
      }
    } else {
      setOverZone(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDvn(null);
    setOverZone(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dragging from available
    const isFromAvailable = activeId.startsWith('available-');
    const actualDvnId = isFromAvailable ? activeId.replace('available-', '') : activeId;

    // Find where the dragged item came from
    const fromRequired = !isFromAvailable && requiredDVNs.some(d => d.id === actualDvnId);
    const fromOptional = !isFromAvailable && optionalDVNs.some(d => d.id === actualDvnId);

    // Determine target container
    const toRequired = overId === 'required-zone' || requiredDVNs.some(d => d.id === overId);
    const toOptional = overId === 'optional-zone' || optionalDVNs.some(d => d.id === overId);

    // Get the DVN being moved
    const dvn = isFromAvailable 
      ? DVNS.find(d => d.id === actualDvnId)
      : [...requiredDVNs, ...optionalDVNs].find(d => d.id === actualDvnId);
    if (!dvn) return;

    // From Available to Required/Optional
    if (isFromAvailable) {
      if (toRequired) {
        onRequiredDVNsChange([...requiredDVNs, dvn]);
      } else if (toOptional) {
        onOptionalDVNsChange([...optionalDVNs, dvn]);
      }
      return;
    }

    // Moving from Required to Optional
    if (fromRequired && toOptional) {
      onRequiredDVNsChange(requiredDVNs.filter(d => d.id !== actualDvnId));
      onOptionalDVNsChange([...optionalDVNs, dvn]);
    }
    // Moving from Optional to Required
    else if (fromOptional && toRequired) {
      onOptionalDVNsChange(optionalDVNs.filter(d => d.id !== actualDvnId));
      onRequiredDVNsChange([...requiredDVNs, dvn]);
    }
    // Reordering within Required
    else if (fromRequired && toRequired && actualDvnId !== overId) {
      const oldIndex = requiredDVNs.findIndex(d => d.id === actualDvnId);
      const newIndex = requiredDVNs.findIndex(d => d.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newRequired = [...requiredDVNs];
        newRequired.splice(oldIndex, 1);
        newRequired.splice(newIndex, 0, dvn);
        onRequiredDVNsChange(newRequired);
      }
    }
    // Reordering within Optional
    else if (fromOptional && toOptional && actualDvnId !== overId) {
      const oldIndex = optionalDVNs.findIndex(d => d.id === actualDvnId);
      const newIndex = optionalDVNs.findIndex(d => d.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOptional = [...optionalDVNs];
        newOptional.splice(oldIndex, 1);
        newOptional.splice(newIndex, 0, dvn);
        onOptionalDVNsChange(newOptional);
      }
    }
  };

  return (
    <section className="space-y-6">
      {/* Security Indicator */}
      <SecurityIndicator
        requiredCount={requiredDVNs.length}
        optionalThreshold={optionalThreshold}
        optionalCount={optionalDVNs.length}
        totalDVNs={DVNS.length}
      />

      {/* Chain Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Source Chain</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-100">
                <span className="flex items-center gap-2">
                  {sourceChain.name}
                  <span className="text-xs text-zinc-500 font-mono">eid:{sourceChain.eid}</span>
                </span>
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-zinc-900 border-zinc-800">
              {CHAINS.map(chain => (
                <DropdownMenuItem
                  key={chain.id}
                  onClick={() => onSourceChainChange(chain)}
                  className={cn(
                    'cursor-pointer text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100',
                    chain.id === sourceChain.id && 'bg-zinc-800'
                  )}
                >
                  {chain.name}
                  <span className="ml-auto text-xs text-zinc-500 font-mono">eid:{chain.eid}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Destination Chain</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-100">
                <span className="flex items-center gap-2">
                  {destChain.name}
                  <span className="text-xs text-zinc-500 font-mono">eid:{destChain.eid}</span>
                </span>
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-zinc-900 border-zinc-800">
              {CHAINS.map(chain => (
                <DropdownMenuItem
                  key={chain.id}
                  onClick={() => onDestChainChange(chain)}
                  className={cn(
                    'cursor-pointer text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100',
                    chain.id === destChain.id && 'bg-zinc-800'
                  )}
                >
                  {chain.name}
                  <span className="ml-auto text-xs text-zinc-500 font-mono">eid:{chain.eid}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* DVN Configuration */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
      <div className="space-y-6">
        {/* Available DVNs - Full Width */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-400">Available DVNs</h3>
            <div className="flex items-center gap-3">
              {/* Mode Toggle */}
              <div className="flex items-center rounded-lg border border-zinc-800 p-0.5 bg-zinc-900">
                <button
                  onClick={() => setAddMode('required')}
                  className={cn(
                    'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                    addMode === 'required'
                      ? 'bg-emerald-600 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  )}
                >
                  Required
                </button>
                <button
                  onClick={() => setAddMode('optional')}
                  className={cn(
                    'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                    addMode === 'optional'
                      ? 'bg-blue-600 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  )}
                >
                  Optional
                </button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs text-zinc-500 hover:text-zinc-300 h-7">
                    {categoryFilter === 'all' ? 'All Categories' : DVN_CATEGORY_LABELS[categoryFilter]}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                  <DropdownMenuItem 
                    onClick={() => setCategoryFilter('all')}
                    className="cursor-pointer text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100"
                  >
                    All Categories
                  </DropdownMenuItem>
                  {(Object.keys(DVN_CATEGORY_LABELS) as DVN['category'][]).map(cat => (
                    <DropdownMenuItem
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className="cursor-pointer text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100"
                    >
                      {DVN_CATEGORY_LABELS[cat]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <SortableContext
            items={availableDVNs.map(d => `available-${d.id}`)}
            strategy={verticalListSortingStrategy}
          >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableDVNs.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4 text-center col-span-full">
                {selectedIds.size === DVNS.length ? 'All DVNs selected' : 'No DVNs match filter'}
              </p>
            ) : (
              availableDVNs.map(dvn => (
                <DraggableAvailableCard 
                  key={dvn.id} 
                  dvn={dvn} 
                  addMode={addMode} 
                  onAdd={() => addDvn(dvn)} 
                />
              ))
            )}
          </div>
          </SortableContext>
        </div>

        {/* Required and Optional DVNs - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Required DVNs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Required DVNs
                </h3>
                <span className="text-xs text-zinc-500">{requiredDVNs.length} selected</span>
              </div>
              <SortableContext
                items={requiredDVNs.map(d => d.id)}
                strategy={verticalListSortingStrategy}
              >
                <DroppableZone 
                  id="required-zone"
                  className={cn(
                    "min-h-[200px] rounded-lg border border-emerald-600/30 bg-emerald-600/5 p-3 space-y-2 transition-all",
                    overZone === 'required' && 'ring-2 ring-emerald-500 border-emerald-500'
                  )}
                >
                  {requiredDVNs.length === 0 ? (
                    <div className="h-full min-h-[176px] flex items-center justify-center">
                      <p className="text-sm text-zinc-600 text-center">
                        Drag DVNs here or click +
                      </p>
                    </div>
                  ) : (
                    requiredDVNs.map(dvn => (
                      <SortableDvnCard
                        key={dvn.id}
                        dvn={dvn}
                        onRemove={() => removeFromRequired(dvn.id)}
                      />
                    ))
                  )}
                </DroppableZone>
              </SortableContext>
              <p className="text-xs text-zinc-500">
                All required DVNs must verify each message
              </p>
            </div>

            {/* Optional DVNs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-blue-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Optional DVNs
                </h3>
                <span className="text-xs text-zinc-500">{optionalDVNs.length} selected</span>
              </div>
              <SortableContext
                items={optionalDVNs.map(d => d.id)}
                strategy={verticalListSortingStrategy}
              >
                <DroppableZone 
                  id="optional-zone"
                  className={cn(
                    "min-h-[200px] rounded-lg border border-blue-600/30 bg-blue-600/5 p-3 space-y-2 transition-all",
                    overZone === 'optional' && 'ring-2 ring-blue-500 border-blue-500'
                  )}
                >
                  {optionalDVNs.length === 0 ? (
                    <div className="h-full min-h-[176px] flex items-center justify-center">
                      <p className="text-sm text-zinc-600 text-center">
                        Drag DVNs here or click +
                      </p>
                    </div>
                  ) : (
                    optionalDVNs.map(dvn => (
                      <SortableDvnCard
                        key={dvn.id}
                        dvn={dvn}
                        onRemove={() => removeFromOptional(dvn.id)}
                      />
                    ))
                  )}
                </DroppableZone>
              </SortableContext>
              <div className="flex items-center gap-3">
                <label className="text-xs text-zinc-500 shrink-0">Threshold:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleThresholdChange(-1)}
                    disabled={optionalThreshold <= 0}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-300"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <Input
                    type="number"
                    value={optionalThreshold}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) {
                        onOptionalThresholdChange(Math.max(0, Math.min(optionalDVNs.length, val)));
                      }
                    }}
                    min={0}
                    max={optionalDVNs.length}
                    className="w-16 text-center bg-zinc-900 border-zinc-800 text-zinc-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => handleThresholdChange(1)}
                    disabled={optionalThreshold >= optionalDVNs.length}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-300"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-zinc-600">of {optionalDVNs.length}</span>
              </div>
              <p className="text-xs text-zinc-500">
                At least {optionalThreshold} optional DVN{optionalThreshold !== 1 && 's'} must verify
              </p>
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeDvn ? (
              <div className="opacity-90">
                <DraggableDvnCard dvn={activeDvn} />
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </section>
  );
}
