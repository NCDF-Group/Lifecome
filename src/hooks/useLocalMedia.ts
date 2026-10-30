"use client"

import { useEffect, useState } from "react"

const stopTracks = (stream: MediaStream) => stream.getTracks().forEach((track) => track.stop())

/** The patient's own camera and microphone, released as soon as the page is left. */
export function useLocalMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isBlocked, setIsBlocked] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)

  useEffect(() => {
    let active = true
    let acquired: MediaStream | null = null
    // mediaDevices is missing on insecure pages
    const request = navigator.mediaDevices?.getUserMedia({ video: true, audio: true }) ?? Promise.reject(new Error("Unavailable"))

    request.then(
      (media) => {
        // The page may have been left while the browser was asking for permission
        if (!active) return stopTracks(media)
        acquired = media
        setStream(media)
      },
      () => {
        if (active) setIsBlocked(true)
      }
    )

    return () => {
      active = false
      if (acquired) stopTracks(acquired)
    }
  }, [])

  const toggleMuted = () => {
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = isMuted
    })
    setIsMuted(!isMuted)
  }

  const toggleCamera = () => {
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = isCameraOff
    })
    setIsCameraOff(!isCameraOff)
  }

  return { stream, isBlocked, isMuted, isCameraOff, toggleMuted, toggleCamera }
}
