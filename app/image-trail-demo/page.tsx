"use client"
import ImageTrail, { ImageTrailItem } from "@/components/fancy/components/image/image-trail"
import dynamic from "next/dynamic"
import { useState, useEffect, useRef } from "react"

// Lazy load MuxPlayer to avoid SSR issues
const LazyMuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
      <span className="text-xs text-gray-500">Loading...</span>
    </div>
  ),
})

// MuxVideo component with improved error handling and buffer management
const MuxVideo = ({ playbackId }: { playbackId: string }) => {
  const [hasError, setHasError] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [fallbackToImage, setFallbackToImage] = useState(false)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    // Delay loading the video to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300) // Increased delay to ensure DOM is fully ready

    return () => clearTimeout(timer)
  }, [])

  // Handle errors and fallback
  const handleError = (e: any) => {
    console.error("Mux player error:", e)

    // If it's a buffer stalled error, try to recover before falling back
    if (e?.details === "bufferStalledError" && playerRef.current) {
      try {
        // Try to recover by reloading the player
        if (playerRef.current.load) {
          console.log("Attempting to recover from buffer stalled error...")
          playerRef.current.load()
          return // Don't set error state yet, give it a chance to recover
        }
      } catch (recoveryError) {
        console.error("Recovery attempt failed:", recoveryError)
      }
    }

    // If recovery failed or for other errors, fallback to image
    setHasError(true)
    setFallbackToImage(true)
  }

  if (fallbackToImage) {
    // Fallback to a static image when video fails
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center overflow-hidden">
        <img
          src={`https://image.mux.com/${playbackId}/thumbnail.jpg?time=0&width=480`}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
        <span className="text-xs text-white">Video unavailable</span>
      </div>
    )
  }

  if (!isVisible) {
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
        <span className="text-xs text-gray-500">Loading...</span>
      </div>
    )
  }

  return (
    <LazyMuxPlayer
      ref={playerRef}
      playbackId={playbackId}
      streamType="on-demand"
      preload="auto" // Changed from "metadata" to "auto"
      muted
      autoPlay
      playsInline
      loop
      thumbnailTime={1}
      preferPlayback="mse" // Prefer MSE over HLS when available
      maxResolution="720p" // Limit resolution to reduce bandwidth
      style={{ height: "100%", width: "100%", objectFit: "cover" }}
      onError={handleError}
      onLoadStart={() => console.log("Mux video load started")}
      onLoadedData={() => console.log("Mux video data loaded successfully")}
      metadata={{
        video_title: "Trail Video",
        viewer_user_id: "user-trail",
      }}
      debug={false} // Set to true only for debugging
      beaconCollectionDomain="litix.io" // Ensure correct beacon domain
      disableCookies={true} // Disable cookies to avoid potential issues
      envKey="" // Leave empty if you don't have a specific env key
    />
  )
}

const images = [
  "/project1.png",
  "/project2.png",
  "/project4.png",
  "/project5.png",
  "/placeholder-qiy65.png",
  "/brand-identity-concept.png",
  "/abstract-digital-composition.png",
  "/placeholder-c8o86.png",
  "/abstract-motion-graphics.png",
  "/placeholder-9n61g.png",
]

const ImageTrailDemo = () => {
  const [showMuxVideo, setShowMuxVideo] = useState(false)

  useEffect(() => {
    // Delay loading the Mux video to ensure the page is fully loaded
    const timer = setTimeout(() => {
      setShowMuxVideo(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full h-screen bg-white relative text-black">
      <ImageTrail
        threshold={100}
        intensity={0.8}
        keyframes={{ scale: [0.8, 1], opacity: [0, 1, 1, 0] }}
        keyframesOptions={{
          scale: { duration: 0.8, times: [0, 1] },
          opacity: { duration: 1.5, times: [0, 0.1, 0.9, 1] },
        }}
        repeatChildren={1}
      >
        {images.map((item, index) => (
          <ImageTrailItem key={index}>
            <div className="w-32 h-32 md:w-48 md:h-48 relative overflow-hidden rounded-lg shadow-lg">
              <img src={item || "/placeholder.svg"} alt={`image ${index}`} className="object-cover w-full h-full" />
            </div>
          </ImageTrailItem>
        ))}

        {showMuxVideo && (
          <ImageTrailItem>
            <div className="w-32 h-32 md:w-48 md:h-48 relative overflow-hidden rounded-lg shadow-lg">
              <MuxVideo playbackId="qExy4UX4RyRhVrbZM02a9VbeffcOTGnrCZ6eI6AtDTKg" />
            </div>
          </ImageTrailItem>
        )}
      </ImageTrail>
      <p className="text-sm sm:text-lg absolute top-4 left-6 font-medium pointer-events-none z-50">
        Move your cursor across the screen
      </p>
    </div>
  )
}

export default ImageTrailDemo
