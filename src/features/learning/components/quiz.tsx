"use client";

import React, { useState, useCallback } from "react";
import type { QuizQuestion } from "@/features/learning/types";

interface QuizProps {
  quiz: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
}

export function Quiz({ quiz, onComplete }: QuizProps) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const handleAnswer = useCallback(
    (chosen: number) => {
      if (selectedChoice !== null) return;
      setSelectedChoice(chosen);
      const q = quiz[qIndex];
      const correct = chosen === q.answer;
      const newAnswers = [...answers];
      newAnswers[qIndex] = correct;
      setAnswers(newAnswers);

      setTimeout(() => {
        setSelectedChoice(null);
        if (qIndex + 1 >= quiz.length) {
          onComplete(newAnswers.filter(Boolean).length, quiz.length);
        } else {
          setQIndex(qIndex + 1);
        }
      }, 1200);
    },
    [qIndex, quiz, answers, onComplete, selectedChoice]
  );

  if (!quiz.length) return null;
  const q = quiz[qIndex];

  return (
    <div className="train-full-overlay fixed inset-0 z-[1000000020] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#0e0f0c]/30 backdrop-blur-sm" />
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-md shadow-2xl border border-white/50 p-6 animate-scale-in">
        <div className="text-center mb-4">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-[#d4d7d0] text-[#2a2b28] mb-3">
            Quiz · {qIndex + 1}/{quiz.length}
          </span>
          <h2 className="text-xl font-extrabold text-[#0e0f0c] tracking-tight">Check your understanding</h2>
        </div>

        <h4 className="text-sm font-bold text-[#0e0f0c] mb-3 leading-relaxed">{q.question}</h4>

        <div className="space-y-2 mb-4">
          {q.choices.map((c, i) => {
            const isSelected = selectedChoice === i;
            const isCorrect = i === q.answer;
            let classes = "w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 border ";

            if (isSelected) {
              classes += isCorrect
                ? "bg-[#e2f6d5] border-[#9fe870] text-[#163300]"
                : "bg-[#ffd11a]/20 border-[#ffd11a] text-[#0e0f0c]";
            } else if (selectedChoice !== null) {
              classes += isCorrect
                ? "bg-[#e2f6d5] border-[#9fe870] text-[#163300]"
                : "bg-white border-[#d4d7d0] text-[#2a2b28] opacity-50";
            } else {
              classes += "bg-white border-[#d4d7d0] text-[#2a2b28] hover:bg-[#d4d7d0] hover:border-[#dde0da]";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedChoice !== null}
                className={classes}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                    selectedChoice !== null && isCorrect
                      ? "bg-[#9fe870] border-[#9fe870] text-[#0e0f0c]"
                      : isSelected && !isCorrect
                      ? "bg-[#ffd11a] border-[#ffd11a] text-[#0e0f0c]"
                      : "border-[#d4d7d0] text-[#6b6d6a]"
                  }`}>
                    {i === 0 ? "A" : i === 1 ? "B" : i === 2 ? "C" : "D"}
                  </span>
                  {c}
                </div>
              </button>
            );
          })}
        </div>

        {selectedChoice !== null && (
          <div className="text-xs text-[#6b6d6a] bg-[#d4d7d0] rounded-xl p-3 leading-relaxed animate-fade-in">
            {q.explain}
          </div>
        )}
      </div>
    </div>
  );
}
