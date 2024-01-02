import { useRef, useEffect } from "react"

export function usePrevious<T>(value: T) {
  const ref = useRef<T>()
  // useEffect will be executed after the return, thus what's returned in the previous value that was registered.
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}