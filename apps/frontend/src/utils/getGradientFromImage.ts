export async function getGradientFromImage(imageUrl: string) {
  if (!import.meta.server)
    return
  const sharp = (await import("sharp")).default

  const response = await fetch(imageUrl)

  if (!response.ok) {
    return null
  }

  const buffer = await response.arrayBuffer()
  try {
    // Load the image
    const image = sharp(buffer)

    // Resize image to a smaller size for faster processing
    const resizedImage = await image.resize(100, 100, { fit: "inside" }).toBuffer()

    // Extract dominant colors
    const { dominant } = await image.stats()

    // Convert Sharp's color format to CSS RGB format
    const topColor = `rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`
    const offset = 30

    // Create a slightly darker bottom color
    const bottomColor = `rgb(${Math.max(dominant.r - offset, 0)}, ${Math.max(dominant.g - offset, 0)}, ${Math.max(dominant.b
      - offset, 0)})`

    // Create vertical gradient
    const gradient = `linear-gradient(to bottom, ${topColor}, ${bottomColor})`
    return gradient
  }
  catch (error) {
    console.error("Error:", error)
    return null
  }
}
