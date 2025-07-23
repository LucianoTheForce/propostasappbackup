"use client"

import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "pt" : "en")
  }

  return (
    <motion.button
      onClick={toggleLanguage}
      className="fixed top-6 left-6 z-50 bg-white/10 text-black border border-black/10 rounded-full px-4 py-2 text-sm font-mono tracking-wider hover:bg-white/20 hover:border-black/20 transition-all duration-300 backdrop-blur-md shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          <motion.span
            key={language}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {language === "en" ? "EN" : "PT"}
          </motion.span>
        </AnimatePresence>
        <span className="text-xs opacity-60">|</span>
        <motion.span
          className="text-xs opacity-60"
          animate={{ opacity: language === "en" ? 0.6 : 0.3 }}
        >
          {language === "en" ? "PT" : "EN"}
        </motion.span>
      </div>
    </motion.button>
  )
}