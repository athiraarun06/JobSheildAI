import React from 'react';
import { FeatureContribution } from '../types/jobshield.ts';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

interface FeatureAttributionChartProps {
  contributions: FeatureContribution[];
}

export const FeatureAttributionChart: React.FC<FeatureAttributionChartProps> = ({ contributions }) => {
  if (!contributions || contributions.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-sm">
        No salient token weights exceeded the attribution threshold for this posting.
      </div>
    );
  }

  // Find max absolute value for normalized bar widths
  const maxAbsValue = Math.max(...contributions.map(c => Math.abs(c.value)), 1.0);

  const scamIndicators = contributions.filter(c => c.direction === 'scam_indicator');
  const legitIndicators = contributions.filter(c => c.direction === 'legitimacy_indicator');

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Model Feature Attribution (XAI / SHAP Decomposition)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Individual token and indicator contributions (w_i * x_i) to the final risk classification.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
            Elevates Scam Risk (+)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
            Elevates Legitimacy (-)
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {contributions.slice(0, 10).map((item, idx) => {
          const isScam = item.direction === 'scam_indicator';
          const percentWidth = Math.min(100, Math.round((Math.abs(item.value) / maxAbsValue) * 100));

          return (
            <div key={idx} className="group bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  {isScam ? (
                    <TrendingUp className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span className="font-mono font-semibold text-slate-200">
                    "{item.feature}"
                  </span>
                  <span className="text-[11px] text-slate-400 hidden md:inline">
                    ({item.label})
                  </span>
                </div>
                <span className={`font-mono font-bold ${isScam ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {item.value > 0 ? `+${item.value}` : item.value}
                </span>
              </div>

              {/* Dual Directional Bar */}
              <div className="w-full bg-slate-800/60 rounded-full h-2 overflow-hidden flex">
                {isScam ? (
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all duration-700"
                    style={{ width: `${percentWidth}%` }}
                  ></div>
                ) : (
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${percentWidth}%` }}
                  ></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-start gap-2 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          Linear feature importance is computed from the TF-IDF n-gram vectorizer multiplied by model coefficients trained on the Employment Scam Aegean Dataset. Positive values push the log-odds toward recruitment fraud.
        </span>
      </div>
    </div>
  );
};
