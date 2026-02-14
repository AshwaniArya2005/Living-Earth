import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Globe, Info, X, RotateCcw, Zap, Wind } from 'lucide-react'
import { generateEventAnalysis } from '../utils/analysisGenerator'
import { fetchWeatherData } from '../utils/weather'

// Typewriter effect component
const Typewriter = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('')

    useEffect(() => {
        setDisplayedText('')
        let i = 0
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i))
                i++
            } else {
                clearInterval(timer)
                if (onComplete) onComplete()
            }
        }, 20)
        return () => clearInterval(timer)
    }, [text])

    return <p className="text-blue-200/80 text-xs font-mono leading-relaxed">{displayedText}</p>
}

// Compass Component
const Compass = ({ direction }) => (
    <div className="relative w-16 h-16 bg-black/40 rounded-full border border-white/10 flex items-center justify-center shadow-inner">
        <div className="absolute text-[8px] text-white/50 top-1">N</div>
        <div className="absolute text-[8px] text-white/50 bottom-1">S</div>
        <div className="absolute text-[8px] text-white/50 left-1">W</div>
        <div className="absolute text-[8px] text-white/50 right-1">E</div>
        {/* Needle */}
        <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: direction }}
            transition={{ type: "spring", damping: 10 }}
            className="w-0.5 h-10 bg-red-500 rounded-full origin-center relative"
        >
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-red-500 rounded-full blur-[2px]"></div>
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white rounded-full scale-50"></div>
        </motion.div>
    </div>
)

// Helper to determine threat styles
const getThreatStyle = (status) => {
    if (!status) return 'border-white/10 shadow-2xl'

    switch (status) {
        case 'CRITICAL':
        case 'DANGEROUS':
        case 'ERUPTION':
            return 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
        case 'WARNING':
        case 'MELTING':
            return 'border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.3)]'
        case 'TRACKING':
        case 'STABLE':
            return 'border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]'
        default:
            return 'border-white/10 shadow-2xl'
    }
}

export function UI({ selectedMarker, layers, onLayerToggle, onReset, onCloseInfo }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisData, setAnalysisData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [weatherData, setWeatherData] = useState(null)

    // Reset observing state when marker changes
    useEffect(() => {
        setIsAnalyzing(false)
        setAnalysisData(null)
        setWeatherData(null)
    }, [selectedMarker])

    // Generate analysis
    useEffect(() => {
        const loadAnalysis = async () => {
            if (isAnalyzing && selectedMarker) {
                setLoading(true)
                const weather = await fetchWeatherData(selectedMarker.lat, selectedMarker.lon)
                setWeatherData(weather) // Store for compass
                const analysis = generateEventAnalysis(selectedMarker, weather)
                setAnalysisData(analysis)
                setLoading(false)
            }
        }
        loadAnalysis()
    }, [isAnalyzing, selectedMarker])

    const threatStyle = getThreatStyle(analysisData?.status)

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-50 overflow-hidden">
            {/* Header */}
            <header className="flex justify-between items-start pointer-events-auto">
                <div className="flex flex-col">
                    <h1 className="text-5xl font-bold text-white tracking-tighter drop-shadow-lg">LIVING EARTH</h1>
                    <div className="h-1 w-20 bg-blue-500 mt-2 rounded-full"></div>
                    <p className="text-blue-200/80 text-sm mt-1 font-mono tracking-widest uppercase">Planetary Dashboard</p>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => onLayerToggle('clouds')} className={`group flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all shadow-lg cursor-pointer ${layers.clouds ? 'bg-blue-500/20 border-blue-500/50 text-white' : 'bg-black/40 border-white/10 text-gray-400'}`}>
                        <Layers size={16} className={layers.clouds ? "text-blue-400" : "text-gray-400"} />
                        <span className="text-sm font-medium">Clouds</span>
                    </button>
                    <button onClick={() => onLayerToggle('events')} className={`group flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all shadow-lg cursor-pointer ${layers.events ? 'bg-red-500/20 border-red-500/50 text-white' : 'bg-black/40 border-white/10 text-gray-400'}`}>
                        <Globe size={16} className={layers.events ? "text-red-400" : "text-gray-400"} />
                        <span className="text-sm font-medium">Events</span>
                    </button>
                    <button onClick={onReset} className="group flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-white/10 text-white rounded-full backdrop-blur-md border border-white/10 transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer">
                        <RotateCcw size={16} className="text-blue-400 group-hover:text-white transition-colors" />
                        <span className="text-sm font-medium">Reset</span>
                    </button>
                </div>
            </header>

            {/* Info Panel */}
            <AnimatePresence>
                {selectedMarker && (
                    <motion.aside
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="w-96 pointer-events-auto max-h-[80vh] flex flex-col"
                    >
                        <motion.div
                            className={`bg-black/60 backdrop-blur-2xl border rounded-3xl p-6 relative group flex flex-col overflow-hidden transition-all duration-500 ${threatStyle}`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/30 transition-all duration-700 pointer-events-none"></div>

                            {/* Scrollable Content Container */}
                            <div className="relative z-10 flex flex-col gap-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-track-transparent pr-2 max-h-full">
                                <div className="flex justify-between items-start shrink-0">
                                    <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono text-blue-300 border border-blue-500/30 uppercase tracking-widest">
                                        {selectedMarker.type}
                                    </span>
                                    <button onClick={onCloseInfo} className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer sticky top-0 right-0 z-20">
                                        <X size={16} className="text-white/40 hover:text-white" />
                                    </button>
                                </div>

                                <div className="shrink-0">
                                    <h2 className="text-3xl font-bold text-white mb-1 leading-tight break-words">{selectedMarker.title}</h2>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <div className="text-white/40 text-[10px] uppercase tracking-widest font-mono mb-1">Latitude</div>
                                            <div className="text-white text-lg font-mono">{selectedMarker.lat.toFixed(4)}°</div>
                                        </div>
                                        <div>
                                            <div className="text-white/40 text-[10px] uppercase tracking-widest font-mono mb-1">Longitude</div>
                                            <div className="text-white text-lg font-mono">{selectedMarker.lon.toFixed(4)}°</div>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isAnalyzing ? (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="pt-6 border-t border-white/10 shrink-0"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Zap size={14} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                                                    <span className="text-xs font-bold text-white/90 uppercase tracking-widest">
                                                        {loading ? "SEARCHING SATELLITE..." : "LIVE ANALYSIS"}
                                                    </span>
                                                </div>

                                                {analysisData && (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${analysisData.status === 'CRITICAL' || analysisData.status === 'DANGEROUS' || analysisData.status === 'ERUPTION' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-400'}`}>
                                                        {analysisData.status}
                                                    </span>
                                                )}
                                            </div>

                                            {loading ? (
                                                <div className="h-24 flex items-center justify-center text-blue-300/50 text-[10px] font-mono animate-pulse">
                                                    ESTABLISHING UPLINK...
                                                </div>
                                            ) : analysisData && (
                                                <>
                                                    <div className="bg-black/30 rounded-lg p-3 border border-white/5 mb-4">
                                                        <Typewriter text={analysisData.summary} />
                                                    </div>

                                                    <div className="flex gap-2 mb-4">
                                                        {/* Compass Widget */}
                                                        {weatherData && (
                                                            <div className="flex flex-col items-center justify-center bg-white/5 rounded p-2 w-20 shrink-0">
                                                                <div className="mb-1 text-[9px] text-white/40 uppercase flex items-center gap-1">
                                                                    <Wind size={8} /> Wind
                                                                </div>
                                                                <Compass direction={weatherData.wind_direction_10m} />
                                                                <div className="mt-1 text-[9px] text-white/60 font-mono">{weatherData.wind_direction_10m}°</div>
                                                            </div>
                                                        )}

                                                        {/* Dynamic Stats Grid */}
                                                        <div className="grid grid-cols-2 gap-2 flex-1">
                                                            {analysisData.stats.map((stat, i) => (
                                                                <div key={i} className="bg-white/5 rounded p-2 text-center flex flex-col justify-center">
                                                                    <div className="text-[9px] text-white/40 uppercase mb-1">{stat.label}</div>
                                                                    <div className="text-white font-mono text-xs">{stat.value} <span className="text-[9px] text-white/30">{stat.unit}</span></div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            <button onClick={() => setIsAnalyzing(false)} className="w-full py-2 mt-2 text-xs font-bold rounded-lg transition-all uppercase tracking-widest bg-white text-black hover:bg-gray-200">
                                                Stop Analysis
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="pt-6 border-t border-white/10 shrink-0"
                                        >
                                            <button onClick={() => setIsAnalyzing(true)} className="w-full py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20">
                                                Analyze Event
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    )
}
