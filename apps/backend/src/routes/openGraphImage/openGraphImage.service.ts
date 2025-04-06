import { readFile } from "node:fs/promises"
import * as path from "node:path"
import { Injectable } from "@nestjs/common"
import satori from "satori"
import * as sharp from "sharp"

@Injectable()
export class OpenGraphImageService {
  private calculateFontSize = (options: {
    text?: string
    containerWidth?: number
    containerHeight?: number
    padding?: number
    charWidth?: number
    lineHeight?: number
    minFontSize?: number
    maxFontSize?: number
    safetyFactor?: number
  }) => {
    const {
      text,
      containerWidth = 665,
      containerHeight = 249,
      padding = 10,
      charWidth = 0.6,
      lineHeight = 1.1,
      minFontSize = 12,
      maxFontSize = 120,
      safetyFactor = 1,
    } = options

    if (!text) {
      return maxFontSize
    }

    const effectiveWidth = containerWidth - (padding * 2)
    const effectiveHeight = containerHeight - (padding * 2)
    const words = text.split(" ")

    let low = minFontSize
    let high = maxFontSize
    let optimal = minFontSize

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const averageCharWidthPx = mid * charWidth
      const lines = []
      let currentLine = words[0]
      let currentLineWidthChars = words[0].length

      for (let i = 1; i < words.length; i++) {
        const word = words[i]
        const lineWithWordChars = currentLineWidthChars + 1 + word.length

        if (lineWithWordChars * averageCharWidthPx <= effectiveWidth) {
          currentLine += ` ${word}`
          currentLineWidthChars = lineWithWordChars
        }
        else {
          lines.push(currentLine)
          currentLine = word
          currentLineWidthChars = word.length
        }
      }
      lines.push(currentLine)

      const totalHeight = lines.length * mid * lineHeight

      if (totalHeight <= effectiveHeight) {
        optimal = mid
        low = mid + 1
      }
      else {
        high = mid - 1
      }
    }

    return Math.floor(optimal * safetyFactor)
  }

  async getOpenGraphImage(title: string, imageUrl: string, isAvatarPlaceholder: boolean) {
    const [neueHaasUnicaItalic, inter, logoSvg, backgroundSvg, circleBackgroundSvg, defaultMoviePosterSvg, avatarPosterSvg] = await Promise.all([
      readFile(path.join(process.cwd(), "assets/fonts/NeueHaasUnica-Bold.ttf")),
      readFile(path.join(process.cwd(), "assets/fonts/Inter-SemiBold.ttf")),
      readFile(path.join(process.cwd(), "assets/logo.svg"), "utf-8"),
      readFile(path.join(process.cwd(), "assets/mediaOgImageBackground.svg"), "utf-8"),
      readFile(path.join(process.cwd(), "assets/mediaOgImageBackgroundCircle.svg"), "utf-8"),
      readFile(path.join(process.cwd(), "assets/defaultMoviePoster.svg"), "utf-8"),
      readFile(path.join(process.cwd(), "assets/avatarPoster.svg"), "utf-8"),
    ])

    // Calculate optimal font size

    const fontSize = this.calculateFontSize({
      text: title,
      containerWidth: 665,
      containerHeight: 310,
      padding: 0,
      minFontSize: 16,
      maxFontSize: 96,
    })

    const svg = await satori(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      {
        type: "div",
        props: {
          style: {
            position: "relative",
            backgroundColor: "#0D0D0D",
            width: "1200px",
            height: "600px",
            display: "flex",
          },
          children: [
            {
              type: "img",
              props: {
                src: `data:image/svg+xml;base64,${Buffer.from(backgroundSvg).toString("base64")}`,
                alt: "",
                style: {
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: "840px",
                  height: "340px",
                },
              },
            },
            {
              type: "img",
              props: {
                src: `data:image/svg+xml;base64,${Buffer.from(circleBackgroundSvg).toString("base64")}`,
                alt: "",
                style: {
                  position: "absolute",
                  width: "1068px",
                  height: "1068px",
                  top: "36px",
                  left: "486px",
                },
              },
            },
            {
              type: "img",
              props: {
                src: imageUrl || `data:image/svg+xml;base64,${Buffer.from(isAvatarPlaceholder ? avatarPosterSvg : defaultMoviePosterSvg).toString("base64")}`,
                alt: "",
                style: {
                  width: "407px",
                  height: "600px",
                  objectFit: "cover",
                },
              },
            },
            {
              type: "div",
              props: {
                style: {
                  width: "793px",
                  padding: "64px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "600px",
                  position: "relative",
                },
                children: [
                  {
                    type: "h1",
                    props: {
                      style: {
                        fontSize: `${fontSize}px`,
                        fontFamily: "Neue Haas Unica",
                        fontWeight: 700,
                        display: "block",
                        color: "#fff",
                        fontStyle: "italic",
                        lineHeight: 1.1,
                        width: "100%",
                        maxHeight: "310px",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                        margin: 0,
                      },
                      children: title,
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                      },
                      children: [
                        {
                          type: "p",
                          props: {
                            style: {
                              fontFamily: "Inter",
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "36px",
                              lineHeight: "110%",
                              color: "rgba(255, 255, 255, 0.6)",
                              margin: 0,
                            },
                            children: "Movie Tracker",
                          },
                        },
                        {
                          type: "img",
                          props: {
                            src: `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`,
                            alt: "",
                            style: {
                              width: "128px",
                              height: "128px",
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },

          ],
        },
      },
      {
        width: 1200,
        height: 600,
        embedFont: true,
        debug: false,
        fonts: [
          {
            name: "Neue Haas Unica",
            data: neueHaasUnicaItalic,
            weight: 700,
            style: "italic",
          },
          {
            name: "Inter",
            data: inter,
            weight: 500,
            style: "normal",
          },
        ],
      },
    )

    return sharp(Buffer.from(svg)).webp({ quality: 100 }).toBuffer()
  }
}
