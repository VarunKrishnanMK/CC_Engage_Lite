import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import grapesjs from "grapesjs"
import grapesjsMjml from "grapesjs-mjml"
import mjml2html from "mjml-browser"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { useThemeStore } from "../stores/themeStore"
import "grapesjs/dist/css/grapes.min.css"

const DEFAULT_MJML_TEMPLATE = `<mjml>
  <mj-body background-color="#f4f4f5">
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-text font-size="28px" font-weight="700" align="center" color="#c9200d">
          Secure Her Future with Axis Bank SSY
        </mj-text>
        <mj-text font-size="16px" align="center" color="#333333">
          Start early, invest wisely for her bright future.
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section background-color="#ffffff" padding-top="0">
      <mj-column>
        <mj-image src="/Image (Family Bonding).svg" alt="Family Bonding" padding="0" />
      </mj-column>
    </mj-section>

    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-text font-size="15px" color="#4a4a4a">
          Dear {{Customer_Name}}, Axis Bank's Sukanya Samriddhi Yojana offers a trusted,
          rewarding investment option for your daughter’s future.
        </mj-text>
        <mj-button background-color="#f6b728" color="#ffffff" border-radius="6px" href="#">
          Open an SSY Account Today
        </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`

const sanitizeFileName = (value) => value.replace(/[^a-z0-9._-]/gi, "_")

const getExtensionFromMime = (mimeType = "") => {
  if (!mimeType) return "bin"
  const [, subtype = "bin"] = mimeType.split("/")
  return subtype.split("+")[0]
}

const dataUrlToBlob = (dataUrl) => {
  const [meta, payload = ""] = dataUrl.split(",")
  const mimeMatch = meta.match(/data:(.*?);base64/)
  const mimeType = mimeMatch?.[1] || "application/octet-stream"
  const binary = window.atob(payload)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }

  return { blob: new Blob([bytes], { type: mimeType }), mimeType }
}

const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onloadend = () => resolve(reader.result)
  reader.onerror = () => reject(new Error("Failed to convert blob to data URL"))
  reader.readAsDataURL(blob)
})

const ensureMjmlDocument = (rawMarkup) => {
  const trimmed = (rawMarkup || "").trim()
  if (!trimmed) {
    return DEFAULT_MJML_TEMPLATE
  }

  if (trimmed.startsWith("<mjml")) {
    return trimmed
  }

  return `<mjml><mj-body>${trimmed}</mj-body></mjml>`
}

const rewriteMarkupWithAssetPath = (markup, assetEntries, mode = "bundle") => {
  if (!markup || !Array.isArray(assetEntries) || assetEntries.length === 0) {
    return markup
  }

  let rewritten = markup

  assetEntries
    .filter((entry) => entry?.status === "included")
    .forEach((entry) => {
      const target = mode === "inline" ? entry.dataUrl : `./assets/${entry.fileName}`
      if (!target) {
        return
      }

      const sourceCandidates = new Set([entry.src])
      try {
        const absoluteUrl = new URL(entry.src, window.location.origin)
        sourceCandidates.add(absoluteUrl.toString())
        sourceCandidates.add(absoluteUrl.pathname)
      } catch {
        // Ignore invalid URL, raw source replacement is still attempted.
      }

      sourceCandidates.forEach((candidate) => {
        if (!candidate) {
          return
        }
        rewritten = rewritten.split(candidate).join(target)
      })
    })

  return rewritten
}

const getEditorCode = (editor) => {
  const rawMjml = editor.getHtml()
  const css = editor.getCss()
  const mjml = ensureMjmlDocument(rawMjml)
  const compileResult = mjml2html(mjml, { validationLevel: "soft" })

  return {
    mjml,
    html: compileResult.html,
    css,
  }
}

const collectAssets = async (editor, { includeDataUrl = false } = {}) => {
  const assetSources = editor.AssetManager.getAll().map((asset) => asset.get("src")).filter(Boolean)
  const uniqueAssetSources = [...new Set(assetSources)]
  const assets = []

  for (let index = 0; index < uniqueAssetSources.length; index += 1) {
    const src = uniqueAssetSources[index]
    try {
      let blob
      let fileName

      if (src.startsWith("data:")) {
        const converted = dataUrlToBlob(src)
        blob = converted.blob
        const extension = getExtensionFromMime(converted.mimeType)
        fileName = `asset-${index + 1}.${sanitizeFileName(extension)}`
      } else {
        const response = await fetch(src)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        blob = await response.blob()
        const url = new URL(src, window.location.origin)
        const pathName = url.pathname.split("/").pop() || `asset-${index + 1}`
        fileName = sanitizeFileName(pathName)
      }

      const entry = { src, fileName, blob, status: "included" }
      if (includeDataUrl) {
        entry.dataUrl = src.startsWith("data:") ? src : await blobToDataUrl(blob)
      }
      assets.push(entry)
    } catch (error) {
      assets.push({ src, status: "failed", reason: error?.message || "Unable to fetch asset" })
    }
  }

  return assets
}

const GrapesMjmlEditorPanel = forwardRef(function GrapesMjmlEditorPanel({ initialMjml = "" }, ref) {
  const theme = useThemeStore((state) => state.theme)
  const containerRef = useRef(null)
  const editorRef = useRef(null)
  const initialMjmlRef = useRef(initialMjml)

  useEffect(() => {
    if (!containerRef.current || editorRef.current) {
      return
    }

    const editor = grapesjs.init({
      container: containerRef.current,
      fromElement: false,
      height: "100%",
      width: "auto",
      storageManager: false,
      plugins: [grapesjsMjml],
      pluginsOpts: {
        [grapesjsMjml]: {
          resetDevices: true,
          resetStyleManager: true,
        },
      },
      assetManager: {
        upload: false,
        assets: [
          { src: "/Image (Family Bonding).svg", name: "Family Bonding" },
          { src: "/Image (Parent & Child).svg", name: "Parent & Child" },
          { src: "/Image (Future Success).svg", name: "Future Success" },
          { src: "/Image (Empowerment).svg", name: "Empowerment" },
        ],
      },
    })

    editor.setComponents(ensureMjmlDocument(initialMjmlRef.current || DEFAULT_MJML_TEMPLATE))
    editorRef.current = editor

    return () => {
      editor.destroy()
      editorRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!editorRef.current) {
      return
    }
    if (!initialMjml?.trim()) {
      return
    }
    editorRef.current.setComponents(ensureMjmlDocument(initialMjml))
  }, [initialMjml])

  useImperativeHandle(ref, () => ({
    downloadHtml: async () => {
      if (!editorRef.current) {
        return
      }

      const code = getEditorCode(editorRef.current)
      const assetEntries = await collectAssets(editorRef.current, { includeDataUrl: true })
      const workingHtml = rewriteMarkupWithAssetPath(code.html, assetEntries, "inline")
      saveAs(new Blob([workingHtml], { type: "text/html;charset=utf-8" }), "creative-template.html")
    },
    downloadBundle: async () => {
      if (!editorRef.current) {
        return
      }

      const code = getEditorCode(editorRef.current)
      const assetEntries = await collectAssets(editorRef.current)
      const bundleHtml = rewriteMarkupWithAssetPath(code.html, assetEntries, "bundle")

      const zip = new JSZip()
      zip.file("creative-template.html", bundleHtml)
      zip.file("creative-template.css", code.css)

      const assetsFolder = zip.folder("assets")
      assetEntries
        .filter((entry) => entry.status === "included" && entry.blob)
        .forEach((entry) => {
          assetsFolder?.file(entry.fileName, entry.blob)
        })

      zip.file("assets/asset-manifest.json", JSON.stringify(assetEntries.map((entry) => ({
        src: entry.src,
        fileName: entry.fileName,
        status: entry.status,
        reason: entry.reason,
      })), null, 2))

      const blob = await zip.generateAsync({ type: "blob" })
      saveAs(blob, "creative-code-bundle.zip")
    },
  }), [])

  return (
    <div className={`gjs-editor-wrap ${theme === "dark" ? "gjs-theme-dark" : "gjs-theme-light"}`} style={{ height: "94vh" }}>
      <div ref={containerRef} className="h-100" />
    </div>
  )
})

export default GrapesMjmlEditorPanel
