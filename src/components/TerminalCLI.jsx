import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import {
  Terminal as TerminalIcon,
  Folder,
  FileCode,
  Check,
} from "lucide-react";

export const TerminalCLI = () => {
  const [step, setStep] = useState(0);
  const codeText = "create-structure project.json";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentIdx = 0;
    const typing = setInterval(() => {
      if (currentIdx <= codeText.length) {
        setDisplayText(codeText.slice(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(typing);
        setTimeout(() => setStep(1), 500);
      }
    }, 100);
    return () => clearInterval(typing);
  }, []);

  useEffect(() => {
    if (step === 1) {
      setTimeout(() => setStep(2), 800);
    }
  }, [step]);

  return (
    <section className="container mx-auto px-6 py-24">
      <SectionHeader
        title="Tooling & Open Source"
        subtitle="I build CLI tools that automate the mundane parts of architecture."
      />

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="glass-card rounded-lg overflow-hidden border border-white/5 shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-[#0a192f] px-4 py-2 border-b border-white/5 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="font-mono text-[10px] text-gray-500">
                bash — create-structure-cli
              </span>
              <div className="w-12" />
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm h-[320px]">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <span className="text-golden">$</span>
                <span>{displayText}</span>
                {displayText.length < codeText.length && (
                  <motion.div
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-golden"
                  />
                )}
              </div>

              {step >= 1 && (
                <div className="text-gray-400 mb-4">
                  <p className="text-blue-400">
                    [info] Reading architecture definitions...
                  </p>
                  <p className="text-green-400">✔ project.json validated</p>
                  <p className="animate-pulse">Building folder tree...</p>
                </div>
              )}

              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-1 text-gray-300"
                >
                  <div className="flex items-center gap-2">
                    <Folder size={14} className="text-golden" />
                    <span>src/</span>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <Folder size={14} className="text-golden" />
                    <span>controllers/</span>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <Folder size={14} className="text-golden" />
                    <span>models/</span>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <FileCode size={14} className="text-blue-400" />
                    <span>app.ts</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-green-400">
                    <Check size={14} />
                    <span>Structure created successfully in 42ms</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-golden/10 border border-golden/20 rounded-full text-golden text-xs font-mono mb-6 uppercase tracking-wider">
            npm highlight
          </div>
          <h3 className="text-4xl font-header font-black text-accent mb-6 uppercase">
            create-structure-cli
          </h3>
          <p className="text-gray-400 mb-8 leading-relaxed">
            A specialized tool for backend developers to bootstrap complex,
            multi-layered Node.js architectures in seconds. Defined by a single
            JSON schema.
          </p>
          <ul className="space-y-4 mb-10">
            <li className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-1.5 h-1.5 rounded-full bg-golden" />
              Recursive directory generation from JSON
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-1.5 h-1.5 rounded-full bg-golden" />
              Support for Boilerplate templates (TS/ESM)
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-1.5 h-1.5 rounded-full bg-golden" />
              Custom middleware injection points
            </li>
          </ul>
          <a
            href="https://www.npmjs.com/package/create-structure-cli"
            target="_blank"
            className="inline-flex items-center gap-2 text-golden font-bold interactive border-b border-golden/30 pb-1 hover:border-golden transition-all"
          >
            Install via NPM <Check size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};
