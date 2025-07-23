"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, Language, TranslationKey } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => any
  tArray: (key: TranslationKey) => string[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en') // Default to English
  
  useEffect(() => {
    // Check if there's a saved language preference
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): any => {
    const translation = translations[language][key as TranslationKey]
    if (translation !== undefined) {
      return translation
    }
    // Fallback to English if translation not found
    return translations.en[key as TranslationKey] || key
  }

  const tArray = (key: TranslationKey): string[] => {
    const translation = translations[language][key]
    if (Array.isArray(translation)) {
      return translation
    }
    // Fallback to English if translation not found
    const fallback = translations.en[key]
    return Array.isArray(fallback) ? fallback : []
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: changeLanguage, 
      t, 
      tArray 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}