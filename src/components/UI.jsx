import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Globe, Info, X, RotateCcw, BarChart3 } from 'lucide-react'

export function UI({ selectedMarker, layers, onLayerToggle, onReset, onCloseInfo }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    // Reset analyzing state when marker changes
    React.useEffect(() => {
        setIsAnalyzing(false)
    }, [selectedMarker])

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-50">
            {/* Header */}
            <header className="flex justify-between items-start pointer-events-auto">
                <div className="flex flex-col">
                    <h1 className="text-5xl font-bold text-white tracking-tighter drop-shadow-lg">LIVING EARTH</h1>
                    <div className="h-1 w-20 bg-blue-500 mt-2 rounded-full"></div>
                    <p className="text-blue-200/80 text-sm mt-1 font-mono tracking-widest uppercase">Planetary Dashboard</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => onLayerToggle('clouds')}
                        className={`group flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all shadow-lg cursor-pointer ${layers.clouds ? 'bg-blue-500/20 border-blue-500/50 text-white' : 'bg-black/40 border-white/10 text-gray-400'}`}
                    >
                        <Layers size={16} className={layers.clouds ? "text-blue-400" : "text-gray-400"} />
                        <span className="text-sm font-medium">Clouds</span>
                    </button>
                    <button
                        onClick={() => onLayerToggle('events')}
                        className={`group flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all shadow-lg cursor-pointer ${layers.events ? 'bg-red-500/20 border-red-500/50 text-white' : 'bg-black/40 border-white/10 text-gray-400'}`}
                    >
                        <Globe size={16} className={layers.events ? "text-red-400" : "text-gray-400"} />
                        <span className="text-sm font-medium">Events</span>
                    </button>
                    <button
                        onClick={onReset}
                        className="group flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-white/10 text-white rounded-full backdrop-blur-md border border-white/10 transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                    >
                        <RotateCcw size={16} className="text-blue-400 group-hover:text-white transition-colors" />
                        <span className="text-sm font-medium">Reset</span>
                    </button>
                </div>
            </header>

            {/* Info Panel using Framer Motion */}
            <AnimatePresence>
                {selectedMarker && (
                    <motion.aside
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="w-96 pointer-events-auto"
                    >
                        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                            {/* Glowing background gradient */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/30 transition-all duration-700"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono text-blue-300 border border-blue-500/30 uppercase tracking-widest">
                                        {selectedMarker.type}
                                    </span>
                                    <button onClick={onCloseInfo} className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                                        <X size={16} className="text-white/40 hover:text-white" />
                                    </button>
                                </div>

                                <h2 className="text-3xl font-bold text-white mb-1 leading-tight">{selectedMarker.title}</h2>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div>
                                        <div className="text-white/40 text-[10px] uppercase tracking-widest font-mono mb-1">Latitude</div>
                                        <div className="text-white text-lg font-mono">{selectedMarker.lat.toFixed(4)}°</div>
                                    </div>
                                    <div>
                                        <div className="text-white/40 text-[10px] uppercase tracking-widest font-mono mb-1">Longitude</div>
                                        <div className="text-white text-lg font-mono">{selectedMarker.lon.toFixed(4)}°</div>
                                    </div>
                                </div>

                                {isAnalyzing && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-6 pt-6 border-t border-white/10"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <BarChart3 size={14} className="text-blue-400" />
                                            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Severity Analysis</span>
                                        </div>
                                        {/* Mock Chart */}
                                        <div className="h-24 w-full flex items-end gap-1">
                                            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                                <div key={i} className="flex-1 bg-blue-500/40 hover:bg-blue-500/80 transition-colors rounded-t-sm relative group/bar" style={{ height: `${h}%` }}>
                                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                                        {h}%
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-[9px] text-white/30 mt-2 font-mono">
                                            <span>MON</span>
                                            <span>SUN</span>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="mt-6 pt-6 border-t border-white/10 flex gap-4">
                                    <button
                                        onClick={() => setIsAnalyzing(!isAnalyzing)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-widest ${isAnalyzing ? 'bg-white text-black' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                                    >
                                        {isAnalyzing ? 'Close Analysis' : 'Analyze'}
                                    </button>
                                    <button className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/5 transition-colors">
                                        <Globe size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    )
}
