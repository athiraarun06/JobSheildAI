import React from 'react';
import { RiskCategory } from '../types/jobshield.ts';
import { ShieldAlert, ShieldCheck, AlertTriangle, ShieldX } from 'lucide-react';

interface RiskGaugeProps {
  score: number; // 0 - 100
  category: RiskCategory;
  size?: number;
  showDetails?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  category,
  size = 200,
  showDetails = true
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // We'll draw a 240-degree gauge arc
  const arcDegree = 240;
  const strokeDashoffset = circumference - (score / 100) * (circumference * (arcDegree / 360));
  const totalOffset = circumference * ((360 - arcDegree) / 360);

  // Category styling
  const config = {
    low: {
      color: '#10b981', // emerald-500
      glow: 'rgba(16, 185, 129, 0.25)',
      label: 'Low Risk',
      sublabel: 'Standard legitimate employment markers observed',
      icon: ShieldCheck,
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    moderate: {
      color: '#f59e0b', // amber-500
      glow: 'rgba(245, 158, 11, 0.25)',
      label: 'Moderate Risk',
      sublabel: 'Ambiguous attributes require manual due diligence',
      icon: AlertTriangle,
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    },
    high: {
      color: '#f97316', // orange-500
      glow: 'rgba(249, 115, 22, 0.25)',
      label: 'High Risk',
      sublabel: 'Multiple corroborated scam indicators detected',
      icon: ShieldAlert,
      badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30'
    },
    very_high: {
      color: '#f43f5e', // rose-500
      glow: 'rgba(244, 63, 94, 0.35)',
      label: 'Very High Risk',
      sublabel: 'Critical scam hallmarks or advance-fee patterns',
      icon: ShieldX,
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    }
  }[category];

  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-120"
          style={{ filter: `drop-shadow(0 0 16px ${config.glow})` }}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * (arcDegree / 360)} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Animated Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={config.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * (arcDegree / 360)} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2">
          <Icon className="w-6 h-6 mb-1" style={{ color: config.color }} />
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-extrabold tracking-tight font-mono text-slate-100">
              {score}
            </span>
            <span className="text-sm font-semibold text-slate-400 ml-1">/100</span>
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-1">
            Risk Index
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="text-center mt-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.badgeBg}`}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></span>
            {config.label}
          </span>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">
            {config.sublabel}
          </p>
        </div>
      )}
    </div>
  );
};
