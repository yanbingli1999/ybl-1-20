import { useState } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { testScenarios, medicines, getDisease, getBreed } from '@/data/gameData'
import type { TestScenario } from '@/data/gameData'
import { X, FlaskConical, ChevronRight, AlertTriangle, Package, Coins, Wrench } from 'lucide-react'

interface ScenarioDrawerProps {
  open: boolean
  onClose: () => void
}

export default function ScenarioDrawer({ open, onClose }: ScenarioDrawerProps) {
  const loadScenario = useGameStore(s => s.loadScenario)

  function handleLoad(scenario: TestScenario) {
    loadScenario(scenario)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-[420px] max-w-[90vw] h-full bg-gray-950 border-l border-cyan-900/30 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-900/30">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-purple-400" />
            <h2 className="font-display text-sm tracking-widest text-purple-300 uppercase">
              测试场景
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {testScenarios.map(scenario => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onLoad={() => handleLoad(scenario)}
            />
          ))}
        </div>

        <div className="px-5 py-3 border-t border-gray-800/50">
          <p className="text-[10px] text-gray-600 text-center">
            加载场景后将回到待接诊状态 · 重置游戏可恢复普通开局
          </p>
        </div>
      </div>
    </div>
  )
}

function ScenarioCard({ scenario, onLoad }: { scenario: TestScenario; onLoad: () => void }) {
  const [expanded, setExpanded] = useState(false)

  const damagedCount = Object.values(scenario.equipmentStatus).filter(s => s === 'damaged').length
  const totalInventory = Object.values(scenario.inventory).reduce((sum, v) => sum + v, 0)

  return (
    <div className="rounded-xl border border-gray-800/60 bg-gray-900/40 overflow-hidden transition-all hover:border-purple-800/40">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <span className="text-2xl">{scenario.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-display text-sm text-gray-200 tracking-wide">
            {scenario.name}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
            {scenario.description}
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2.5 border-t border-gray-800/40 pt-2.5">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-800/30 rounded-lg p-2 text-center border border-gray-700/20">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Coins className="w-3 h-3 text-yellow-400" />
                <span className="text-[10px] text-gray-500">星币</span>
              </div>
              <span className={`font-display text-base ${scenario.coins < 30 ? 'text-red-400' : 'text-yellow-300'}`}>
                {scenario.coins}
              </span>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-2 text-center border border-gray-700/20">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Wrench className="w-3 h-3 text-orange-400" />
                <span className="text-[10px] text-gray-500">设备</span>
              </div>
              <span className={`font-display text-base ${damagedCount > 0 ? 'text-red-400' : 'text-green-300'}`}>
                {damagedCount > 0 ? `${damagedCount}损坏` : '正常'}
              </span>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-2 text-center border border-gray-700/20">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Package className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px] text-gray-500">库存</span>
              </div>
              <span className={`font-display text-base ${totalInventory === 0 ? 'text-red-400' : 'text-cyan-300'}`}>
                {totalInventory === 0 ? '耗尽' : `${totalInventory}份`}
              </span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">库存明细</div>
            <div className="flex flex-wrap gap-1.5">
              {medicines.map(med => {
                const stock = scenario.inventory[med.id] ?? 0
                return (
                  <span
                    key={med.id}
                    className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${
                      stock > 0
                        ? 'border-gray-700/40 text-gray-400 bg-gray-800/30'
                        : 'border-red-900/40 text-red-500 bg-red-900/20'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: med.color }}
                    />
                    {med.name} ×{stock}
                  </span>
                )
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">病例</div>
            <div className="space-y-1">
              {scenario.cases.map((c) => {
                const disease = getDisease(c.diseaseId)
                const breed = getBreed(c.breedId)
                return (
                  <div key={c.id} className="flex items-center gap-2 text-[11px]">
                    <span>{breed?.emoji}</span>
                    <span className="text-gray-400">{c.petName}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-gray-500">{disease?.name}</span>
                    {c.urgency === 'high' && (
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                    )}
                    {c.symptomIds.length > 1 && (
                      <span className="text-[9px] text-purple-400 bg-purple-900/30 px-1 py-0.5 rounded">
                        +{c.symptomIds.length - 1}干扰
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">说明</div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              {scenario.description}
            </p>
          </div>

          <button
            onClick={onLoad}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-purple-900/30 border border-purple-700/30 text-purple-300 text-xs hover:bg-purple-900/50 transition-colors"
          >
            <FlaskConical className="w-3 h-3" />
            加载此场景
          </button>
        </div>
      )}
    </div>
  )
}
