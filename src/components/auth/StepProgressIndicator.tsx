import React from "react"

interface StepProgressIndicatorProps {
  currentStep: number // 1-4
  totalSteps?: number
  stepLabel: string
}

/**
 * Renders the exact dot-line-dot step progress indicator matching the Figma design.
 * E.g. Step 1: ●——○——○——○
 *      Step 2: ●——●——○——○
 *      Step 3: ●——●——●——○
 *      Step 4: ●——●——●——●
 */
export function StepProgressIndicator({
  currentStep,
  totalSteps = 4,
  stepLabel,
}: StepProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-600">
        Step {currentStep} of {totalSteps}{" "}
        <span className="text-slate-500">·</span>{" "}
        <span className="font-semibold text-slate-800">{stepLabel}</span>
      </div>
      {/* Dot-line-dot progress bar matching Figma exactly */}
      <div className="flex items-center">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1
          const isDone = stepNum <= currentStep
          const isLast = stepNum === totalSteps
          return (
            <React.Fragment key={stepNum}>
              {/* Dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${
                  isDone ? "bg-[#0062F5]" : "bg-slate-300"
                }`}
              />
              {/* Connecting line (between dots) */}
              {!isLast && (
                <div
                  className={`flex-1 h-[2.5px] transition-colors ${
                    stepNum < currentStep ? "bg-[#0062F5]" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
