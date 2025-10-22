"use client"

import { createContext, useContext, useState, useCallback } from "react"

const ModelContext = createContext()

export function ModelProvider({ children }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [modelColor, setModelColor] = useState("red")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [globalMousePos, setGlobalMousePos] = useState({ x: 0, y: 0 })

  const handleGlobalMouseMove = useCallback((event) => {
    setGlobalMousePos({
      x: event.clientX / window.innerWidth,
      y: event.clientY / window.innerHeight,
    })
  }, [])

  return (
    <ModelContext.Provider
      value={{
        isFollowing,
        setIsFollowing,
        modelColor,
        setModelColor,
        showColorPicker,
        setShowColorPicker,
        globalMousePos,
        handleGlobalMouseMove,
      }}
    >
      {children}
    </ModelContext.Provider>
  )
}

export function useModelContext() {
  const context = useContext(ModelContext)
  if (!context) {
    throw new Error("useModelContext must be used within ModelProvider")
  }
  return context
}
