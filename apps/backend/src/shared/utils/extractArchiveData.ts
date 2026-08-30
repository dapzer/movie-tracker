import { Buffer } from "node:buffer"
import * as yauzl from "yauzl"
import { DataImportArchiveLimitError, InvalidDataImportArchiveError } from "@/shared/errors/dataImport"

const MEBIBYTE = 1024 * 1024
const MAX_COMPRESSED_BYTES = 50 * MEBIBYTE
const MAX_ENTRIES = 500
const MAX_ENTRY_BYTES = 50 * MEBIBYTE
const MAX_SELECTED_BYTES = 100 * MEBIBYTE
const SUPPORTED_EXTENSION = /\.(?:csv|json)$/i
const UNIX_FILE_TYPE_MASK = 0o170000
const UNIX_FILE_TYPE_DIRECTORY = 0o040000
const UNIX_FILE_TYPE_REGULAR = 0o100000
const UNIX_OPERATING_SYSTEM = 3

interface SelectedArchiveEntry {
  entry: yauzl.Entry
  fileName: string
}

export async function extractArchiveData(archive: Buffer | Uint8Array): Promise<Map<string, string>> {
  if (archive.byteLength > MAX_COMPRESSED_BYTES) {
    throw new DataImportArchiveLimitError({ limit: "the 50 MiB compressed input limit" })
  }

  const zipFile = await openArchive(Buffer.from(archive))

  try {
    const entries = await readCentralDirectory(zipFile)
    const selectedEntries = preflightEntries(entries)
    const extracted = new Map<string, string>()
    let actualSelectedBytes = 0

    for (const selectedEntry of selectedEntries) {
      const bytes = await readEntry(zipFile, selectedEntry.entry, actualSelectedBytes)
      actualSelectedBytes += bytes.byteLength
      extracted.set(selectedEntry.fileName, bytes.toString("utf8"))
    }

    return extracted
  }
  catch (error) {
    if (error instanceof DataImportArchiveLimitError || error instanceof InvalidDataImportArchiveError) {
      throw error
    }

    throw new InvalidDataImportArchiveError({ cause: error })
  }
  finally {
    zipFile.close()
  }
}

function openArchive(archive: Buffer): Promise<yauzl.ZipFile> {
  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(archive, {
      decodeStrings: true,
      lazyEntries: true,
      strictFileNames: true,
      validateEntrySizes: true,
    }, (error, zipFile) => {
      if (error !== null) {
        reject(new InvalidDataImportArchiveError({ cause: error }))
        return
      }

      resolve(zipFile)
    })
  })
}

function readCentralDirectory(zipFile: yauzl.ZipFile): Promise<yauzl.Entry[]> {
  if (zipFile.entryCount > MAX_ENTRIES) {
    return Promise.reject(new DataImportArchiveLimitError({ limit: "the 500 archive entry limit" }))
  }

  return new Promise((resolve, reject) => {
    const entries: yauzl.Entry[] = []

    const onEntry = (entry: yauzl.Entry): void => {
      entries.push(entry)
      zipFile.readEntry()
    }
    const onEnd = (): void => {
      zipFile.off("entry", onEntry)
      resolve(entries)
    }
    const onError = (error: Error): void => {
      zipFile.off("entry", onEntry)
      zipFile.off("end", onEnd)
      reject(new InvalidDataImportArchiveError({ cause: error }))
    }

    zipFile.on("entry", onEntry)
    zipFile.once("end", onEnd)
    zipFile.once("error", onError)
    zipFile.readEntry()
  })
}

function preflightEntries(entries: yauzl.Entry[]): SelectedArchiveEntry[] {
  let declaredSelectedBytes = 0
  const selectedNames = new Set<string>()
  const selectedEntries: SelectedArchiveEntry[] = []

  for (const entry of entries) {
    const fileName = validateEntryNameAndType(entry)
    if (fileName === undefined) {
      continue
    }
    if (!SUPPORTED_EXTENSION.test(fileName)) {
      continue
    }

    if (entry.uncompressedSize > MAX_ENTRY_BYTES) {
      throw new DataImportArchiveLimitError({ limit: "the 50 MiB uncompressed file limit" })
    }

    declaredSelectedBytes += entry.uncompressedSize
    if (declaredSelectedBytes > MAX_SELECTED_BYTES) {
      throw new DataImportArchiveLimitError({ limit: "the 100 MiB selected uncompressed limit" })
    }

    if (selectedNames.has(fileName)) {
      throw new InvalidDataImportArchiveError({ message: "Data import archive contains duplicate file names." })
    }

    selectedNames.add(fileName)
    selectedEntries.push({ entry, fileName })
  }

  return selectedEntries
}

function validateEntryNameAndType(entry: yauzl.Entry): string | undefined {
  if ((entry.generalPurposeBitFlag & 0x1) !== 0) {
    throw new InvalidDataImportArchiveError({ message: "Data import archive contains an encrypted entry." })
  }

  validateRawEntryFileName(entry.fileNameRaw)
  const fileName = normalizeArchiveFileName(entry.fileName)
  const unixFileType = getUnixFileType(entry)
  if (entry.fileName.endsWith("/") || unixFileType === UNIX_FILE_TYPE_DIRECTORY) {
    return undefined
  }

  if (unixFileType !== undefined && unixFileType !== 0 && unixFileType !== UNIX_FILE_TYPE_REGULAR) {
    throw new InvalidDataImportArchiveError({ message: "Data import archive contains a non-regular file entry." })
  }

  return fileName
}

function validateRawEntryFileName(fileNameRaw: Buffer): void {
  const rawFileName = fileNameRaw.toString("latin1")

  if (
    rawFileName.startsWith("/")
    || /^[A-Z]:[\\/]/i.test(rawFileName)
    || fileNameRaw.includes(0)
    || fileNameRaw.includes(0x5C)
    || rawFileName.split(/[\\/]/).includes("..")
  ) {
    throw new InvalidDataImportArchiveError({ message: "Data import archive contains an unsafe file name." })
  }
}

function getUnixFileType(entry: yauzl.Entry): number | undefined {
  if ((entry.versionMadeBy >>> 8) !== UNIX_OPERATING_SYSTEM) {
    return undefined
  }

  return (entry.externalFileAttributes >>> 16) & UNIX_FILE_TYPE_MASK
}

function normalizeArchiveFileName(fileName: string): string {
  if (fileName.includes("\\")) {
    throw new InvalidDataImportArchiveError({ message: "Data import archive contains an unsafe file name." })
  }

  if (
    fileName.startsWith("/")
    || /^[A-Z]:\//i.test(fileName)
    || fileName.includes("\0")
    || fileName.split("/").includes("..")
  ) {
    throw new InvalidDataImportArchiveError({ message: "Data import archive contains an unsafe file name." })
  }

  const normalized = fileName.split("/").filter(segment => segment.length > 0 && segment !== ".").join("/")
  if (normalized.length === 0) {
    throw new InvalidDataImportArchiveError({ message: "Data import archive contains an unsafe file name." })
  }

  return normalized
}

function readEntry(zipFile: yauzl.ZipFile, entry: yauzl.Entry, accumulatedSize: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    zipFile.openReadStream(entry, (error, stream) => {
      if (error !== null) {
        reject(error)
        return
      }
      if (!stream) {
        reject(new InvalidDataImportArchiveError({ message: "Data import archive entry could not be read." }))
        return
      }

      const chunks: Buffer[] = []
      let entrySize = 0

      stream.on("data", (chunk: Buffer) => {
        entrySize += chunk.byteLength
        if (entrySize > MAX_ENTRY_BYTES) {
          stream.destroy(new DataImportArchiveLimitError({ limit: "the 50 MiB uncompressed file limit" }))
          return
        }

        if (accumulatedSize + entrySize > MAX_SELECTED_BYTES) {
          stream.destroy(new DataImportArchiveLimitError({ limit: "the 100 MiB selected uncompressed limit" }))
          return
        }

        chunks.push(chunk)
      })
      stream.once("error", reject)
      stream.once("end", () => resolve(Buffer.concat(chunks)))
    })
  })
}
