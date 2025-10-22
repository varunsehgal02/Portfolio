"use client"
import { useModelContext } from "./model-context"

export default function ModelControls() {
  const { isFollowing, setIsFollowing, modelColor, setModelColor, showColorPicker, setShowColorPicker } =
    useModelContext()

  const colors = [
    { name: "red", value: "#ef4444" },
    { name: "yellow", value: "#eab308" },
    { name: "blue", value: "#3b82f6" },
    { name: "green", value: "#22c55e" },
    { name: "white", value: "#ffffff" },
  ]

  return (
    <div className="fixed bottom-8 right-8 z-40 space-y-4">
      {/* Color Picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="w-12 h-12 rounded-full border-2 border-white hover:border-red-500 transition-all duration-300 flex items-center justify-center text-white font-bold hover:scale-110 shadow-lg"
          style={{ backgroundColor: colors.find((c) => c.name === modelColor)?.value }}
          title="Color Picker"
        >
          🎨
        </button>

        {showColorPicker && (
          <div className="absolute bottom-16 right-0 bg-gray-900 border-2 border-red-600 rounded-lg p-4 space-y-2 animate-fade-in shadow-lg shadow-red-600/30">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => {
                  setModelColor(color.name)
                  setShowColorPicker(false)
                }}
                className="w-full px-4 py-2 rounded text-white font-semibold transition-all duration-300 hover:scale-105 capitalize"
                style={{ backgroundColor: color.value, color: color.name === "white" ? "black" : "white" }}
              >
                {color.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Follow/Not Follow Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => setIsFollowing(true)}
          className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center font-bold hover:scale-110 shadow-lg ${
            isFollowing
              ? "bg-red-600 border-red-600 text-white shadow-red-600/50"
              : "border-white text-white hover:border-red-500"
          }`}
          title="Follow Mouse"
        >
          👁️
        </button>

        <button
          onClick={() => setIsFollowing(false)}
          className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center font-bold hover:scale-110 shadow-lg ${
            !isFollowing
              ? "bg-red-600 border-red-600 text-white shadow-red-600/50"
              : "border-white text-white hover:border-red-500"
          }`}
          title="Return to Place"
        >
          🏠
        </button>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
